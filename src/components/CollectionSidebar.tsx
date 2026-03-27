"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  Folder,
  Plus,
  Trash2,
  Share2,
  LayoutGrid,
  Check,
  Link as LinkIcon,
} from "lucide-react";
import { createCollection, deleteCollection, toggleShareCollection } from "@/lib/actions/collections";
import { cn } from "@/lib/utils";
import type { CollectionWithCount } from "@/types";

interface Props {
  collections: CollectionWithCount[];
  activeId?: string;
}

export default function CollectionSidebar({ collections, activeId }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const fd = new FormData();
    fd.set("name", newName);
    startTransition(async () => {
      await createCollection(fd);
      setNewName("");
      setCreating(false);
    });
  };

  const handleSelect = (id?: string) => {
    if (id) {
      router.push(`/?collection=${id}`);
    } else {
      router.push("/");
    }
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteCollection(id);
    });
  };

  const handleShare = (id: string, shareSlug: string | null) => {
    startTransition(async () => {
      await toggleShareCollection(id);
      if (!shareSlug) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    });
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white p-4 md:block">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Collections
        </h2>
        <button
          onClick={() => setCreating(true)}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <Plus size={16} />
        </button>
      </div>

      {creating && (
        <div className="mb-3 flex gap-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Collection name"
            className="flex-1 rounded-md border px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setCreating(false);
            }}
          />
          <button
            onClick={handleCreate}
            className="rounded-md bg-brand-600 px-2 py-1 text-xs text-white hover:bg-brand-700"
          >
            Add
          </button>
        </div>
      )}

      <nav className="space-y-1">
        <button
          onClick={() => handleSelect()}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            !activeId
              ? "bg-brand-50 text-brand-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <LayoutGrid size={16} />
          All Content
        </button>

        {collections.map((col) => (
          <div key={col.id} className="group relative">
            <button
              onClick={() => handleSelect(col.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                activeId === col.id
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {activeId === col.id ? (
                <FolderOpen size={16} />
              ) : (
                <Folder size={16} />
              )}
              <span className="flex-1 truncate text-left">{col.name}</span>
              <span className="text-xs text-gray-400">
                {col._count.contents}
              </span>
            </button>
            <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(col.id, col.shareSlug);
                }}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title={col.shareSlug ? "Unshare" : "Share"}
              >
                {copiedId === col.id ? (
                  <Check size={12} className="text-green-500" />
                ) : col.shareSlug ? (
                  <LinkIcon size={12} className="text-green-500" />
                ) : (
                  <Share2 size={12} />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(col.id);
                }}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
