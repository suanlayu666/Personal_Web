export const frameManifest = {
  desktop: {
    count: 247,
    directory: "image",
    prefix: "frames",
    extension: "jpg",
    startIndex: 0,
  },
  mobile: {
    count: 247,
    directory: "image",
    prefix: "frames",
    extension: "jpg",
    startIndex: 0,
  },
} as const;

export type FrameVariant = keyof typeof frameManifest;
