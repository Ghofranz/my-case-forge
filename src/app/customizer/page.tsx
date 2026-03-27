import CustomizerLayout from "../../customizer/CustomizerLayout";

export const metadata = {
  title: "The Forge | CaseForge",
};

export default function CustomizerPage() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 tracking-wide">
      <div className="mb-8 w-full max-w-7xl mx-auto">
        <h1 className="font-bebas text-4xl md:text-6xl uppercase text-brand-black">
          The Forge
        </h1>
        <p className="mt-2 text-md md:text-lg text-brand-black/70 font-sans max-w-2xl">
          Design your vibe. Pick a base color and drop text on the 2D canvas, and watch it map instantly onto our 3D customizer.
        </p>
      </div>

      <CustomizerLayout />
    </div>
  );
}
