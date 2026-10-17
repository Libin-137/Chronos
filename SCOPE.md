# Chronos: Scope

## What it is
Chronos is a timetable management web app. It lets a user define
classes, teachers, subjects and rooms, assign them to weekly time
slots, and view the result as a weekly grid. It prevents double-booking.

## Must have
- Add, edit and delete classes, teachers, subjects and rooms
- Assign a subject + teacher + room to a class on a day and period
- Weekly timetable grid view (per class)
- Conflict detection: a teacher, room or class cannot be in two
  places in the same period

## Not now
- Login and user roles
- Notifications
- PDF/Excel export

## Tech
Next.js, TypeScript, Tailwind CSS, Prisma, SQLite