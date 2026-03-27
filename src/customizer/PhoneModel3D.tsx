"use client";

import { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useEcoStore } from "../store/ecoStore";

function PhoneMesh({ textureUrl }: { textureUrl: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { ecoMode } = useEcoStore();

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const tex = new THREE.TextureLoader().load(textureUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    // Rotate texture so it aligns vertically up on the box geometry mapping
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }, [textureUrl]);

  return (
    <RoundedBox
      ref={meshRef}
      args={[1.5, 3.0, 0.2]} // Width, height, depth (roughly 1:2 phone ratio)
      radius={0.1}
      smoothness={ecoMode ? 2 : 4} // Lower smoothness in Eco-Mode
    >
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.2}
        metalness={0.8}
        map={texture}
      />
    </RoundedBox>
  );
}

export default function PhoneModel3D({ textureUrl }: { textureUrl: string | null }) {
  const { ecoMode } = useEcoStore();

  return (
    <div className="w-full h-[600px] bg-brand-black rounded-3xl overflow-hidden relative shadow-2xl">
      {ecoMode && (
        <div className="absolute top-4 left-4 z-10 rounded-md bg-brand-white/10 px-3 py-1 text-xs font-bold tracking-wider text-brand-lime backdrop-blur-md">
          GPU ECO MODE
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: !ecoMode, powerPreference: ecoMode ? "low-power" : "high-performance" }}
        dpr={ecoMode ? 1 : [1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        {!ecoMode && <Environment preset="city" />}
        <PhoneMesh textureUrl={textureUrl} />
        <OrbitControls
          enableZoom={true}
          autoRotate={!ecoMode}
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
