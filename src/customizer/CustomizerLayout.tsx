"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';

// Next dynamic ssr: false ensures browser-only libraries like fabric don't crash the server.
const FabricCanvas = dynamic(() => import("./FabricCanvas"), { ssr: false });
const PhoneModel3D = dynamic(() => import("./PhoneModel3D"), { ssr: false });

export default function CustomizerLayout() {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto items-start justify-center">
      <div className="w-full lg:w-1/2 flex-shrink-0">
        <FabricCanvas onTextureUpdate={setTextureUrl} />
      </div>
      
      <div className="w-full lg:w-1/2 flex-shrink-0 lg:sticky lg:top-24">
        <h2 className="font-bebas text-3xl uppercase text-brand-black mb-6 text-center lg:text-left">
          Live 3D Preview
        </h2>
        <PhoneModel3D textureUrl={textureUrl} />
      </div>
    </div>
  );
}
