import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import ContentGrid from "@/components/ContentGrid";
import CollectionSidebar from "@/components/CollectionSidebar";
import TagFilter from "@/components/TagFilter";

interface PageProps {
  searchParams: { collection?: string; tag?: string; search?: string };
}

export default async function Home({ searchParams }: PageProps) {
  const where: Record<string, unknown> = {};

  if (searchParams.collection) {
    where.collectionId = searchParams.collection;
  }
  if (searchParams.tag) {
    where.tags = { some: { tagId: searchParams.tag } };
  }
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
      { url: { contains: searchParams.search } },
    ];
  }

  const [contents, collections, tags] = await Promise.all([
    prisma.content.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
        collection: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.collection.findMany({
      include: { _count: { select: { contents: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({
      include: { _count: { select: { contents: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header collections={collections} tags={tags} />
      <div className="flex flex-1">
        <CollectionSidebar
          collections={collections}
          activeId={searchParams.collection}
        />
        <main className="flex-1 p-6">
          <TagFilter tags={tags} activeId={searchParams.tag} />
          <ContentGrid contents={contents} collections={collections} tags={tags} />
        </main>
      </div>
    </div>
  );
}
