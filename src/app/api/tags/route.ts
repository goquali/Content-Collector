import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { contents: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}
