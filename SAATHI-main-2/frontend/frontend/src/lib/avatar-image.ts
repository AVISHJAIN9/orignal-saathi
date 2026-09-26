export const AVATAR_MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB, matches the spec's stated cap
export const AVATAR_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_OUTPUT_SIZE = 256;

export type AvatarImageErrorCode =
  "invalid-type" | "too-large" | "decode-failed";

export class AvatarImageError extends Error {
  code: AvatarImageErrorCode;
  constructor(code: AvatarImageErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Validates, EXIF-corrects, centre-crops to a square, and downscales an
 * uploaded photo to a small JPEG data URL (typically 20-40 KB) suitable for
 * localStorage — this app has no backend to host a full-resolution upload,
 * so the data URL itself is the stored representation.
 */
export async function processAvatarImageFile(file: File): Promise<string> {
  if (!AVATAR_ACCEPTED_TYPES.includes(file.type)) {
    throw new AvatarImageError(
      "invalid-type",
      `Unsupported file type: ${file.type || "unknown"}`,
    );
  }
  if (file.size > AVATAR_MAX_FILE_SIZE_BYTES) {
    throw new AvatarImageError("too-large", `File is ${file.size} bytes`);
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new AvatarImageError("decode-failed", "Could not decode image");
  }

  try {
    return cropAndEncodeSquare(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

/** Same centre-crop/downscale pipeline, applied to the current frame of a
 * live <video> element — used by the in-dialog camera capture flow. */
export function captureVideoFrameSquare(video: HTMLVideoElement): string {
  return cropAndEncodeSquare(video, video.videoWidth, video.videoHeight);
}

function cropAndEncodeSquare(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
): string {
  const side = Math.min(sourceWidth, sourceHeight);
  const sx = (sourceWidth - side) / 2;
  const sy = (sourceHeight - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_OUTPUT_SIZE;
  canvas.height = AVATAR_OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new AvatarImageError(
      "decode-failed",
      "Canvas 2D context unavailable",
    );

  ctx.drawImage(
    source,
    sx,
    sy,
    side,
    side,
    0,
    0,
    AVATAR_OUTPUT_SIZE,
    AVATAR_OUTPUT_SIZE,
  );
  return canvas.toDataURL("image/jpeg", 0.85);
}
