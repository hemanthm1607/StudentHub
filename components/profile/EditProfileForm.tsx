"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import {
  User as UserIcon,
  Globe,
  Clock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import type { SafeUserProfileResponse } from "@/lib/services/profile-service";

interface EditProfileFormProps {
  initialData: SafeUserProfileResponse;
}

const COMMON_LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish (Español)" },
  { value: "French", label: "French (Français)" },
  { value: "German", label: "German (Deutsch)" },
  { value: "Hindi", label: "Hindi (हिन्दी)" },
  { value: "Mandarin", label: "Mandarin Chinese (中文)" },
  { value: "Japanese", label: "Japanese (日本語)" },
  { value: "Portuguese", label: "Portuguese (Português)" },
  { value: "Arabic", label: "Arabic (العربية)" },
  { value: "Other", label: "Other" },
];

const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada) - America/New_York" },
  { value: "America/Chicago", label: "Central Time (US & Canada) - America/Chicago" },
  { value: "America/Denver", label: "Mountain Time (US & Canada) - America/Denver" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada) - America/Los_Angeles" },
  { value: "Europe/London", label: "London, Dublin, Lisbon (GMT/BST) - Europe/London" },
  { value: "Europe/Paris", label: "Paris, Berlin, Rome, Madrid (CET) - Europe/Paris" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST) - Asia/Kolkata" },
  { value: "Asia/Singapore", label: "Singapore, Hong Kong, Beijing - Asia/Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo, Seoul - Asia/Tokyo" },
  { value: "Australia/Sydney", label: "Sydney, Melbourne (AEST) - Australia/Sydney" },
];

export function EditProfileForm({ initialData }: EditProfileFormProps) {
  const router = useRouter();
  const profile = initialData.profile;

  const [displayName, setDisplayName] = React.useState(profile.displayName || "");
  const [bio, setBio] = React.useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile.avatarUrl || "");
  const [languagePreference, setLanguagePreference] = React.useState(
    profile.languagePreference || "English"
  );
  const [timezone, setTimezone] = React.useState(profile.timezone || "UTC");
  const [isDiscoverable, setIsDiscoverable] = React.useState<boolean>(
    profile.isDiscoverable ?? true
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const MAX_BIO_LENGTH = 500;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!displayName.trim() || displayName.trim().length < 2) {
      errors.displayName = "Display name must be at least 2 characters.";
    } else if (displayName.trim().length > 50) {
      errors.displayName = "Display name cannot exceed 50 characters.";
    }

    if (bio && bio.length > MAX_BIO_LENGTH) {
      errors.bio = `Bio cannot exceed ${MAX_BIO_LENGTH} characters.`;
    }

    if (avatarUrl.trim()) {
      const lower = avatarUrl.trim().toLowerCase();
      if (
        lower.startsWith("javascript:") ||
        lower.startsWith("vbscript:") ||
        lower.startsWith("data:") ||
        lower.startsWith("file:")
      ) {
        errors.avatarUrl = "Unsafe URL scheme detected. Only HTTP or HTTPS URLs are permitted.";
      } else if (!avatarUrl.startsWith("/") && !lower.startsWith("http://") && !lower.startsWith("https://")) {
        errors.avatarUrl = "Please enter a valid HTTP/HTTPS URL (e.g., https://example.com/avatar.jpg).";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        displayName: displayName.trim(),
        bio: bio.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
        languagePreference,
        timezone,
        isDiscoverable,
      };

      const res = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setSuccessMsg("Profile saved successfully! Redirecting to your profile...");
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Edit Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your public student credentials, time preferences, and peer discoverability.
          </p>
        </div>
        <Link
          href="/profile"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Global Alert Banners */}
        {errorMsg && (
          <Alert variant="danger">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </Alert>
        )}

        {successMsg && (
          <Alert variant="success">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          </Alert>
        )}

        {/* Avatar Preview & URL Foundation */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar
            name={displayName || "Student"}
            src={avatarUrl.trim() || undefined}
            size="lg"
            className="w-16 h-16 text-lg ring-2 ring-blue-100 shrink-0"
          />
          <div className="space-y-1 w-full">
            <label htmlFor="avatar-url-input" className="block text-xs font-semibold text-slate-700">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="avatar-url-input"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.example.com/avatar.jpg"
                className={`w-full h-10 pl-9 pr-3 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  fieldErrors.avatarUrl ? "border-red-500" : "border-slate-300"
                }`}
              />
            </div>
            {fieldErrors.avatarUrl ? (
              <p className="text-xs text-red-600 font-medium">{fieldErrors.avatarUrl}</p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Provide a secure HTTPS image link. If left blank, your initials will be displayed.
              </p>
            )}
          </div>
        </div>

        {/* Display Name */}
        <Input
          label="Display Name"
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your full name or handle"
          error={fieldErrors.displayName}
          required
          helperText="Visible to classmates during peer learning sessions."
        />

        {/* Bio */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="bio-input" className="block text-xs font-semibold text-slate-700">
              Bio / About Me
            </label>
            <span
              className={`text-[11px] font-medium ${
                bio.length > MAX_BIO_LENGTH ? "text-red-600 font-bold" : "text-slate-400"
              }`}
            >
              {bio.length} / {MAX_BIO_LENGTH}
            </span>
          </div>
          <Textarea
            id="bio-input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell fellow students about your academic interests, background, and what topics you love discussing..."
            error={fieldErrors.bio}
          />
        </div>

        {/* Grid: Language & Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            label="Language Preference"
            id="language-preference"
            value={languagePreference}
            onChange={(e) => setLanguagePreference(e.target.value)}
            options={COMMON_LANGUAGES}
          />

          <Select
            label="Primary Timezone"
            id="timezone-preference"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={COMMON_TIMEZONES}
          />
        </div>

        {/* Discoverability Options */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700">
            Profile Discoverability
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setIsDiscoverable(true)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isDiscoverable
                  ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isDiscoverable ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">Discoverable</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Your profile and teaching skills can be matched with peers seeking help in future phases.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIsDiscoverable(false)}
              className={`p-4 rounded-xl border text-left transition-all ${
                !isDiscoverable
                  ? "border-slate-700 bg-slate-50 ring-1 ring-slate-700"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    !isDiscoverable ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">Private</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Hide your profile and skills from public peer searches. You can still use learning tools.
              </p>
            </button>
          </div>
        </div>

        {/* Submission & Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Link href="/profile">
            <Button type="button" variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
