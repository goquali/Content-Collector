"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrainCircuit, Plus, Search, FolderOpen, X } from "lucide-react";
import Button from "@/components/ui/Button";
import AddContentModal from "@/components/AddContentModal";
import CollectionSidebar from "@/components/CollectionSidebar";
import type { CollectionWithCount, TagWithCount } from "@/types";

interface HeaderProps {
  collections: CollectionWithCount[];
  tags: TagWithCount[];
}

export default function Header({ collections, tags }: HeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-3 px-4 md:h-16 md:gap-4 md:px-6">
          {/* Mobile collections button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <FolderOpen size={20} />
          </button>

          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-brand-600 md:h-7 md:w-7" />
            <span className="hidden text-lg font-bold text-gray-900 sm:inline">
              AI Content Saver
            </span>
          </div>

          <form
            onSubmit={handleSearch}
            className="ml-2 flex flex-1 max-w-md items-center md:ml-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </form>

          <div className="ml-auto">
            <Button onClick={() => setModalOpen(true)} size="sm" className="md:hidden">
              <Plus size={18} />
            </Button>
            <Button onClick={() => setModalOpen(true)} className="hidden md:inline-flex">
              <Plus size={18} className="mr-1.5" />
              Add Content
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile collections drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="font-semibold text-gray-900">Collections</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div onClick={() => setDrawerOpen(false)}>
              <CollectionSidebar
                collections={collections}
                activeId={searchParams.get("collection") || undefined}
                mobile
              />
            </div>
          </div>
        </div>
      )}

      <AddContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        collections={collections}
        tags={tags}
      />
    </>
  );
}
