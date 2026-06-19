export type DrawRect = {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function getCoverDrawRect(canvasWidth: number, canvasHeight: number, imageWidth: number, imageHeight: number): DrawRect {
  if (canvasWidth <= 0 || canvasHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return { dx: 0, dy: 0, dw: 0, dh: 0 };
  }

  const canvasRatio = canvasWidth / canvasHeight;
  const imageRatio = imageWidth / imageHeight;

  if (imageRatio > canvasRatio) {
    const dh = canvasHeight;
    const dw = dh * imageRatio;
    return {
      dx: round((canvasWidth - dw) / 2),
      dy: 0,
      dw: round(dw),
      dh: round(dh),
    };
  }

  const dw = canvasWidth;
  const dh = dw / imageRatio;

  return {
    dx: 0,
    dy: round((canvasHeight - dh) / 2),
    dw: round(dw),
    dh: round(dh),
  };
}
