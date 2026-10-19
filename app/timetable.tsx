import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import ResourceForm from "./resource-form";

function tab(active: boolean) {
  return `rounded border px-3 py-1 text-sm ${
    active ? "bg-white text-black" : "hover:bg-neutral-800"
  }`;
}

export default async function Timetable({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; s?: string }>;
}) {
  await connection();
  const { t, s } = await searchParams;

  const timetables = await prisma.timetable.findMany({
    orderBy: { id: "asc" },
    include: {
      sections: { orderBy: { id: "asc" } },
      teachers: { orderBy: { name: "asc" } },
      subjects: { orderBy: { name: "asc" } },
      rooms: { orderBy: { name: "asc" } },
    },
  });

  if (timetables.length === 0) {
    return <p>No timetables yet. Run the seed script first.</p>;
  }

  const tt = timetables.find((x) => x.id === Number(t)) ?? timetables[0];
  const section =
    tt.sections.find((x) => x.id === Number(s)) ?? tt.sections[0];

  const slots = section
    ? await prisma.slot.findMany({
        where: { sectionId: section.id },
        include: { subject: true, teacher: true, room: true },
      })
    : [];

  const days = tt.days.split(",");
  const periods = Array.from({ length: tt.periodsPerDay }, (_, i) => i + 1);
  const find = (day: number, period: number) =>
    slots.find((x) => x.day === day && x.period === period);

  const list = (items: { name: string }[]) =>
    items.length ? items.map((i) => i.name).join(", ") : "none yet";

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {timetables.map((x) => (
          <Link key={x.id} href={`/?t=${x.id}`} className={tab(x.id === tt.id)}>
            {x.name}
          </Link>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tt.sections.map((x) => (
          <Link
            key={x.id}
            href={`/?t=${tt.id}&s=${x.id}`}
            className={tab(x.id === section?.id)}
          >
            {x.name}
          </Link>
        ))}
      </div>

      <ResourceForm timetableId={tt.id} />

      <div className="mb-6 space-y-1 text-sm opacity-80">
        <p>Teachers: {list(tt.teachers)}</p>
        <p>Subjects: {list(tt.subjects.map((x) => ({ name: `${x.name} (${x.code})` })))}</p>
        <p>Rooms: {list(tt.rooms)}</p>
      </div>

      {!section ? (
        <p>This timetable has no sections yet.</p>
      ) : (
        <>
          <h2 className="mb-3 text-xl font-semibold">
            {tt.name} · {section.name}
          </h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2">Period</th>
                {days.map((d) => (
                  <th key={d} className="border p-2">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p}>
                  <td className="border p-2 font-medium">{p}</td>
                  {days.map((_, i) => {
                    const slot = find(i + 1, p);
                    return (
                      <td key={i} className="border p-2 align-top">
                        {slot && (
                          <>
                            <div className="font-medium">{slot.subject.name}</div>
                            <div>{slot.teacher.name}</div>
                            <div className="text-xs opacity-70">{slot.room.name}</div>
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}