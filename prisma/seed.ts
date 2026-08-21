import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DOCTOR_EMAIL = "doctor@atlas.local";
const DOCTOR_PASSWORD = "Doctor123!";
const STUDENT_PASSWORD = "Student123!";

async function main() {
  const doctorPassword = await hash(DOCTOR_PASSWORD, 12);
  const studentPassword = await hash(STUDENT_PASSWORD, 12);

  const doctor = await prisma.user.upsert({
    where: { email: DOCTOR_EMAIL },
    update: {
      name: "Atlas Doctor",
      password: doctorPassword,
      role: "DOCTOR",
    },
    create: {
      name: "Atlas Doctor",
      email: DOCTOR_EMAIL,
      password: doctorPassword,
      role: "DOCTOR",
    },
  });

  await prisma.lectureProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.lecture.deleteMany({});
  await prisma.course.deleteMany({});

  const course = await prisma.course.create({
    data: {
      title: "Introduction to Clinical Skills",
      description:
        "A sample course covering foundational clinical skills, patient communication, and basic assessment techniques for demo progress tracking.",
      status: "PUBLISHED",
      doctorId: doctor.id,
      enrollmentCount: 3,
      lectures: {
        create: [
          {
            title: "Patient Communication Basics",
            description:
              "Core communication techniques for effective patient interviews.",
            sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            sourceType: "YOUTUBE",
            order: 1,
            status: "PUBLISHED",
          },
          {
            title: "Vital Signs Overview",
            description:
              "How to measure and interpret pulse, blood pressure, and temperature.",
            sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            sourceType: "YOUTUBE",
            order: 2,
            status: "PUBLISHED",
          },
          {
            title: "Clinical Documentation",
            description:
              "Writing clear notes and summarizing encounters accurately.",
            sourceUrl: "https://example.com/clinical-docs",
            sourceType: "LINK",
            order: 3,
            status: "PUBLISHED",
          },
        ],
      },
    },
    include: { lectures: { orderBy: { order: "asc" } } },
  });

  const studentSpecs = [
    { name: "Student One", email: "student1@atlas.local", completeCount: 0 },
    { name: "Student Two", email: "student2@atlas.local", completeCount: 1 },
    { name: "Student Three", email: "student3@atlas.local", completeCount: 3 },
  ] as const;

  for (const spec of studentSpecs) {
    const student = await prisma.user.upsert({
      where: { email: spec.email },
      update: {
        name: spec.name,
        password: studentPassword,
        role: "STUDENT",
      },
      create: {
        name: spec.name,
        email: spec.email,
        password: studentPassword,
        role: "STUDENT",
      },
    });

    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id,
      },
    });

    const lecturesToComplete = course.lectures.slice(0, spec.completeCount);
    for (const lecture of lecturesToComplete) {
      await prisma.lectureProgress.create({
        data: {
          userId: student.id,
          lectureId: lecture.id,
        },
      });
    }
  }

  console.log("Seeded doctor, sample course, and students:");
  console.log(`  doctor:   ${DOCTOR_EMAIL} / ${DOCTOR_PASSWORD}`);
  console.log(`  course:   ${course.title} (${course.id})`);
  console.log(`  students: student1|2|3@atlas.local / ${STUDENT_PASSWORD}`);
  console.log("  progress: 0/3, 1/3, 3/3");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
