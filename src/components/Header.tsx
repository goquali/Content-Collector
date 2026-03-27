"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrainCircuit, Plus, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import AddContentModal from "@/components/AddContentModal";
import type { CollectionWithCount, TagWithCount } from "@/types";

interface HeaderProps {
  collections: CollectionWithCount[];
  tags: TagWithCount[];
}

export default function Header({ collections, tags }: HeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
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
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-brand-600" />
            <span className="text-lg font-bold text-gray-900">
              AI Content Saver
            </span>
          </div>

          <form
            onSubmit={handleSearch}
            className="ml-8 flex flex-1 max-w-md items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search saved content..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </form>

          <div className="ml-auto">
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={18} className="mr-1.5" />
              Add Content
            </Button>
          </div>
        </div>
      </header>

      <AddContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        collections={collections}
        tags={tags}
      />
    </>
  );
}
