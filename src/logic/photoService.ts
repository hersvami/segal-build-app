import { uploadImageToCloudinary } from "./cloudinaryService";

// ── Compress image to data URL ──
export async function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => {
        const MAX_SIZE = 1400;
        let w = img.width;
        let h = img.height;

        if (w > MAX_SIZE || h > MAX_SIZE) {
          if (w > h) {
            h = Math.round((h * MAX_SIZE) / w);
            w = MAX_SIZE;
          } else {
            w = Math.round((w * MAX_SIZE) / h);
            h = MAX_SIZE;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context unavailable"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = ev.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

// ── Upload photo to Cloudinary ──
export async function uploadPhotoToCloudinary(
  dataUrl: string,
  projectName: string,
  folder = "photos"
): Promise<{ url: string; publicId: string }> {
  const result = await uploadImageToCloudinary(dataUrl, projectName, folder);
  return { url: result.url, publicId: result.publicId };
}

// ── Legacy Firebase upload (kept for reference — NOT USED) ──
export async function uploadPhotoToFirebase(
  _dataUrl: string,
  _projectId: string,
  _variationId: string
): Promise<string> {
  throw new Error(
    "Firebase Storage not active — use uploadPhotoToCloudinary instead"
  );
}
