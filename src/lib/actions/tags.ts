"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTag(formData: FormData) {
  const name = (formData.get("name") as string).trim().toLowerCase();
  if (!name) return;

  await prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name },
  });

  revalidatePath("/");
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/");
}
