"use client";

import { useState, useTransition } from "react";
import {
  ExternalLink,
  ImageIcon,
  Link2,
  MoreVertical,
  Trash2,
  Edit3,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { deleteContent } from "@/lib/actions/content";
import { formatDate, truncate } from "@/lib/utils";
import type { ContentWithRelations } from "@/types";

interface Props {
  content: ContentWithRelations;
}

export default function ContentCard({ content }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const preview =
    content.type === "IMAGE"
      ? content.imagePath
      : content.previewUrl || null;

  const handleDelete = () => {
    startTransition(async () => {
      await deleteContent(content.id);
    });
    setMenuOpen(false);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Preview image */}
      <div className="relative h-44 bg-gray-100">
        {preview ? (
          <img
            src={preview}
            alt={content.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {content.type === "LINK" ? (
              <Link2 className="h-12 w-12 text-gray-300" />
            ) : (
              <ImageIcon className="h-12 w-12 text-gray-300" />
            )}
          </div>
        )}
        <div className="absolute left-2 top-2">
          <Badge variant={content.type === "LINK" ? "blue" : "green"}>
            {content.type === "LINK" ? "Link" : "Image"}
          </Badge>
        </div>

        {/* Menu */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg bg-white/90 p-1.5 shadow-sm hover:bg-white"
          >
            <MoreVertical size={16} className="text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border bg-white py-1 shadow-lg">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {content.title}
        </h3>
        {content.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {truncate(content.description, 120)}
          </p>
        )}

        {/* Tags */}
        {content.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {content.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="default">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xs text-gray-400">
            {formatDate(content.createdAt)}
          </span>
          {content.type === "LINK" && content.url && (
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
            >
              Open <ExternalLink size={12} />
            </a>
          )}
          {content.collection && (
            <span className="text-xs text-gray-400">
              {content.collection.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
