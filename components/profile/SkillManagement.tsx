"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  Plus,
  BookOpen,
  GraduationCap,
  Trash2,
  Check,
  Search,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { SkillItem, StudentSkillResponse } from "@/lib/services/skill-service";
import type { SkillLevel, SkillPairType } from "@prisma/client";

interface SkillManagementProps {
  initialTeachSkills?: StudentSkillResponse[];
  initialLearnSkills?: StudentSkillResponse[];
}

const PROFICIENCY_CONFIG: Record<
  SkillLevel,
  { label: string; badgeVariant: "default" | "info" | "success" }
> = {
  BEGINNER: { label: "Beginner", badgeVariant: "default" },
  INTERMEDIATE: { label: "Intermediate", badgeVariant: "info" },
  ADVANCED: { label: "Advanced", badgeVariant: "success" },
};

export function SkillManagement({
  initialTeachSkills = [],
  initialLearnSkills = [],
}: SkillManagementProps) {
  const [teachSkills, setTeachSkills] = React.useState<StudentSkillResponse[]>(initialTeachSkills);
  const [learnSkills, setLearnSkills] = React.useState<StudentSkillResponse[]>(initialLearnSkills);

  // Available skills directory catalog
  const [directorySkills, setDirectorySkills] = React.useState<SkillItem[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [loadingDirectory, setLoadingDirectory] = React.useState(false);

  // Modal dialog states
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<SkillPairType>("TEACH");
  const [selectedSkillId, setSelectedSkillId] = React.useState<string>("");
  const [selectedProficiency, setSelectedProficiency] = React.useState<SkillLevel>("BEGINNER");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  // Interaction / Loading feedback
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [activeActionId, setActiveActionId] = React.useState<string | null>(null);

  // Delete confirmation modal state
  const [skillToDelete, setSkillToDelete] = React.useState<StudentSkillResponse | null>(null);

  // Load directory skills once when dialog opens or on mount
  React.useEffect(() => {
    async function loadCatalog() {
      setLoadingDirectory(true);
      try {
        const res = await fetch("/api/v1/skills");
        if (res.ok) {
          const data = await res.json();
          setDirectorySkills(data.skills || []);
          setCategories(["All", ...(data.categories || [])]);
          if (data.skills && data.skills.length > 0 && !selectedSkillId) {
            setSelectedSkillId(data.skills[0].id);
          }
        }
      } catch (err) {
        console.warn("Could not load skills catalog:", err);
      } finally {
        setLoadingDirectory(false);
      }
    }
    loadCatalog();
  }, []);

  const openAddDialog = (type: SkillPairType) => {
    setSelectedType(type);
    setErrorMsg(null);
    setSearchQuery("");
    setSelectedCategory("All");

    // Pre-select first un-added skill if available
    const existingIds = new Set(
      (type === "TEACH" ? teachSkills : learnSkills).map((s) => s.skillId)
    );
    const available = directorySkills.find((s) => !existingIds.has(s.id));
    if (available) {
      setSelectedSkillId(available.id);
    } else if (directorySkills.length > 0) {
      setSelectedSkillId(directorySkills[0].id);
    }

    setDialogOpen(true);
  };

  // Check if chosen skill + type combination is already added
  const isDuplicate = React.useMemo(() => {
    if (!selectedSkillId) return false;
    const targetList = selectedType === "TEACH" ? teachSkills : learnSkills;
    return targetList.some((s) => s.skillId === selectedSkillId);
  }, [selectedSkillId, selectedType, teachSkills, learnSkills]);

  // Filtered skills in the catalog
  const filteredSkills = React.useMemo(() => {
    return directorySkills.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || s.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [directorySkills, searchQuery, selectedCategory]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) {
      setErrorMsg("Please select a skill.");
      return;
    }

    if (isDuplicate) {
      setErrorMsg(`You have already added this skill to your ${selectedType.toLowerCase()} list.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/profile/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: selectedSkillId,
          type: selectedType,
          proficiencyLevel: selectedProficiency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add skill.");
      }

      const created: StudentSkillResponse = data.studentSkill;

      if (created.type === "TEACH") {
        setTeachSkills((prev) => [created, ...prev]);
      } else {
        setLearnSkills((prev) => [created, ...prev]);
      }

      setSuccessMsg(`"${created.skill.name}" added to your ${created.type.toLowerCase()} skills!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setDialogOpen(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to add skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProficiencyChange = async (skillItem: StudentSkillResponse, newLevel: SkillLevel) => {
    if (skillItem.proficiencyLevel === newLevel) return;

    setActiveActionId(skillItem.id);
    try {
      const res = await fetch(`/api/v1/profile/skills/${skillItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proficiencyLevel: newLevel }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update proficiency.");
      }

      const updater = (prev: StudentSkillResponse[]) =>
        prev.map((s) => (s.id === skillItem.id ? { ...s, proficiencyLevel: newLevel } : s));

      if (skillItem.type === "TEACH") {
        setTeachSkills(updater);
      } else {
        setLearnSkills(updater);
      }

      setSuccessMsg(`Proficiency for ${skillItem.skill.name} updated to ${newLevel}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating proficiency.");
    } finally {
      setActiveActionId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;

    setActiveActionId(skillToDelete.id);
    try {
      const res = await fetch(`/api/v1/profile/skills/${skillToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove skill.");
      }

      const remover = (prev: StudentSkillResponse[]) =>
        prev.filter((s) => s.id !== skillToDelete.id);

      if (skillToDelete.type === "TEACH") {
        setTeachSkills(remover);
      } else {
        setLearnSkills(remover);
      }

      setSuccessMsg(`Removed "${skillToDelete.skill.name}" from your skills.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setSkillToDelete(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error removing skill.");
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <div className="space-y-8">
      {successMsg && (
        <Alert variant="success">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ===================== SECTION 1: SKILLS I CAN TEACH ===================== */}
        <Card className="border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Skills I Can Teach
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Subjects and technologies you can help peers understand.
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openAddDialog("TEACH")}
              className="flex items-center gap-1.5 shadow-sm text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-5 space-y-3">
            {teachSkills.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">No teaching skills listed yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Add technologies or subjects you excel at so fellow students can request peer help.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAddDialog("TEACH")}
                  className="mt-4 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Teaching Skill
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {teachSkills.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {item.skill.name}
                        </span>
                        <Badge
                          variant={PROFICIENCY_CONFIG[item.proficiencyLevel].badgeVariant}
                          className="text-[10px] font-semibold uppercase tracking-wider"
                        >
                          {PROFICIENCY_CONFIG[item.proficiencyLevel].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{item.skill.category}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Proficiency Level Dropdown Selector */}
                      <label htmlFor={`teach-prof-${item.id}`} className="sr-only">
                        Proficiency for {item.skill.name}
                      </label>
                      <select
                        id={`teach-prof-${item.id}`}
                        value={item.proficiencyLevel}
                        disabled={activeActionId === item.id}
                        onChange={(e) =>
                          handleProficiencyChange(item, e.target.value as SkillLevel)
                        }
                        className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-md px-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:opacity-50"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => setSkillToDelete(item)}
                        disabled={activeActionId === item.id}
                        aria-label={`Remove ${item.skill.name} from teach skills`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===================== SECTION 2: SKILLS I WANT TO LEARN ===================== */}
        <Card className="border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Skills I Want To Learn
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Topics you want to master through peer learning and study.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAddDialog("LEARN")}
              className="flex items-center gap-1.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-5 space-y-3">
            {learnSkills.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">No learning goals listed yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Add programming languages or concepts you are excited to learn.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAddDialog("LEARN")}
                  className="mt-4 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Learning Skill
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {learnSkills.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {item.skill.name}
                        </span>
                        <Badge
                          variant={PROFICIENCY_CONFIG[item.proficiencyLevel].badgeVariant}
                          className="text-[10px] font-semibold uppercase tracking-wider"
                        >
                          {PROFICIENCY_CONFIG[item.proficiencyLevel].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{item.skill.category}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Proficiency Level Dropdown Selector */}
                      <label htmlFor={`learn-prof-${item.id}`} className="sr-only">
                        Proficiency for {item.skill.name}
                      </label>
                      <select
                        id={`learn-prof-${item.id}`}
                        value={item.proficiencyLevel}
                        disabled={activeActionId === item.id}
                        onChange={(e) =>
                          handleProficiencyChange(item, e.target.value as SkillLevel)
                        }
                        className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-md px-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:opacity-50"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => setSkillToDelete(item)}
                        disabled={activeActionId === item.id}
                        aria-label={`Remove ${item.skill.name} from learn skills`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===================== ADD SKILL DIALOG ===================== */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={selectedType === "TEACH" ? "Add Skill You Can Teach" : "Add Skill You Want To Learn"}
        description="Select a skill from the directory and specify your current proficiency level."
      >
        <form onSubmit={handleAddSkill} className="space-y-5">
          {errorMsg && (
            <Alert variant="danger">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            </Alert>
          )}

          {/* Skill Type Segmented Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Skill Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedType("TEACH")}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  selectedType === "TEACH"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                I Can Teach This
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("LEARN")}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  selectedType === "LEARN"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                I Want To Learn
              </button>
            </div>
          </div>

          {/* Search & Filter within directory */}
          <div className="space-y-2">
            <label htmlFor="catalog-search" className="block text-xs font-semibold text-slate-700">
              Find Skill in Directory
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="catalog-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill name or category..."
                className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Category filter pills */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Skill Selector List */}
          <div className="space-y-1.5">
            <label htmlFor="skill-select" className="block text-xs font-semibold text-slate-700">
              Select Skill
            </label>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
              {loadingDirectory ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-blue-600" />
                  Loading directory skills...
                </div>
              ) : filteredSkills.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No skills matched your search.
                </div>
              ) : (
                filteredSkills.map((s) => {
                  const isSelected = selectedSkillId === s.id;
                  const alreadyAdded = (
                    selectedType === "TEACH" ? teachSkills : learnSkills
                  ).some((existing) => existing.skillId === s.id);

                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => setSelectedSkillId(s.id)}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? "bg-blue-50/80 text-blue-900 font-semibold"
                          : alreadyAdded
                          ? "opacity-50 cursor-not-allowed bg-slate-50"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{s.name}</span>
                        <span className="text-[11px] text-slate-500 ml-2">({s.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {alreadyAdded && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            Already added
                          </span>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Proficiency Level Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Your Proficiency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as SkillLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedProficiency(level)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    selectedProficiency === level
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {PROFICIENCY_CONFIG[level].label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">
              {selectedProficiency === "BEGINNER" && "Familiar with fundamentals, syntax, and basic exercises."}
              {selectedProficiency === "INTERMEDIATE" && "Comfortable building real projects and debugging issues."}
              {selectedProficiency === "ADVANCED" && "Deep conceptual mastery, architectural insight, and best practices."}
            </p>
          </div>

          {isDuplicate && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                You already have this skill in your {selectedType.toLowerCase()} list. You can change its proficiency level directly from your profile list.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || isDuplicate || !selectedSkillId}
              className="flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Skill
                </>
              )}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ===================== DELETE CONFIRMATION DIALOG ===================== */}
      <Dialog
        isOpen={Boolean(skillToDelete)}
        onClose={() => setSkillToDelete(null)}
        title="Remove Skill?"
        description="Are you sure you want to remove this skill from your profile? This cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You are removing{" "}
            <strong className="text-slate-900 font-semibold">{skillToDelete?.skill.name}</strong>{" "}
            from your <span className="font-semibold lowercase">{skillToDelete?.type}</span> skills list.
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSkillToDelete(null)}
              disabled={activeActionId === skillToDelete?.id}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={activeActionId === skillToDelete?.id}
              className="flex items-center gap-1.5"
            >
              {activeActionId === skillToDelete?.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Removal
                </>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
