import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { useCustomizerStore, LayerItem } from '../store/useCustomizerStore';

export const preloadFont = (fontFamily: string): Promise<void> =>
  document.fonts.load(`16px "${fontFamily}"`).then(() => {});

export const useFabric = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { setLayers, setCanUndo, setCanRedo } = useCustomizerStore();
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isHistoryProcessing = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    // Fabric v6: pass width/height explicitly
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 300,
      height: 620,
      backgroundColor: '#C6FF00',
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    const syncLayers = () => {
      const objects = canvas.getObjects();
      const newLayers: LayerItem[] = objects.map((obj) => ({
        id: (obj as any).id ?? uuidv4(),
        type: obj.type ?? 'object',
        name: (obj as any).name ?? (obj.type === 'i-text' ? 'Text Layer' : 'Layer'),
        locked: !(obj as any).selectable,
        opacity: (obj as any).opacity ?? 1,
        visible: (obj as any).visible ?? true,
      })).reverse();
      setLayers(newLayers);
    };

    const saveHistory = () => {
      if (isHistoryProcessing.current) return;
      const snapshot = JSON.stringify(canvas.toJSON(['id', 'name']));
      // Truncate forward history on new action
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(snapshot);
      if (historyRef.current.length > 50) historyRef.current.shift();
      else historyIndexRef.current++;
      syncLayers();
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(false);
    };

    canvas.on('object:added', saveHistory);
    canvas.on('object:modified', saveHistory);
    canvas.on('object:removed', saveHistory);

    canvas.on('after:render', () => {
      window.dispatchEvent(new Event('fabric-sync'));
    });

    // Save initial empty state
    historyRef.current = [JSON.stringify(canvas.toJSON(['id', 'name']))];
    historyIndexRef.current = 0;

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [setLayers, setCanUndo, setCanRedo]);

  const restoreSnapshot = useCallback(async (snapshot: string) => {
    if (!fabricRef.current) return;
    isHistoryProcessing.current = true;
    await fabricRef.current.loadFromJSON(JSON.parse(snapshot));
    fabricRef.current.renderAll();
    isHistoryProcessing.current = false;

    const objects = fabricRef.current.getObjects();
    setLayers(
      objects.map((obj) => ({
        id: (obj as any).id ?? uuidv4(),
        type: obj.type ?? 'object',
        name: (obj as any).name ?? 'Layer',
        locked: !(obj as any).selectable,
        opacity: (obj as any).opacity ?? 1,
        visible: (obj as any).visible ?? true,
      })).reverse()
    );
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [setLayers, setCanUndo, setCanRedo]);

  const undo = useCallback(async () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      await restoreSnapshot(historyRef.current[historyIndexRef.current]);
    }
  }, [restoreSnapshot]);

  const redo = useCallback(async () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      await restoreSnapshot(historyRef.current[historyIndexRef.current]);
    }
  }, [restoreSnapshot]);

  const addText = useCallback(async (textStr: string, font: string, color: string) => {
    if (!fabricRef.current) return;
    await preloadFont(font);
    const text = new fabric.IText(textStr, {
      left: 60,
      top: 200,
      fontFamily: font,
      fill: color,
      fontSize: 40,
    });
    (text as any).id = uuidv4();
    (text as any).name = `Text: ${textStr.substring(0, 10)}`;
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    fabricRef.current.requestRenderAll();
  }, []);

  const addImage = useCallback((file: File) => {
    if (!fabricRef.current) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result as string;
      // Fabric v6: fromURL returns a Promise
      fabric.FabricImage.fromURL(data).then((img) => {
        img.scaleToWidth(200);
        img.set({ left: 50, top: 100 });
        (img as any).id = uuidv4();
        (img as any).name = 'Uploaded Image';
        fabricRef.current?.add(img);
        fabricRef.current?.setActiveObject(img);
        fabricRef.current?.requestRenderAll();
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const addStickerEmoji = useCallback((emoji: string) => {
    if (!fabricRef.current) return;
    const text = new fabric.FabricText(emoji, {
      left: 100,
      top: 250,
      fontSize: 64,
    });
    (text as any).id = uuidv4();
    (text as any).name = `Sticker ${emoji}`;
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    fabricRef.current.requestRenderAll();
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    if (!fabricRef.current) return;
    // Directly set background — no dummy object (avoids history loop)
    fabricRef.current.set('backgroundColor', color);
    fabricRef.current.requestRenderAll();

    // Manually snapshot for undo
    if (isHistoryProcessing.current) return;
    const snapshot = JSON.stringify(fabricRef.current.toJSON(['id', 'name']));
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snapshot);
    if (historyRef.current.length <= 50) historyIndexRef.current++;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [setCanUndo, setCanRedo]);

  return {
    canvasRef,
    fabricRef,
    undo,
    redo,
    addText,
    addImage,
    addStickerEmoji,
    setBackgroundColor,
  };
};
