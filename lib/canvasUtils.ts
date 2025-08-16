export function prepareCtx(ctx: CanvasRenderingContext2D) {
  ctx.lineJoin = 'round';
}

export function drawAvatarOutline(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  thickness = 16
) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = '#000';
  ctx.fillRect(-thickness, -thickness, width + thickness * 2, height + thickness * 2);
  ctx.restore();
}

export async function exportCanvasPNG(
  canvas: HTMLCanvasElement,
  filename: string
) {
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}