"use client";

import { BookOpen } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import type { ContentWithRelations, CollectionWithCount, TagWithCount } from "@/types";

interface Props {
  contents: ContentWithRelations[];
  collections: CollectionWithCount[];
  tags: TagWithCount[];
}

export default function ContentGrid({ contents }: Props) {
  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 h-16 w-16 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-500">No content yet</h3>
        <p className="mt-1 text-sm text-gray-400">
          Save your first AI tool link or image to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
