"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, RoundedBox, Decal } from "@react-three/drei";
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
  const meshGroupRef = useRef<THREE.Group>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const interacting = useRef(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);

  const tex = useMemo(() => {
    if (!canvasEl) return null;
    const t = new THREE.CanvasTexture(canvasEl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true; // Fixes vertical inverted maps
    
    // Fix mirror effect! Three.js maps textures backwards on certain frontal geometries.
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.offset.x = 1;

    textureRef.current = t;
    return t;
  }, [canvasEl]);

  useFrame(() => {
    if (meshGroupRef.current && !interacting.current) {
      meshGroupRef.current.rotation.y += 0.003;
    }
  });

  useEffect(() => {
    const handleTextureSync = () => {
      // Force sync to 3D when 2D canvas is updated
      if (textureRef.current) textureRef.current.needsUpdate = true;
    };
    window.addEventListener('fabric-sync', handleTextureSync);
    return () => window.removeEventListener('fabric-sync', handleTextureSync);
  }, []);

  const metrics = DEVICE_METRICS[model] || DEVICE_METRICS['iPhone 15 Pro'];
  
  // Transform SVG pixel radius to R3F 3D scale equivalent
  const roundedScale = (metrics.rx || 42) / 300; 
  const cornerRadius = Math.max(0.05, roundedScale * 1.5);

  return (
    <group
      ref={meshGroupRef as any}
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
      <mesh castShadow receiveShadow>
        <RoundedBox args={[1.5, 3.1, 0.12]} radius={cornerRadius} smoothness={8}>
          {/* Base Case Material (e.g., standard matte black or white shell) */}
          <meshStandardMaterial color="#0A0A0A" roughness={0.7} />
          
          {/* Decal to map the 2D customizer perfectly flat onto the curved front face */}
          {tex && (
            <Decal
              position={[0, 0, 0.06]} // Front Z-face projection
              rotation={[0, 0, 0]}
              scale={[1.5, 3.1, 1]}   // Lock to standard box dimension
            >
              <meshStandardMaterial
                map={tex}
                polygonOffset
                polygonOffsetFactor={-1}
                roughness={0.2}
                metalness={0.1}
                transparent
              />
            </Decal>
          )}
        </RoundedBox>
      </mesh>
      
      {/* Subtle floor grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.4} wireframe />
      </mesh>
    </group>
  );
}

export default function PhoneModel3D({ canvasEl, model, lighting = 'studio' }: { canvasEl: HTMLCanvasElement | null, model: string, lighting?: 'studio' | 'city' | 'sunset' }) {
  if (!canvasEl) return <div className="w-full h-full bg-[#f9f9f9] animate-pulse rounded-xl" />;

  return (
    <div className="render-3d-canvas w-full h-full bg-white rounded-[16px] overflow-hidden relative border border-[#eeeeee]">
      <Canvas gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ position: [0, 0, 4.5], fov: 50 }} shadows dpr={[1, 2]}>
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
