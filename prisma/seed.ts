import { prisma } from "../lib/prisma";

async function main() {
  await prisma.slot.deleteMany();
  await prisma.section.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.room.deleteMany();
  await prisma.timetable.deleteMany();

  // Timetable 1: a college class
  const college = await prisma.timetable.create({
    data: { name: "Sem 5 AI&DS", days: "Mon,Tue,Wed,Thu,Fri", periodsPerDay: 8 },
  });
  const sec = await prisma.section.create({
    data: { name: "3rd Year", timetableId: college.id },
  });
  const t1 = await prisma.teacher.create({ data: { name: "Teacher A", timetableId: college.id } });
  const t2 = await prisma.teacher.create({ data: { name: "Teacher B", timetableId: college.id } });
  const s1 = await prisma.subject.create({
    data: { name: "Big Data Architecture", code: "AD23531", timetableId: college.id },
  });
  const s2 = await prisma.subject.create({
    data: { name: "Operating Systems", code: "CS101", timetableId: college.id },
  });
  const r1 = await prisma.room.create({ data: { name: "Room 101", capacity: 60, timetableId: college.id } });
  const r2 = await prisma.room.create({ data: { name: "Lab 1", capacity: 40, timetableId: college.id } });

  await prisma.slot.createMany({
    data: [
      { day: 1, period: 1, sectionId: sec.id, subjectId: s1.id, teacherId: t1.id, roomId: r1.id },
      { day: 1, period: 2, sectionId: sec.id, subjectId: s2.id, teacherId: t2.id, roomId: r2.id },
    ],
  });

  // Timetable 2: a personal weekly routine
  const personal = await prisma.timetable.create({
    data: { name: "My Weekly Routine", days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun", periodsPerDay: 4 },
  });
  const me = await prisma.section.create({ data: { name: "Me", timetableId: personal.id } });
  const self = await prisma.teacher.create({ data: { name: "Self", timetableId: personal.id } });
  const gym = await prisma.subject.create({ data: { name: "Gym", code: "GYM", timetableId: personal.id } });
  const home = await prisma.room.create({ data: { name: "Home", timetableId: personal.id } });
  await prisma.slot.create({
    data: { day: 6, period: 1, sectionId: me.id, subjectId: gym.id, teacherId: self.id, roomId: home.id },
  });

  console.log("Seeded.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });