import { requireAuth } from "@/lib/security/auth-helpers";
import { getUserProfile } from "@/lib/services/profile-service";
import { getStudentSkills } from "@/lib/services/skill-service";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SkillManagement } from "@/components/profile/SkillManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Profile - StudentHub",
  description: "View and manage your student profile, teaching skills, and learning goals.",
};

export default async function ProfilePage() {
  // Authoritative server-side authentication check. Redirects to /login if unauthenticated.
  const user = await requireAuth();

  // Load authoritative profile data
  const profileData = await getUserProfile(user.id);
  const studentSkillsData = await getStudentSkills(user.id);

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-800">Profile Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">
          Unable to locate student profile data. Please try signing in again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header & Information */}
      <ProfileHeader userProfile={profileData} />

      {/* Skill Management: Skills I Can Teach & Skills I Want To Learn */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Skills & Learning Portfolio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Share what you can teach to help classmates, and declare what you want to master.
          </p>
        </div>

        <SkillManagement
          initialTeachSkills={studentSkillsData.teachSkills}
          initialLearnSkills={studentSkillsData.learnSkills}
        />
      </div>
    </div>
  );
}
