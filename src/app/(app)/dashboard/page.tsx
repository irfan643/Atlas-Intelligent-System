import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DoctorDashboardOverview } from "@/features/doctor/doctor-dashboard";
import { getDoctorDashboard } from "@/features/doctor/service";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const data = await getDoctorDashboard(session.id);

  return (
    <DoctorDashboardOverview
      doctorName={session.name}
      publishedCount={data.publishedCount}
      pendingCount={data.pendingCount}
      latestCourses={data.latestCourses}
    />
  );
}
