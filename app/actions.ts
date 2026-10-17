"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type FormState = { ok: boolean; message: string };

export async function createTimetable(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  const section = String(formData.get("section") ?? "").trim().slice(0, 60);
  const days = String(formData.get("days") ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  const periods = Number(formData.get("periods"));

  if (!name) return { ok: false, message: "Give the timetable a name." };
  if (!section) return { ok: false, message: "Give the first section a name." };
  if (days.length < 1 || days.length > 7) {
    return { ok: false, message: "Enter between 1 and 7 days, separated by commas." };
  }
  if (new Set(days.map((d) => d.toLowerCase())).size !== days.length) {
    return { ok: false, message: "Day names must be different from each other." };
  }
  if (!Number.isInteger(periods) || periods < 1 || periods > 12) {
    return { ok: false, message: "Periods per day must be between 1 and 12." };
  }

  const tt = await prisma.timetable.create({
    data: {
      name,
      days: days.join(","),
      periodsPerDay: periods,
      sections: { create: { name: section } },
    },
  });

  revalidatePath("/");
  redirect(`/?t=${tt.id}`);
}