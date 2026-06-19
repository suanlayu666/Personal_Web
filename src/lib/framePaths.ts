import { frameManifest, type FrameVariant } from "../data/frameManifest.generated";

export function getFrameSrc(variant: FrameVariant, index: number, baseUrl = import.meta.env.BASE_URL) {
  const manifest = frameManifest[variant];
  const safeIndex = Math.max(manifest.startIndex, Math.floor(index));
  const padded = String(safeIndex).padStart(4, "0");
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${manifest.directory}/${manifest.prefix}${padded}.${manifest.extension}`;
}

export function buildFrameList(variant: FrameVariant, count: number, baseUrl = import.meta.env.BASE_URL) {
  if (count <= 0) {
    return [];
  }

  const manifest = frameManifest[variant];
  return Array.from({ length: count }, (_, index) => getFrameSrc(variant, manifest.startIndex + index, baseUrl));
}
