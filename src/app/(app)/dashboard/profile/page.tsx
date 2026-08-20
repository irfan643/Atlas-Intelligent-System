import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DoctorProfileForm } from "@/features/doctor/doctor-profile-form";
import { getDoctorProfile } from "@/features/doctor/service";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const profile = await getDoctorProfile(session.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Update your doctor account details.
        </p>
      </div>
      <DoctorProfileForm name={profile.name} email={profile.email} />
    </div>
  );
}
