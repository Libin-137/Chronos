import { prisma } from "../lib/prisma";

async function main() {
  console.log("Classes:", await prisma.classGroup.count());
  console.log("Teachers:", await prisma.teacher.count());
  console.log("Subjects:", await prisma.subject.count());
  console.log("Rooms:", await prisma.room.count());
  console.log("Slots:", await prisma.slot.count());

  try {
    await prisma.slot.create({
      data: { day: 1, period: 1, classGroupId: 1, subjectId: 2, teacherId: 1, roomId: 2 },
    });
    console.log("PROBLEM: duplicate booking was accepted");
  } catch {
    console.log("OK: duplicate booking was rejected");
  }
}

main().finally(() => prisma.$disconnect());