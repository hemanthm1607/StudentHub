import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Edit3,
  Mail,
  Globe,
  Clock,
  Eye,
  EyeOff,
  Flame,
  LayoutDashboard,
  Calendar,
} from "lucide-react";
import type { SafeUserProfileResponse } from "@/lib/services/profile-service";

interface ProfileHeaderProps {
  userProfile: SafeUserProfileResponse;
}

export function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  const { user, profile } = { user: userProfile, profile: userProfile.profile };

  const joinDate = new Date(userProfile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Avatar & Identity Details */}
        <div className="flex items-start sm:items-center gap-5">
          <Avatar
            name={profile.displayName}
            src={profile.avatarUrl || undefined}
            size="lg"
            className="w-20 h-20 text-xl ring-4 ring-blue-50/80 shadow-sm shrink-0"
          />

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {profile.displayName}
              </h1>
              <Badge variant="info" className="uppercase font-semibold text-[11px] tracking-wider">
                {userProfile.role}
              </Badge>
              {profile.isDiscoverable ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Eye className="w-3 h-3 text-emerald-600" /> Discoverable
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <EyeOff className="w-3 h-3 text-slate-500" /> Private
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{userProfile.email}</span>
              <span className="text-slate-300">·</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined {joinDate}</span>
            </p>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {profile.languagePreference}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {profile.timezone}
              </span>
              {profile.streakCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {profile.streakCount} day streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs font-semibold">
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
              Dashboard
            </Button>
          </Link>
          <Link href="/profile/edit">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 text-xs shadow-sm">
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Bio Section */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">About</h3>
        {profile.bio ? (
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic">
            No bio provided yet.{" "}
            <Link href="/profile/edit" className="text-blue-600 font-medium hover:underline not-italic">
              Add a brief introduction about yourself.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
