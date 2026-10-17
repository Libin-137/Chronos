import { prisma } from "../lib/prisma";

async function main() {
  await prisma.slot.deleteMany();
  await prisma.classGroup.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.room.deleteMany();

  const cls = await prisma.classGroup.create({ data: { name: "3rd Year AI&DS" } });
  const t1 = await prisma.teacher.create({ data: { name: "Teacher A" } });
  const t2 = await prisma.teacher.create({ data: { name: "Teacher B" } });
  const s1 = await prisma.subject.create({ data: { name: "Big Data Architecture", code: "AD23531" } });
  const s2 = await prisma.subject.create({ data: { name: "Operating Systems", code: "CS101" } });
  const r1 = await prisma.room.create({ data: { name: "Room 101", capacity: 60 } });
  const r2 = await prisma.room.create({ data: { name: "Lab 1", capacity: 40 } });

  await prisma.slot.createMany({
    data: [
      { day: 1, period: 1, classGroupId: cls.id, subjectId: s1.id, teacherId: t1.id, roomId: r1.id },
      { day: 1, period: 2, classGroupId: cls.id, subjectId: s2.id, teacherId: t2.id, roomId: r2.id },
    ],
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