import { Suspense } from "react";
import Timetable from "./timetable";
import CreateTimetableForm from "./create-timetable-form";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; s?: string }>;
}) {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Chronos</h1>
      <CreateTimetableForm />
      <Suspense fallback={<p>Loading timetable...</p>}>
        <Timetable searchParams={searchParams} />
      </Suspense>
    </main>
  );
}