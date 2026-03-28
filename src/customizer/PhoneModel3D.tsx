"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { DEVICE_METRICS } from "./PhoneCaseSVG";

function SceneSetup() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color("#ffffff");
  }, [scene]);
  return null;
}

function MeshLink({ canvasEl, model }: { canvasEl: HTMLCanvasElement, model: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const interacting = useRef(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);
  
  const materials = useMemo(() => {
    // Basic dark matte material for the sides of the phone case
    const sideMat = new THREE.MeshStandardMaterial({ color: "#0A0A0A", roughness: 0.8 });
    const backMat = new THREE.MeshStandardMaterial({ color: "#0A0A0A", roughness: 0.8 });
    
    if (!canvasEl) {
      return [sideMat, sideMat, sideMat, sideMat, backMat, backMat];
    }
    
    const tex = new THREE.CanvasTexture(canvasEl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    textureRef.current = tex;
    
    // Front material maps the fabric texture
    const frontMat = new THREE.MeshStandardMaterial({ 
      map: tex, roughness: 0.3, metalness: 0.1 
    });
    
    // R3F Material Array order matches standard BoxGeometry faces:
    // [right, left, top, bottom, front, back]
    // The canvas texture maps precisely to index 4 (front)
    return [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
  }, [canvasEl]);

  useFrame(() => {
    if (meshRef.current && !interacting.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  useEffect(() => {
    const handleTextureSync = () => {
      // Direct texture invalidation synchronizes the WebGL instantly
      if (textureRef.current) textureRef.current.needsUpdate = true;
    };
    window.addEventListener('fabric-sync', handleTextureSync);
    return () => window.removeEventListener('fabric-sync', handleTextureSync);
  }, []);

  const metrics = DEVICE_METRICS[model] || DEVICE_METRICS['iPhone 15 Pro'];
  // We apply the corner scale offset dynamically if we used custom geometry, 
  // but BoxGeometry anchors perfectly on its own!

  return (
    <>
      <mesh 
        ref={meshRef as any}
        material={materials}
        castShadow 
        receiveShadow
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
        {/* BoxGeometry naturally matches arrays. We drop RoundedBox because it scrambles UV maps! */}
        <boxGeometry args={[1.5, 3.1, 0.12]} />
      </mesh>
      
      {/* Subtle floor grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.4} wireframe />
      </mesh>
    </>
  );
}

export default function PhoneModel3D({ canvasEl, model, lighting = 'studio' }: { canvasEl: HTMLCanvasElement | null, model: string, lighting?: 'studio' | 'city' | 'sunset' }) {
  if (!canvasEl) return <div className="w-full h-full bg-[#f9f9f9] animate-pulse rounded-xl" />;

  return (
    <div className="render-3d-canvas w-full h-full bg-white rounded-[16px] overflow-hidden relative border border-[#eeeeee]">
      {/* preserveDrawingBuffer is CRITICAL or else the Screenshot toDataURL returns pure black! */}
      <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 4.5], fov: 50 }} shadows dpr={[1, 2]}>
        <SceneSetup />
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#ffffff" />
        
        {/* Lime reflection bounce light below */}
        <pointLight position={[0, -2, 0]} intensity={0.3} color="#C6FF00" />
        
        <Environment preset={lighting as any} />
        <MeshLink canvasEl={canvasEl} model={model} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
