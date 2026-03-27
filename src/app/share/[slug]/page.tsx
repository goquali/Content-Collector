import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BrainCircuit, ExternalLink, ImageIcon, Link2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDate, truncate } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export default async function SharedCollectionPage({ params }: PageProps) {
  const collection = await prisma.collection.findUnique({
    where: { shareSlug: params.slug },
    include: {
      contents: {
        include: { tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!collection) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-4">
          <BrainCircuit className="h-6 w-6 text-brand-600" />
          <span className="text-sm font-medium text-gray-500">
            AI Content Saver
          </span>
        </div>
      </header>

      {/* Banner */}
      <div className="border-b bg-gradient-to-r from-brand-50 to-blue-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Badge variant="blue" className="mb-2">
            Shared Collection
          </Badge>
          <h1 className="text-2xl font-bold text-gray-900">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mt-2 text-gray-600">{collection.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            {collection.contents.length} item
            {collection.contents.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {collection.contents.length === 0 ? (
          <p className="text-center text-gray-400">
            This collection is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collection.contents.map((content) => {
              const preview =
                content.type === "IMAGE"
                  ? content.imagePath
                  : content.previewUrl;
              return (
                <div
                  key={content.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
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
                      <Badge
                        variant={
                          content.type === "LINK" ? "blue" : "green"
                        }
                      >
                        {content.type === "LINK" ? "Link" : "Image"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {content.title}
                    </h3>
                    {content.description && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {truncate(content.description, 120)}
                      </p>
                    )}
                    {content.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {content.tags.map(({ tag }) => (
                          <Badge key={tag.id}>{tag.name}</Badge>
                        ))}
                      </div>
                    )}
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
