"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CaseProduct } from "./mockData";
import { useEcoStore } from "../store/ecoStore";

export default function ProductCard({ product }: { product: CaseProduct }) {
  const { ecoMode } = useEcoStore();

  const CardContent = (
    <div className={`group relative flex flex-col gap-3 rounded-2xl p-4 transition-all h-full cursor-pointer ${
      ecoMode ? "border border-brand-black/10" : "bg-white hover:shadow-2xl hover:shadow-brand-lime/20"
    }`}>
      <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-brand-white ${
        ecoMode ? "opacity-90 grayscale saturate-50" : ""
      }`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover ${!ecoMode ? "transition-transform duration-500 group-hover:scale-110" : ""}`}
          quality={ecoMode ? 20 : 85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {ecoMode && (
          <div className="absolute top-2 right-2 rounded-md bg-brand-black/80 px-2 py-1 text-[10px] font-bold tracking-wider text-brand-lime">
            ECO REZ
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-bebas text-2xl uppercase tracking-wide text-brand-black">
          {product.name}
        </h3>
        <p className="font-sans text-sm font-medium text-brand-black/60">
          ${product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 mt-auto pt-2">
        {product.supportedModels.map((model) => (
          <span key={model} className="rounded-md bg-brand-black/5 px-2 py-1 text-[10px] font-bold uppercase text-brand-black/70">
            {model}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <Link href={`/shop/${product.id}`} className="h-full block">
      {ecoMode ? (
        CardContent
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {CardContent}
        </motion.div>
      )}
    </Link>
  );
}
