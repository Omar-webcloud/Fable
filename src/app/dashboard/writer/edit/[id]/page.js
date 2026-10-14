"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { ebookService } from "@/services";
import { uploadToImgBB } from "@/lib/imgbb";
import { GENRES } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SectionBadge } from "@/components/ui/SectionHeader";
import { ManuscriptEditor } from "@/components/ui/ManuscriptEditor";
import { ArrowLeft, BookOpen, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditEbookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isFree, setIsFree] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fullContent: "",
    genre: GENRES[0],
    price: "",
    coverImage: "",
  });

  useEffect(() => {
    ebookService
      .getById(id)
      .then((res) => {
        const ebook = res.data;
        const free = ebook.isFree || Number(ebook.price) === 0;
        setIsFree(free);
        setForm({
          title: ebook.title || "",
          description: ebook.description || "",
          fullContent: ebook.fullContent || "",
          genre: ebook.genre || GENRES[0],
          price: free ? "0" : String(ebook.price || ""),
          coverImage: ebook.coverImage || "",
        });
        if (ebook.coverImage) setImagePreview(ebook.coverImage);
      })
      .catch(() => toast.error("Failed to load publication data"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFreeToggle = (checked) => {
    setIsFree(checked);
    if (checked) {
      setForm((prev) => ({ ...prev, price: "0" }));
    } else {
      setForm((prev) => ({ ...prev, price: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.genre) {
      toast.error("Please fill in title, genre, and synopsis");
      return;
    }

    if (!isFree && (!form.price || Number(form.price) < 0)) {
      toast.error("Please specify a valid price or toggle Free Ebook");
      return;
    }

    setLoading(true);
    try {
      let coverImage = form.coverImage;
      if (imageFile) {
        try {
          const imgResult = await uploadToImgBB(imageFile);
          coverImage = imgResult.url;
        } catch {
          toast.error("Image upload failed, retaining current artwork");
        }
      }

      await ebookService.update(id, {
        title: form.title,
        description: form.description,
        fullContent: form.fullContent,
        genre: form.genre,
        price: isFree ? 0 : Number(form.price),
        isFree,
        coverImage,
      });

      toast.success("Publication updated successfully!");
      router.push("/dashboard/writer?tab=ebooks");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update publication");
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  if (fetching) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-zinc-950 text-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/dashboard/writer?tab=ebooks"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Manage Ebooks</span>
        </Link>
        <SectionBadge>Publication Studio</SectionBadge>
        <h1 className="text-3xl font-normal tracking-tight text-white">Edit Manuscript</h1>
        <p className="text-xs text-zinc-400">
          Modify title, genre, toggle free reader access or update text formatting with the editor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border border-zinc-700/40 bg-zinc-900/60 p-8 space-y-6">
          {/* Cover Image Upload */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Cover Artwork
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex h-44 w-32 shrink-0 items-center justify-center overflow-hidden border border-dashed border-zinc-700 bg-zinc-950">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-3 text-zinc-600">
                    <BookOpen className="h-8 w-8 mx-auto mb-1 stroke-[1.2]" />
                    <span className="text-[10px] font-mono uppercase">No Artwork</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs text-zinc-400 file:mr-4 file:border file:border-zinc-700 file:bg-zinc-800 file:px-4 file:py-2 file:text-xs file:font-mono file:text-white hover:file:bg-zinc-700 cursor-pointer"
                />
                <p className="text-[11px] text-zinc-500 font-mono">
                  Select new image to replace current artwork.
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Manuscript Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
            />
          </div>

          {/* Pricing Options & Free Book Toggle */}
          <div className="border border-zinc-800 bg-zinc-950/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Gift className={cn("h-4 w-4", isFree ? "text-emerald-400" : "text-zinc-500")} />
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-medium">
                    Free Ebook Access
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Allow readers to read this manuscript completely free on the website without a payment gateway.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => handleFreeToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-zinc-800/80">
              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Genre Category *
                </label>
                <select
                  value={form.genre}
                  onChange={(e) => update("genre", e.target.value)}
                  className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-amber-500 cursor-pointer"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Unit Price (USD $) *
                </label>
                <input
                  type="number"
                  disabled={isFree}
                  min="0"
                  step="0.01"
                  value={isFree ? "0" : form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className={cn(
                    "w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-colors focus:border-amber-500",
                    isFree ? "text-emerald-400 opacity-60 font-mono font-bold" : "text-white"
                  )}
                  placeholder={isFree ? "0.00 (Free for readers)" : "9.99"}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Synopsis &amp; Abstract *
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
            />
          </div>

          {/* Manuscript Text Editor */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Full Manuscript Text (Text Editor &amp; Reader Preview)
            </label>
            <ManuscriptEditor
              value={form.fullContent}
              onChange={(val) => update("fullContent", val)}
              placeholder="Edit your manuscript chapters here..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-zinc-700 bg-transparent px-6 py-3.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
