// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsQR = require('jsqr');

export async function decodeQrFromImageBuffer(imageBuffer: Buffer): Promise<string | null> {
  if (!imageBuffer || imageBuffer.length === 0) {
    return null;
  }

  try {
    const sharpFn = sharp.default || sharp;
    const image = sharpFn(imageBuffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      return null;
    }

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const clampedArray = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    const code = jsQR(clampedArray, info.width, info.height);

    if (code && code.data && code.data.trim().length > 0) {
      return code.data.trim();
    }
    return null;
  } catch {
    return null;
  }
}
