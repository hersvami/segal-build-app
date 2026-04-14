// Cloudinary configuration
const CLOUD_NAME = "446179";
const UPLOAD_PRESET = "segal_build_uploads";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
}

// ── Upload image to Cloudinary ──
export async function uploadImageToCloudinary(
  dataUrl: string,
  projectName: string,
  folder = "photos"
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", dataUrl);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `segal-build/${projectName}/${folder}`);

  const response = await fetch(`${CLOUDINARY_URL}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: "image",
  };
}

// ── Upload video to Cloudinary ──
export async function uploadVideoToCloudinary(
  file: File,
  projectName: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `segal-build/${projectName}/videos`);
  formData.append("resource_type", "video");

  const response = await fetch(`${CLOUDINARY_URL}/video/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary video upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: "video",
  };
}

// ── Delete from Cloudinary (requires backend in production) ──
// For now we log the publicId for manual cleanup
export function scheduleCloudinaryDelete(publicIds: string[]): void {
  console.info(
    "Cloudinary cleanup needed for:",
    publicIds,
    "— delete manually at cloudinary.com or set up backend cleanup"
  );
}

// ── Get all public IDs from a project's photos/videos ──
export function extractPublicIds(
  photos: Array<{ publicId?: string }>,
  videos: Array<{ publicId?: string }>
): string[] {
  return [
    ...photos.map((p) => p.publicId).filter(Boolean),
    ...videos.map((v) => v.publicId).filter(Boolean),
  ] as string[];
}
