"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ebookService } from "@/services";
import { uploadToImgBB } from "@/lib/imgbb";
import { GENRES } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditEbookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fullContent: "",
    genre: GENRES[0],
    price: "",
    coverImage: "",
  });

  useEffect(() => {
    ebookService.getById(id)
      .then((res) => {
        const ebook = res.data;
        setForm({
          title: ebook.title || "",
          description: ebook.description || "",
          fullContent: ebook.fullContent || "",
          genre: ebook.genre || GENRES[0],
          price: String(ebook.price || ""),
          coverImage: ebook.coverImage || "",
        });
        if (ebook.coverImage) setImagePreview(ebook.coverImage);
      })
      .catch(() => toast.error("Failed to load ebook"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverImage = form.coverImage;
      if (imageFile) {
        try {
          const imgResult = await uploadToImgBB(imageFile);
          coverImage = imgResult.url;
        } catch {
          toast.error("Image upload failed, keeping existing cover");
        }
      }

      await ebookService.update(id, {
        title: form.title,
        description: form.description,
        fullContent: form.fullContent,
        genre: form.genre,
        price: Number(form.price),
        coverImage,
      });

      toast.success("Ebook updated!");
      router.push("/dashboard/writer?tab=ebooks");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update ebook");
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  if (fetching) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">Edit Ebook</h1>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 p-6 shadow-sm">
          {/* Cover Image Upload */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">Cover Image</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-40 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-8 w-8 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 dark:text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20" />
                <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">PNG, JPG up to 5MB. Uploaded to imgBB.</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-dark dark:text-white px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Genre *</label>
            <select value={form.genre} onChange={(e) => update("genre", e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-dark dark:text-white px-4 py-2 outline-none focus:border-primary">
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Price (USD) *</label>
            <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-dark dark:text-white px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-dark dark:text-white px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Full Content</label>
            <textarea rows={10} value={form.fullContent} onChange={(e) => update("fullContent", e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-dark dark:text-white px-4 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-secondary disabled:opacity-50">
            {loading ? <LoadingSpinner size="sm" /> : "Update Ebook"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="rounded-lg border border-gray-300 dark:border-slate-800 px-6 py-3 font-semibold text-gray-600 dark:text-slate-350 transition hover:bg-gray-50 dark:hover:bg-slate-900">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
