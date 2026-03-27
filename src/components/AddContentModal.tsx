"use client";

import { useState, useTransition } from "react";
import { Link2, ImagePlus, Loader2, Sparkles } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { createContent, fetchLinkMetadata } from "@/lib/actions/content";
import { createTag } from "@/lib/actions/tags";
import { cn } from "@/lib/utils";
import type { CollectionWithCount, TagWithCount } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  collections: CollectionWithCount[];
  tags: TagWithCount[];
}

export default function AddContentModal({
  open,
  onClose,
  collections,
  tags,
}: Props) {
  const [tab, setTab] = useState<"LINK" | "IMAGE">("LINK");
  const [isPending, startTransition] = useTransition();
  const [fetching, setFetching] = useState(false);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const reset = () => {
    setUrl("");
    setTitle("");
    setDescription("");
    setPreviewUrl("");
    setImageFile(null);
    setImagePreview("");
    setCollectionId("");
    setSelectedTags([]);
    setNewTag("");
  };

  const handleFetchMetadata = async () => {
    if (!url) return;
    setFetching(true);
    const meta = await fetchLinkMetadata(url);
    setTitle(meta.title || title);
    setDescription(meta.description || description);
    setPreviewUrl(meta.previewUrl || previewUrl);
    setFetching(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    const fd = new FormData();
    fd.set("name", newTag);
    await createTag(fd);
    setNewTag("");
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.set("type", tab);
    formData.set("title", title);
    formData.set("description", description);
    formData.set("collectionId", collectionId);
    selectedTags.forEach((id) => formData.append("tagIds", id));

    if (tab === "LINK") {
      formData.set("url", url);
      formData.set("previewUrl", previewUrl);
    } else if (imageFile) {
      const uploadData = new FormData();
      uploadData.set("file", imageFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const { path } = await res.json();
      formData.set("imagePath", path);
    }

    startTransition(async () => {
      await createContent(formData);
      reset();
      onClose();
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Save New Content">
      <div className="space-y-4">
        {/* Tab selector */}
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setTab("LINK")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
              tab === "LINK"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Link2 size={16} /> Web Link
          </button>
          <button
            onClick={() => setTab("IMAGE")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
              tab === "IMAGE"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <ImagePlus size={16} /> Image
          </button>
        </div>

        {/* Link tab */}
        {tab === "LINK" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/ai-tool-guide"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFetchMetadata}
                disabled={!url || fetching}
              >
                {fetching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
              </Button>
            </div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-full rounded-lg object-cover"
              />
            )}
          </div>
        )}

        {/* Image tab */}
        {tab === "IMAGE" && (
          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-brand-400 hover:bg-brand-50/30">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-40 rounded-lg object-contain"
                />
              ) : (
                <>
                  <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload an image
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    PNG, JPG, GIF, WebP up to 10MB
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Common fields */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description or notes..."
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />

        {/* Collection */}
        <select
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">No collection</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "blue" : "default"}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button variant="ghost" size="sm" onClick={handleAddTag}>
              Add Tag
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isPending} disabled={!title}>
            Save Content
          </Button>
        </div>
      </div>
    </Modal>
  );
}
