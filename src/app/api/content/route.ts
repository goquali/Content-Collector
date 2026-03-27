import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const collectionId = searchParams.get("collectionId");
  const tagId = searchParams.get("tagId");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (collectionId) where.collectionId = collectionId;
  if (tagId) where.tags = { some: { tagId } };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { url: { contains: search } },
    ];
  }

  const contents = await prisma.content.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
      collection: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contents);
}
