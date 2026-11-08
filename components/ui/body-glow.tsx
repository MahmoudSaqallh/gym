import Image from "next/image";

const LAYERS = ["k-glow-bloom", "k-glow-core", "k-glow-flow"];

/**
 * Infinite glow for the anatomy renders. `src` is the vein-only PNG extracted from the render,
 * stacked over it inside the same (positioned) box. `dim` lets the veins fall back between
 * pulses, which only reads well on the dark render.
 */
export function BodyGlow({ src, sizes, dim = true }: { src: string; sizes: string; dim?: boolean }) {
  return (
    <>
      {(dim ? ["k-glow-dim", ...LAYERS] : LAYERS).map((layer) => (
        <Image key={layer} src={src} alt="" fill sizes={sizes} className={`object-contain ${layer}`} />
      ))}
    </>
  );
}
