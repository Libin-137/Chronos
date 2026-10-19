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

export async function addItem(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const timetableId = Number(formData.get("timetableId"));
  const kind = String(formData.get("kind") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  const code = String(formData.get("code") ?? "").trim().slice(0, 20);
  const capRaw = String(formData.get("capacity") ?? "").trim();

  if (!Number.isInteger(timetableId) || timetableId < 1) {
    return { ok: false, message: "Unknown timetable." };
  }
  if (!name) return { ok: false, message: "Enter a name." };

  try {
    switch (kind) {
      case "teacher":
        await prisma.teacher.create({ data: { name, timetableId } });
        break;
      case "subject":
        if (!code) return { ok: false, message: "A subject needs a code." };
        await prisma.subject.create({ data: { name, code, timetableId } });
        break;
      case "room": {
        const capacity = capRaw ? Number(capRaw) : null;
        if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) {
          return { ok: false, message: "Capacity must be a whole number." };
        }
        await prisma.room.create({ data: { name, capacity, timetableId } });
        break;
      }
      case "section":
        await prisma.section.create({ data: { name, timetableId } });
        break;
      default:
        return { ok: false, message: "Choose what you want to add." };
    }
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === "P2002" || /unique/i.test(err.message ?? "")) {
      return { ok: false, message: "That already exists in this timetable." };
    }
    throw e;
  }

  revalidatePath("/");
  return { ok: true, message: `Added ${kind} "${name}".` };
}