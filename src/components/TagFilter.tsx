"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { TagWithCount } from "@/types";

interface Props {
  tags: TagWithCount[];
  activeId?: string;
}

export default function TagFilter({ tags, activeId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (tags.length === 0) return null;

  const handleSelect = (tagId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagId) {
      params.set("tag", tagId);
    } else {
      params.delete("tag");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect()}
        className={cn(
          "rounded-full px-3 py-1 text-sm font-medium transition-colors",
          !activeId
            ? "bg-brand-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleSelect(tag.id)}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors",
            activeId === tag.id
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {tag.name}
          <span className="ml-1 text-xs opacity-70">{tag._count.contents}</span>
        </button>
      ))}
    </div>
  );
}
