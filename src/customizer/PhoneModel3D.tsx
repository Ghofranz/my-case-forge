"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { DEVICE_METRICS } from "./PhoneCaseSVG";

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

  // We map the 2D pixel coordinates to our 3D scale ([-0.75 to 0.75] over Width)
  const scale = 0.005; // 300px * 0.005 => 1.5 units width
  
  // Calculate relative transforms from the Top-Left of the phone
  const cw = metrics.camera.w * scale;
  const ch = metrics.camera.h * scale;
  
  // X: from left (-0.75) + x offset + half width
  const cx = -0.75 + (metrics.camera.x * scale) + (cw / 2);
  
  // Y: from top (1.55) - y offset - half height
  const cy = 1.55 - (metrics.camera.y * scale) - (ch / 2);
  
  // Z: place it protruding slightly off the thick Z-plane of the case
  const cz = 0.08;

  const crx = metrics.camera.rx ? (metrics.camera.rx * scale) : 0.05;

  if (metrics.camera.type === 'visor') {
    return (
      <RoundedBox args={[cw * 1.05, ch, 0.06]} radius={0.02} position={[0, cy, cz]} castShadow>
        <meshStandardMaterial color="#0A0A0A" roughness={0.1} metalness={0.8} />
      </RoundedBox>
    );
  }

  return (
    <RoundedBox args={[cw, ch, 0.04]} radius={crx} position={[cx, cy, cz]} castShadow>
      <meshStandardMaterial color="#0A0A0A" roughness={0.15} metalness={0.7} />
      
      {/* Simulation of camera lenses inside the bump */}
      <mesh position={[-cw/4, ch/4, 0.02]}>
        <cylinderGeometry args={[cw/6, cw/6, 0.02, 16]} />
        <meshStandardMaterial color="#000000" roughness={0} metalness={1} />
      </mesh>
      <mesh position={[cw/4, -ch/4, 0.02]}>
        <cylinderGeometry args={[cw/6, cw/6, 0.02, 16]} />
        <meshStandardMaterial color="#000000" roughness={0} metalness={1} />
      </mesh>
    </RoundedBox>
  );
}

function MeshLink({ canvasEl, model }: { canvasEl: HTMLCanvasElement, model: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const interacting = useRef(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);

  const tex = useMemo(() => {
    if (!canvasEl) return null;
    const t = new THREE.CanvasTexture(canvasEl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.offset.x = 1;

    // Highest quality scaling to prevent blurry rasterizing
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
      // Force hardware texture pipeline flush
      if (textureRef.current && canvasEl) {
        textureRef.current.needsUpdate = true;
      }
    };
    window.addEventListener('fabric-sync', handleTextureSync);
    return () => window.removeEventListener('fabric-sync', handleTextureSync);
  }, [canvasEl]);

  const metrics = DEVICE_METRICS[model] || DEVICE_METRICS['iPhone 15 Pro'];
  const roundedScale = (metrics.rx || 42) / 300; 
  const cornerRadius = Math.max(0.05, roundedScale * 1.5);

  const materials = useMemo(() => {
    // Array of materials: [right, left, top, bottom, front, back]
    const matteBlack = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.9 });
    
    // Front face has the customizer Canvas texture, with gloss and reflections!
    const frontMat = new THREE.MeshStandardMaterial({ 
      map: tex, 
      roughness: 0.1,  // Glossy reflection!
      metalness: 0.3, 
    });

    return [matteBlack, matteBlack, matteBlack, matteBlack, frontMat, matteBlack];
  }, [tex]);

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
      {/* Fixed: RoundedBox directly instantiated as the mesh, avoiding the 'nested cages' rendering bug. */}
      {/* By mapping materials directly to RoundedBox faces, we skip complex Decals entirely! */}
      <RoundedBox castShadow receiveShadow args={[1.5, 3.1, 0.12]} radius={cornerRadius} smoothness={8} material={materials} />

      {/* Programmatic Layering of the Hardware Camera Plate in true 3D space */}
      <CameraCluster model={model} />

      {/* Subtle floor shadow plane */}
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
        
        {/* Colorful rim lighting for an ultra-premium reflection! */}
        <pointLight position={[3, -2, 2]} intensity={0.6} color="#C6FF00" />
        <pointLight position={[-3, 2, 2]} intensity={0.3} color="#00E5FF" />
        
        <Environment preset={lighting as any} />
        <MeshLink canvasEl={canvasEl} model={model} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
