/**
 * Client-side image downscaling, done before anything is uploaded.
 *
 * Phone photos are 3-5 MB. Stored and served raw, a 25-shirt grid would pull
 * ~75 MB on every page view — the single largest variable cost of running this
 * app, and miserable on mobile data. Two sizes are produced instead:
 *
 *   full  — 1600px long edge, what the detail view shows
 *   thumb —  400px long edge, what the grid shows
 *
 * Both are re-encoded as JPEG, which also strips EXIF (including GPS
 * coordinates the camera may have written into the original).
 */

const FULL_EDGE = 1600;
const THUMB_EDGE = 400;
const FULL_QUALITY = 0.82;
const THUMB_QUALITY = 0.7;

/** Suffix that turns a stored path into its thumbnail's path. */
const THUMB_SUFFIX = "_thumb";

export interface PreparedImages {
  full: File;
  thumb: File;
}

/**
 * The thumbnail path for a stored image path, by convention rather than an
 * extra column: `<uid>/<uuid>.jpg` → `<uid>/<uuid>_thumb.jpg`. Shirts uploaded
 * before thumbnails existed simply have no file there, and the UI falls back
 * to the full image.
 */
export function thumbPath(path: string): string {
  const dot = path.lastIndexOf(".");
  if (dot <= path.lastIndexOf("/")) return `${path}${THUMB_SUFFIX}`;
  return `${path.slice(0, dot)}${THUMB_SUFFIX}${path.slice(dot)}`;
}

/** Decode a File into something canvas can draw, preferring the fast path. */
async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not decode the image"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function sizeOf(source: ImageBitmap | HTMLImageElement) {
  return source instanceof HTMLImageElement
    ? { width: source.naturalWidth, height: source.naturalHeight }
    : { width: source.width, height: source.height };
}

/** Draw `source` scaled to fit `maxEdge` and encode it as a JPEG File. */
async function toJpeg(
  source: ImageBitmap | HTMLImageElement,
  maxEdge: number,
  quality: number,
  name: string,
): Promise<File> {
  const { width, height } = sizeOf(source);
  // Never upscale: a small original stays at its own size.
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.drawImage(source, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("Could not encode the image");

  return new File([blob], name, { type: "image/jpeg" });
}

/**
 * Produce the full and thumbnail versions of a picked photo.
 *
 * Throws only if the browser cannot decode the file at all; callers should
 * fall back to uploading the original rather than blocking the user.
 */
export async function prepareImages(file: File): Promise<PreparedImages> {
  const source = await decode(file);
  try {
    const base = file.name.replace(/\.[^.]+$/, "") || "shirt";
    const [full, thumb] = await Promise.all([
      toJpeg(source, FULL_EDGE, FULL_QUALITY, `${base}.jpg`),
      toJpeg(source, THUMB_EDGE, THUMB_QUALITY, `${base}${THUMB_SUFFIX}.jpg`),
    ]);
    return { full, thumb };
  } finally {
    if ("close" in source) source.close();
  }
}
