import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { useCustomizerStore, LayerItem } from '../store/useCustomizerStore';

// Monkey patch Fabric's object model loosely to allow custom IDs if needed, though we can just use set()
export const preloadFont = (fontFamily: string): Promise<void> => {
  return document.fonts.load(`16px "${fontFamily}"`).then(() => {});
};

export const useFabric = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { setLayers, setCanUndo, setCanRedo } = useCustomizerStore();
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isHistoryProcessing = useRef(false);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 300,
      height: 620,
      backgroundColor: '#C6FF00',
      preserveObjectStacking: true, // Keep standard z-index ordering
    });
    fabricRef.current = canvas;

    const saveHistory = () => {
      if (isHistoryProcessing.current) return;
      const json = canvas.toJSON();
      // Truncate future history if we modified after an undo
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      }
      historyRef.current.push(JSON.stringify(json));
      if (historyRef.current.length > 50) historyRef.current.shift();
      else historyIndexRef.current++;
      
      updateLayerState();
      syncStoreHistory();
    };

    const updateLayerState = () => {
      const objects = canvas.getObjects();
      const newLayers: LayerItem[] = objects.map((obj) => ({
        id: (obj as any).id || uuidv4(),
        type: obj.type || 'object',
        name: (obj as any).name || (obj.type === 'i-text' ? 'Text Layer' : 'Layer'),
        locked: !obj.selectable,
        opacity: obj.opacity || 1,
      })).reverse(); // top layers first
      setLayers(newLayers);
    };

    const syncStoreHistory = () => {
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    };

    canvas.on('object:added', saveHistory);
    canvas.on('object:modified', saveHistory);
    canvas.on('object:removed', saveHistory);
    
    canvas.on('after:render', () => {
      window.dispatchEvent(new Event('fabric-sync'));
    });
    
    // Initial state
    canvas.clear();
    saveHistory();

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  const undo = useCallback(async () => {
    if (historyIndexRef.current > 0 && fabricRef.current) {
      isHistoryProcessing.current = true;
      historyIndexRef.current--;
      const json = JSON.parse(historyRef.current[historyIndexRef.current]);
      await fabricRef.current.loadFromJSON(json);
      fabricRef.current.renderAll();
      isHistoryProcessing.current = false;
      setLayers([]); // re-trigger update if needed, but saveHistory won't fire. Let's force it:
      
      const objects = fabricRef.current.getObjects();
      setLayers(objects.map((obj) => ({
        id: (obj as any).id || uuidv4(),
        type: obj.type || 'object',
        name: (obj as any).name || 'Layer',
        locked: !obj.selectable,
        opacity: obj.opacity || 1,
      })).reverse());
      
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, [setLayers, setCanUndo, setCanRedo]);

  const redo = useCallback(async () => {
    if (historyIndexRef.current < historyRef.current.length - 1 && fabricRef.current) {
      isHistoryProcessing.current = true;
      historyIndexRef.current++;
      const json = JSON.parse(historyRef.current[historyIndexRef.current]);
      await fabricRef.current.loadFromJSON(json);
      fabricRef.current.renderAll();
      isHistoryProcessing.current = false;
      
      const objects = fabricRef.current.getObjects();
      setLayers(objects.map((obj) => ({
        id: (obj as any).id || uuidv4(),
        type: obj.type || 'object',
        name: (obj as any).name || 'Layer',
        locked: !obj.selectable,
        opacity: obj.opacity || 1,
      })).reverse());
      
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, [setLayers, setCanUndo, setCanRedo]);

  const addText = useCallback(async (textStr: string, font: string, color: string) => {
    if (!fabricRef.current) return;
    await preloadFont(font);
    const text = new fabric.IText(textStr, {
      left: 100,
      top: 100,
      fontFamily: font,
      fill: color,
      fontSize: 40,
    });
    (text as any).id = uuidv4();
    (text as any).name = `Text: ${textStr.substring(0, 10)}`;
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
  }, []);

  const addImage = useCallback((file: File) => {
    if (!fabricRef.current) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result as string;
      fabric.Image.fromURL(data).then((img) => {
        img.scaleToWidth(200);
        img.set({ left: 100, top: 100 });
        (img as any).id = uuidv4();
        (img as any).name = 'Uploaded Image';
        fabricRef.current?.add(img);
        fabricRef.current?.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const addStickerEmoji = useCallback((emoji: string) => {
    if (!fabricRef.current) return;
    const text = new fabric.Text(emoji, {
      left: 150,
      top: 300,
      fontSize: 64,
    });
    (text as any).id = uuidv4();
    (text as any).name = `Sticker ${emoji}`;
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
  }, []);

  const addStickerSVG = useCallback(async (svgString: string, name: string) => {
    if (!fabricRef.current) return;
    const { objects, options } = await fabric.loadSVGFromString(svgString);
    const validObjects = objects.filter((o): o is fabric.FabricObject => o !== null);
    const obj = fabric.util.groupSVGElements(validObjects, options);
    obj.set({ left: 150, top: 300 });
    obj.scaleToWidth(64);
    (obj as any).id = uuidv4();
    (obj as any).name = name;
    fabricRef.current.add(obj);
    fabricRef.current.setActiveObject(obj);
  }, []);
  
  const setBackgroundColor = useCallback((color: string) => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundColor = color;
    // We add a dummy hidden object so background change registers in history cleanly
    const dummy = new fabric.Rect({ width: 0, height: 0, opacity: 0 });
    fabricRef.current.add(dummy);
    fabricRef.current.remove(dummy);
    fabricRef.current.requestRenderAll();
  }, []);

  return {
    canvasRef,
    fabricRef,
    undo,
    redo,
    addText,
    addImage,
    addStickerEmoji,
    addStickerSVG,
    setBackgroundColor,
  };
};
