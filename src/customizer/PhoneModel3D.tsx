"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

function MeshLink({ canvasEl }: { canvasEl: HTMLCanvasElement }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const interacting = useRef(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);
  
  const materials = useMemo(() => {
    const sideMat = new THREE.MeshStandardMaterial({ color: "#0A0A0A", roughness: 0.8 });
    const backMat = new THREE.MeshStandardMaterial({ color: "#0A0A0A", roughness: 0.8 });
    
    if (!canvasEl) {
      return [sideMat, sideMat, sideMat, sideMat, backMat, backMat];
    }
    
    const tex = new THREE.CanvasTexture(canvasEl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    textureRef.current = tex;
    
    const frontMat = new THREE.MeshStandardMaterial({ 
      map: tex, roughness: 0.3, metalness: 0.1 
    });
    
    return [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
  }, [canvasEl]);

  useFrame(() => {
    if (meshRef.current && !interacting.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  useEffect(() => {
    const handleTextureSync = () => {
      if (textureRef.current) textureRef.current.needsUpdate = true;
    };
    window.addEventListener('fabric-sync', handleTextureSync);
    return () => window.removeEventListener('fabric-sync', handleTextureSync);
  }, []);

  return (
    <mesh 
      ref={meshRef} 
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
      <boxGeometry args={[1.5, 3.0, 0.12]} />
    </mesh>
  );
}

export default function PhoneModel3D({ canvasEl }: { canvasEl: HTMLCanvasElement | null }) {
  if (!canvasEl) return <div className="w-full h-[600px] bg-[#161616] animate-pulse rounded-xl" />;

  return (
    <div className="w-full h-[600px] bg-[#0D0D0D] rounded-xl overflow-hidden relative shadow-2xl border border-[#2A2A2A]">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} shadows dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#C6FF00" />
        <Environment preset="studio" />
        <MeshLink canvasEl={canvasEl} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
