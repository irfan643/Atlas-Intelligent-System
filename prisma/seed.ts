import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DOCTOR_EMAIL = "doctor@atlas.local";
const DOCTOR_PASSWORD = "Doctor123!";

async function main() {
  const password = await hash(DOCTOR_PASSWORD, 12);

  const doctor = await prisma.user.upsert({
    where: { email: DOCTOR_EMAIL },
    update: {
      name: "Atlas Doctor",
      password,
      role: "DOCTOR",
    },
    create: {
      name: "Atlas Doctor",
      email: DOCTOR_EMAIL,
      password,
      role: "DOCTOR",
    },
  });

  // Clear any previous sample courses/lectures for this doctor (and legacy teacherId data if present).
  await prisma.lecture.deleteMany({});
  await prisma.course.deleteMany({});

  // Migrate old TEACHER accounts to DOCTOR where possible via upsert above only.
  // Do not seed courses — new doctors start empty.

  console.log("Seeded doctor account (no courses):");
  console.log(`  email:    ${DOCTOR_EMAIL}`);
  console.log(`  password: ${DOCTOR_PASSWORD}`);
  console.log(`  doctorId: ${doctor.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
