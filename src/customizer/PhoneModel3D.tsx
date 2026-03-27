"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";

function MeshLink({ canvasEl }: { canvasEl: HTMLCanvasElement }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const lastUpdate = useRef(0);
  
  const texture = useMemo(() => {
    if (!canvasEl) return null;
    const tex = new THREE.CanvasTexture(canvasEl);
    tex.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = tex;
    return tex;
  }, [canvasEl]);

  useFrame((state) => {
    // Throttle texture update to ~10fps (every 100ms) to prevent massive memory dumps
    if (textureRef.current && state.clock.elapsedTime - lastUpdate.current > 0.1) {
      textureRef.current.needsUpdate = true;
      lastUpdate.current = state.clock.elapsedTime;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[1.5, 3.0, 0.2]} radius={0.15} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} map={texture} />
    </RoundedBox>
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
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
