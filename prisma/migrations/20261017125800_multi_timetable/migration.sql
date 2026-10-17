/*
  Warnings:

  - You are about to drop the `ClassGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `classGroupId` on the `Slot` table. All the data in the column will be lost.
  - Added the required column `timetableId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timetableId` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timetableId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ClassGroup_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ClassGroup";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Timetable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "days" TEXT NOT NULL DEFAULT 'Mon,Tue,Wed,Thu,Fri',
    "periodsPerDay" INTEGER NOT NULL DEFAULT 8,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "timetableId" INTEGER NOT NULL,
    CONSTRAINT "Section_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "capacity" INTEGER,
    "timetableId" INTEGER NOT NULL,
    CONSTRAINT "Room_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("capacity", "id", "name") SELECT "capacity", "id", "name" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_timetableId_name_key" ON "Room"("timetableId", "name");
CREATE TABLE "new_Slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "Slot_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Slot_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Slot_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Slot_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Slot" ("day", "id", "period", "roomId", "subjectId", "teacherId") SELECT "day", "id", "period", "roomId", "subjectId", "teacherId" FROM "Slot";
DROP TABLE "Slot";
ALTER TABLE "new_Slot" RENAME TO "Slot";
CREATE UNIQUE INDEX "Slot_day_period_sectionId_key" ON "Slot"("day", "period", "sectionId");
CREATE UNIQUE INDEX "Slot_day_period_teacherId_key" ON "Slot"("day", "period", "teacherId");
CREATE UNIQUE INDEX "Slot_day_period_roomId_key" ON "Slot"("day", "period", "roomId");
CREATE TABLE "new_Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "timetableId" INTEGER NOT NULL,
    CONSTRAINT "Subject_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subject" ("code", "id", "name") SELECT "code", "id", "name" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
CREATE UNIQUE INDEX "Subject_timetableId_code_key" ON "Subject"("timetableId", "code");
CREATE TABLE "new_Teacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "timetableId" INTEGER NOT NULL,
    CONSTRAINT "Teacher_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Teacher" ("id", "name") SELECT "id", "name" FROM "Teacher";
DROP TABLE "Teacher";
ALTER TABLE "new_Teacher" RENAME TO "Teacher";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Section_timetableId_name_key" ON "Section"("timetableId", "name");
