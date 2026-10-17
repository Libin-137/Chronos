"use client";

import { useActionState } from "react";
import { createTimetable, type FormState } from "./actions";

const initial: FormState = { ok: false, message: "" };
const input = "rounded border bg-neutral-900 p-2 text-white";

export default function CreateTimetableForm() {
  const [state, action, pending] = useActionState(createTimetable, initial);

  return (
    <details className="mb-6 rounded border p-3">
      <summary className="cursor-pointer font-medium">+ New timetable</summary>
      <form action={action} className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Timetable name
          <input name="name" required placeholder="Sem 6 CSE" className={input} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          First section
          <input name="section" required placeholder="Section A" className={input} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Days (comma separated)
          <input
            name="days"
            required
            defaultValue="Mon,Tue,Wed,Thu,Fri"
            className={input}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Periods per day
          <input
            name="periods"
            type="number"
            min={1}
            max={12}
            required
            defaultValue={8}
            className={input}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-white px-3 py-2 font-medium text-black disabled:opacity-50 sm:col-span-2"
        >
          {pending ? "Creating..." : "Create timetable"}
        </button>
        {state.message && (
          <p className="text-red-400 sm:col-span-2">{state.message}</p>
        )}
      </form>
    </details>
  );
}