"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createContent(formData: FormData) {
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const url = (formData.get("url") as string) || null;
  const previewUrl = (formData.get("previewUrl") as string) || null;
  const imagePath = (formData.get("imagePath") as string) || null;
  const collectionId = (formData.get("collectionId") as string) || null;
  const tagIds = formData.getAll("tagIds") as string[];

  await prisma.content.create({
    data: {
      type,
      title,
      description,
      url,
      previewUrl,
      imagePath,
      collectionId: collectionId || null,
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  });

  revalidatePath("/");
}

export async function updateContent(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const url = (formData.get("url") as string) || null;
  const collectionId = (formData.get("collectionId") as string) || null;
  const tagIds = formData.getAll("tagIds") as string[];

  await prisma.contentTag.deleteMany({ where: { contentId: id } });

  await prisma.content.update({
    where: { id },
    data: {
      title,
      description,
      url,
      collectionId: collectionId || null,
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  });

  revalidatePath("/");
}

export async function deleteContent(id: string) {
  await prisma.content.delete({ where: { id } });
  revalidatePath("/");
}

export async function fetchLinkMetadata(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "AI-Content-Saver/1.0" },
    });
    clearTimeout(timeout);
    const html = await res.text();

    const ogTitle = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    )?.[1];
    const ogDesc = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    )?.[1];
    const ogImage = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    )?.[1];
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    const metaDesc = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    )?.[1];

    return {
      title: ogTitle || titleTag || "",
      description: ogDesc || metaDesc || "",
      previewUrl: ogImage || "",
    };
  } catch {
    return { title: "", description: "", previewUrl: "" };
  }
}
