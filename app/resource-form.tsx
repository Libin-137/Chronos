"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addItem, type FormState } from "./actions";

const initial: FormState = { ok: false, message: "" };
const input = "rounded border bg-neutral-900 p-2 text-white";

export default function ResourceForm({ timetableId }: { timetableId: number }) {
  const [state, action, pending] = useActionState(addItem, initial);
  const [kind, setKind] = useState("teacher");
  const ref = useRef<HTMLFormElement>(null);

    useEffect(() => {
    if (state.ok && ref.current) {
      ref.current
        .querySelectorAll<HTMLInputElement>(
          'input[name="name"], input[name="code"], input[name="capacity"]'
        )
        .forEach((el) => {
          el.value = "";
        });
    }
  }, [state]);

  return (
    <form
      ref={ref}
      action={action}
      className="mb-6 grid gap-3 rounded border p-3 sm:grid-cols-4"
    >
      <input type="hidden" name="timetableId" value={timetableId} />
      <label className="flex flex-col gap-1 text-sm">
        Add a
        <select
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className={input}
        >
          <option value="teacher">Teacher</option>
          <option value="subject">Subject</option>
          <option value="room">Room</option>
          <option value="section">Section</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input name="name" required className={input} />
      </label>
      {kind === "subject" && (
        <label className="flex flex-col gap-1 text-sm">
          Code
          <input name="code" required placeholder="CS101" className={input} />
        </label>
      )}
      {kind === "room" && (
        <label className="flex flex-col gap-1 text-sm">
          Capacity (optional)
          <input name="capacity" type="number" min={1} className={input} />
        </label>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-white px-3 py-2 font-medium text-black disabled:opacity-50 sm:self-end"
      >
        {pending ? "Adding..." : "Add"}
      </button>
      {state.message && (
        <p className={`sm:col-span-4 ${state.ok ? "text-green-400" : "text-red-400"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}