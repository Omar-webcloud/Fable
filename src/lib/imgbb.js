const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

export async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

  if (!apiKey) {
    throw new Error("imgBB API key is not configured");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${IMGBB_API_URL}?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return {
    url: data.data.url,
    displayUrl: data.data.display_url,
    deleteUrl: data.data.delete_url,
  };
}

export async function uploadBase64ToImgBB(base64) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

  if (!apiKey) {
    throw new Error("imgBB API key is not configured");
  }

  const formData = new FormData();
  formData.append("image", base64);

  const response = await fetch(`${IMGBB_API_URL}?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return {
    url: data.data.url,
    displayUrl: data.data.display_url,
    deleteUrl: data.data.delete_url,
  };
}
