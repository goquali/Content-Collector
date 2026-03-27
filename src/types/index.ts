import type { Content, Collection, Tag, ContentTag } from "@prisma/client";

export type ContentWithRelations = Content & {
  tags: (ContentTag & { tag: Tag })[];
  collection: Collection | null;
};

export type CollectionWithCount = Collection & {
  _count: { contents: number };
};

export type TagWithCount = Tag & {
  _count: { contents: number };
};

export type ContentType = "LINK" | "IMAGE";
