import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { contents: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(collections);
}
