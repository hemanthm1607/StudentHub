"use client";

import * as React from "react";
import { CourseCard } from "./CourseCard";
import type { CourseSummary } from "@/lib/services/course-service";
import type { SkillLevel } from "@prisma/client";
import { Search, BookOpen } from "lucide-react";

interface CourseCatalogProps {
  initialCourses: CourseSummary[];
}

export function CourseCatalog({ initialCourses }: CourseCatalogProps) {
  const [selectedLevel, setSelectedLevel] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return initialCourses.filter((course) => {
      const matchesLevel = selectedLevel === "ALL" || course.difficulty === selectedLevel;
      const matchesSearch =
        !searchQuery.trim() ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [initialCourses, selectedLevel, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Level Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter courses by name or technology..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Segmented Filter Buttons (Zero-pill discipline: bordered tab buttons) */}
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium text-slate-600">
          {(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((lvl) => {
            const isActive = selectedLevel === lvl;
            const label = lvl === "ALL" ? "All Levels" : lvl.charAt(0) + lvl.slice(1).toLowerCase();
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  isActive
                    ? "bg-white text-blue-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-slate-200 rounded-lg bg-white">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 mb-1">No courses match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No curriculum found matching "${searchQuery}". Try broadening your search or resetting level filters.`
              : "No courses currently available under this difficulty level."}
          </p>
          {(searchQuery || selectedLevel !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("ALL");
              }}
              className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
