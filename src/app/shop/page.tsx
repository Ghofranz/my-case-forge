import ProductGrid from "../../shop/ProductGrid";

export const metadata = {
  title: "Shop Phase 2 | CaseForge",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-bebas text-5xl md:text-7xl uppercase text-brand-black">
          The Vault
        </h1>
        <p className="mt-2 text-lg text-brand-black/70 font-sans max-w-2xl">
          Browse our curated collection of Gen-Z streetwear cases. Filter by your device and find the perfect match.
        </p>
      </div>

      <ProductGrid />
    </div>
  );
}
