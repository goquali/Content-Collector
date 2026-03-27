"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCollection(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;

  await prisma.collection.create({
    data: { name, description },
  });

  revalidatePath("/");
}

export async function updateCollection(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;

  await prisma.collection.update({
    where: { id },
    data: { name, description },
  });

  revalidatePath("/");
}

export async function deleteCollection(id: string) {
  await prisma.content.updateMany({
    where: { collectionId: id },
    data: { collectionId: null },
  });
  await prisma.collection.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleShareCollection(id: string) {
  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection) return;

  const { nanoid } = await import("nanoid");

  await prisma.collection.update({
    where: { id },
    data: {
      shareSlug: collection.shareSlug ? null : nanoid(10),
    },
  });

  revalidatePath("/");
}
