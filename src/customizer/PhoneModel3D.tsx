"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { DEVICE_METRICS } from "./PhoneCaseSVG";
import { useCustomizerStore } from "../store/useCustomizerStore";

function SceneSetup() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color("#fdfdfd");
  }, [scene]);
  return null;
}

function CameraCluster({ model }: { model: string }) {
  const metrics = DEVICE_METRICS[model] || DEVICE_METRICS['iPhone 15 Pro'];
  if (!metrics.camera) return null;

  const scale = 0.005;
  const cw = metrics.camera.w * scale;
  const ch = metrics.camera.h * scale;
  
  const cx = -0.75 + (metrics.camera.x * scale) + (cw / 2);
  const cy = 1.55 - (metrics.camera.y * scale) - (ch / 2);
  const cz = 0.08;

  const crx = metrics.camera.rx ? (metrics.camera.rx * scale) : 0.05;

  // We build the camera bump using standard components to avoid RoundedBox glitching here just in case, or we use boxGeometry.
  // Actually, standard mesh + boxGeometry is safest.
  return (
    <mesh position={[cx, cy, cz]} castShadow>
      <boxGeometry args={[cw, ch, 0.04]} />
      <meshStandardMaterial color="#0A0A0A" roughness={0.15} metalness={0.7} />
      
      <mesh position={[-cw/4, ch/4, 0.03]}>
        <cylinderGeometry args={[cw/6, cw/6, 0.01, 16]} />
        <meshStandardMaterial color="#000000" roughness={0} metalness={1} />
      </mesh>
      <mesh position={[cw/4, -ch/4, 0.03]}>
        <cylinderGeometry args={[cw/6, cw/6, 0.01, 16]} />
        <meshStandardMaterial color="#000000" roughness={0} metalness={1} />
      </mesh>
    </mesh>
  );
}

function MeshLink({ canvasEl, model }: { canvasEl: HTMLCanvasElement, model: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const interacting = useRef(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);
  
  const { caseColor } = useCustomizerStore();

  const tex = useMemo(() => {
    if (!canvasEl) return null;
    const t = new THREE.CanvasTexture(canvasEl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.offset.x = 1;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipMapLinearFilter;
    textureRef.current = t;
    return t;
  }, [canvasEl]);

  useFrame(() => {
    if (groupRef.current && !interacting.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  useEffect(() => {
    const handleTextureSync = () => {
      if (textureRef.current && canvasEl) {
        textureRef.current.needsUpdate = true;
      }
    };
    window.addEventListener('fabric-sync', handleTextureSync);
    return () => window.removeEventListener('fabric-sync', handleTextureSync);
  }, [canvasEl]);

  const materials = useMemo(() => {
    // Perfect Sync Fix: The primary case uses the global caseColor directly from the Zustand store!
    // This perfectly synchronizes 3D with 2D instantly without waiting for Fabric pixels.
    const baseMat = new THREE.MeshStandardMaterial({ color: caseColor, roughness: 0.8 });
    
    // Front face receives the CanvasTexture with transparent background so the color base shines through!
    const frontMat = new THREE.MeshStandardMaterial({ 
      color: caseColor,
      map: tex, 
      roughness: 0.5,
      transparent: true, // Crucial for overlaying canvas graphics over the base color
    });

    // Valid array mapping for BoxGeometry: [right, left, top, bottom, front, back]
    return [baseMat, baseMat, baseMat, baseMat, frontMat, baseMat];
  }, [tex, caseColor]);

  // Use BoxGeometry exclusively to permanently eradicate the "Two Cages" RoundedBox array bug!
  return (
    <group
      ref={groupRef as any}
      onPointerDown={() => {
        interacting.current = true;
        if (interactionTimer.current) clearTimeout(interactionTimer.current);
      }}
      onPointerUp={() => {
        interactionTimer.current = setTimeout(() => {
          interacting.current = false;
        }, 3000);
      }}
    >
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[1.5, 3.1, 0.12]} />
      </mesh>

      <CameraCluster model={model} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function PhoneModel3D({ canvasEl, model, lighting = 'studio' }: { canvasEl: HTMLCanvasElement | null, model: string, lighting?: 'studio' | 'city' | 'sunset' }) {
  if (!canvasEl) return <div className="w-full h-full bg-[#f9f9f9] animate-pulse rounded-xl" />;

  return (
    <div className="render-3d-canvas w-full h-full bg-transparent overflow-hidden relative border-none">
      <Canvas gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }} camera={{ position: [0, 0, 4.5], fov: 45 }} shadows dpr={[1, 2]}>
        <SceneSetup />
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-8, 6, -5]} intensity={0.5} color="#ffffff" />
        
        <pointLight position={[3, -2, 2]} intensity={0.6} color="#C6FF00" />
        
        <Environment preset={lighting as any} />
        <MeshLink canvasEl={canvasEl} model={model} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
