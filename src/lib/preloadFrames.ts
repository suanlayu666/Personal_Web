export type PreloadResult = {
  loaded: HTMLImageElement[];
  failed: string[];
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

export async function preloadFrames(srcList: string[], batchSize = 8): Promise<PreloadResult> {
  const loaded: HTMLImageElement[] = [];
  const failed: string[] = [];

  for (let index = 0; index < srcList.length; index += batchSize) {
    const batch = srcList.slice(index, index + batchSize);
    const settled = await Promise.allSettled(batch.map((src) => loadImage(src)));

    settled.forEach((result, batchIndex) => {
      if (result.status === "fulfilled") {
        loaded.push(result.value);
      } else {
        failed.push(batch[batchIndex]);
      }
    });
  }

  return { loaded, failed };
}
