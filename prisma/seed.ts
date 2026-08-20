import { hash } from "bcryptjs";
import { PrismaClient, SourceType } from "@prisma/client";

const prisma = new PrismaClient();

const TEACHER_EMAIL = "teacher@atlas.local";
const TEACHER_PASSWORD = "Teacher123!";

const coursesSeed = [
  {
    title: "Anatomy Foundations",
    description:
      "Core anatomy pathways for clinical learners, organized for progressive review.",
    status: "PUBLISHED" as const,
    lectures: [
      {
        title: "Welcome to anatomy",
        description: "Orientation and how to use this course workspace.",
        sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
      },
      {
        title: "Body systems overview",
        description: "High-level walkthrough of major body systems.",
        sourceUrl: "https://www.youtube.com/watch?v=H08tGjXNHO4",
        order: 2,
      },
    ],
  },
  {
    title: "Clinical Reasoning",
    description:
      "Case-based reasoning habits for assessment, differentials, and next steps.",
    status: "PUBLISHED" as const,
    lectures: [
      {
        title: "Framing a case",
        description: "How to structure a clean clinical narrative.",
        sourceUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        order: 1,
      },
    ],
  },
  {
    title: "Mnemonic Studio",
    description:
      "Visual memory tools and recall drills for high-yield concepts.",
    status: "DRAFT" as const,
    lectures: [
      {
        title: "Building a mnemonic",
        description: "Practical method for durable visual cues.",
        sourceUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
        order: 1,
      },
      {
        title: "Recall practice loop",
        description: "Short practice cycle for spaced review.",
        sourceUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
        order: 2,
      },
    ],
  },
  {
    title: "Exam Pathway Prep",
    description:
      "Structured review path connecting lectures, questions, and rapid review.",
    status: "PUBLISHED" as const,
    lectures: [
      {
        title: "Pathway map",
        description: "How this course connects to exam outcomes.",
        sourceUrl: "https://www.youtube.com/watch?v=e-ORhEE9VVg",
        order: 1,
      },
    ],
  },
  {
    title: "Organization Workspace",
    description:
      "Private team workflows, roles, and secure collaboration patterns.",
    status: "DRAFT" as const,
    lectures: [
      {
        title: "Workspace walkthrough",
        description: "Tour of the organization learning workspace.",
        sourceUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        order: 1,
      },
      {
        title: "Roles and access",
        description: "How teacher-owned courses stay scoped and private.",
        sourceUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
        order: 2,
      },
    ],
  },
];

function inferSourceType(url: string): SourceType {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "youtu.be" || host.endsWith(".youtube.com")) {
      return SourceType.YOUTUBE;
    }
  } catch {
    return SourceType.LINK;
  }
  return SourceType.LINK;
}

async function main() {
  const password = await hash(TEACHER_PASSWORD, 12);

  const teacher = await prisma.user.upsert({
    where: { email: TEACHER_EMAIL },
    update: {
      name: "Atlas Teacher",
      password,
      role: "TEACHER",
    },
    create: {
      name: "Atlas Teacher",
      email: TEACHER_EMAIL,
      password,
      role: "TEACHER",
    },
  });

  await prisma.lecture.deleteMany({
    where: { course: { teacherId: teacher.id } },
  });
  await prisma.course.deleteMany({
    where: { teacherId: teacher.id },
  });

  for (const course of coursesSeed) {
    await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        status: course.status,
        teacherId: teacher.id,
        lectures: {
          create: course.lectures.map((lecture) => ({
            title: lecture.title,
            description: lecture.description,
            sourceUrl: lecture.sourceUrl,
            sourceType: inferSourceType(lecture.sourceUrl),
            order: lecture.order,
            status: "PUBLISHED",
          })),
        },
      },
    });
  }

  console.log("Seeded teacher LMS data:");
  console.log(`  email:    ${TEACHER_EMAIL}`);
  console.log(`  password: ${TEACHER_PASSWORD}`);
  console.log(`  courses:  ${coursesSeed.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
