import { requireAuth } from "@/lib/security/auth-helpers";
import { getUserProfile } from "@/lib/services/profile-service";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile - StudentHub",
  description: "Update your StudentHub profile information, display name, and preferences.",
};

export default async function EditProfilePage() {
  // Authoritative server-side authentication check. Redirects to /login if unauthenticated.
  const user = await requireAuth();

  const profileData = await getUserProfile(user.id);

  if (!profileData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-800">Profile Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">
          Unable to locate your profile data. Please try signing in again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <EditProfileForm initialData={profileData} />
    </div>
  );
}
