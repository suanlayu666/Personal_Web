import { useEffect, useMemo, useRef, useState } from "react";
import { frameManifest, type FrameVariant } from "../data/frameManifest.generated";
import { getCoverDrawRect } from "../lib/canvasDraw";
import { buildFrameList } from "../lib/framePaths";
import { preloadFrames } from "../lib/preloadFrames";

type FrameCanvasProps = {
  progress: number;
};

function getVariant() {
  if (typeof window === "undefined") {
    return "desktop" satisfies FrameVariant;
  }

  return window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";
}

export function FrameCanvas({ progress }: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [variant, setVariant] = useState<FrameVariant>(getVariant);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const frameList = useMemo(() => buildFrameList(variant, frameManifest[variant].count), [variant]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const syncVariant = () => setVariant(media.matches ? "mobile" : "desktop");
    syncVariant();
    media.addEventListener("change", syncVariant);
    return () => media.removeEventListener("change", syncVariant);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      await preloadFrames(frameList, 8, (result) => {
        if (!cancelled && result.loaded.length > 0) {
          setImages(result.loaded);
        }
      });
    }

    if (frameList.length > 0) {
      setImages([]);
      void run();
    }

    return () => {
      cancelled = true;
    };
  }, [frameList]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const imageCount = images.length;

    if (!canvas || !context || imageCount === 0) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const frameIndex = Math.min(imageCount - 1, Math.max(0, Math.floor(progress * (imageCount - 1))));
    const image = images[frameIndex];
    const rect = getCoverDrawRect(width, height, image.naturalWidth, image.naturalHeight);
    context.drawImage(image, rect.dx, rect.dy, rect.dw, rect.dh);
  }, [images, progress]);

  return (
    <div className="frame-canvas" aria-hidden="true">
      <canvas ref={canvasRef} />
      {images.length === 0 ? <div className="frame-canvas__fallback" /> : null}
    </div>
  );
}
