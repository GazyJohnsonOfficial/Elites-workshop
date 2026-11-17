"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  Check,
  CheckCircle2,
  Cloud,
  Cpu,
  Database,
  Layers,
  List,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  ACADEMY_CATEGORIES,
  DELIVERY_MODES,
  getCourseUpcomingCohorts,
  getTodayUtcIsoKey,
  type AcademyCategory,
  type Cohort,
  type Course,
  type CourseCompletionSummary,
} from "@/lib/academyStore";

export type CourseSortOption = "newest" | "duration" | "alphabetical";
export type CatalogViewMode = "cards" | "list";

const DELIVERY_FORMATS = ["all", ...DELIVERY_MODES] as const;
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

interface FilterPredicateOptions {
  category: string;
  pinnedCourseId: string;
  mode: string;
  difficulties: string[];
  toolchains: string[];
  query: string;
}

function matchesCourseQuery(course: Course, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    course.title,
    course.subtitle,
    course.description,
    course.category,
    ...course.tools,
    ...course.roles,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function matchesCourseFacets(course: Course, opts: FilterPredicateOptions): boolean {
  if (opts.pinnedCourseId && course.id !== opts.pinnedCourseId) return false;
  if (opts.category !== "all" && course.category !== opts.category) return false;
  if (opts.mode !== "all" && course.deliveryMode !== opts.mode) return false;
  if (opts.difficulties.length > 0 && !opts.difficulties.includes(course.level)) {
    return false;
  }
  if (
    opts.toolchains.length > 0 &&
    !course.tools.some((tool) => opts.toolchains.includes(tool))
  ) {
    return false;
  }
  return matchesCourseQuery(course, opts.query);
}

function ProgramIcon({ category }: { category: AcademyCategory }) {
  if (category === "Data & BI") return <Database size={15} aria-hidden="true" />;
  if (category === "Cloud & DevOps") return <Cloud size={15} aria-hidden="true" />;
  if (category === "Cybersecurity") return <ShieldCheck size={15} aria-hidden="true" />;
  return <Cpu size={15} aria-hidden="true" />;
}

function CourseProgressBlock({
  course,
  progress,
  mounted,
}: {
  course: Course;
  progress: CourseCompletionSummary;
  mounted: boolean;
}) {
  const isCourseComplete = progress.completionPct >= 100;
  const orderedModules = [...course.modules].sort((a, b) => a.order - b.order);
  const completedModuleSet = new Set(progress.completedModuleIds);

  return (
    <div
      className={`acad-card-progress ${isCourseComplete ? "is-complete" : ""}`}
      data-testid={`course-progress-${course.id}`}
    >
      <div className="acad-card-progress-head">
        <span className="acad-card-progress-state">
          {isCourseComplete ? (
            <CheckCircle2 size={14} aria-hidden="true" />
          ) : (
            <BookOpen size={14} aria-hidden="true" />
          )}
          <span>{isCourseComplete ? "Course Completed" : "Enrolled Progress"}</span>
        </span>
        <span className="acad-card-progress-metric acad-mono">
          <strong>{progress.completionPct}%</strong>
          <span aria-hidden="true">·</span>
          <span>
            {progress.completedCount}/{progress.totalModules} modules
          </span>
        </span>
      </div>

      <div
        className="acad-card-progress-track"
        role="progressbar"
        aria-label={`${course.title} completion progress`}
        aria-valuenow={progress.completionPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="acad-card-progress-fill"
          style={{ width: mounted ? `${progress.completionPct}%` : "0%" }}
        />
      </div>

      {orderedModules.length > 0 && (
        <div className="acad-card-progress-segments" aria-hidden="true">
          {orderedModules.map((mod) => {
            const isDone = completedModuleSet.has(mod.id);
            const isNext = !isDone && progress.nextModuleOrder === mod.order;
            return (
              <span
                key={mod.id}
                title={`Module ${mod.order}: ${mod.title}${
                  isDone ? " (Completed)" : isNext ? " (Next up)" : ""
                }`}
                className={`acad-card-progress-seg ${
                  isDone ? "done" : isNext ? "next" : "todo"
                }`}
              />
            );
          })}
        </div>
      )}

      <div className="acad-card-progress-foot">
        <span className="acad-card-progress-next">
          {isCourseComplete
            ? progress.certificateCode
              ? `Credential ${progress.certificateCode}`
              : "All curriculum modules complete"
            : progress.nextModuleTitle
            ? `Next: Mod ${progress.nextModuleOrder} · ${progress.nextModuleTitle}`
            : "Continue curriculum modules"}
        </span>
        <Link href="/academy/learn" className="acad-card-progress-link">
          <span>{isCourseComplete ? "Certificate" : "Resume"}</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function CourseActionFooter({
  course,
  nextCohort,
  isEnrollable,
  className = "acad-prog-footer",
  extraCompareButton,
}: {
  course: Course;
  nextCohort: Cohort | undefined;
  isEnrollable: boolean;
  className?: string;
  extraCompareButton?: React.ReactNode;
}) {
  const enrollHref = nextCohort
    ? `/academy/tuition?course=${course.id}&cohort=${nextCohort.id}`
    : `/academy/tuition?course=${course.id}`;

  return (
    <div className={className}>
      <div className="acad-prog-actions">
        {extraCompareButton}
        <Link
          href={`/academy/courses/${course.slug}`}
          className="btn btn-outline btn-sm"
        >
          View Program
        </Link>
        {isEnrollable ? (
          <Link href={enrollHref} className="btn btn-navy btn-sm">
            <span>Enroll</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        ) : (
          <Link
            href={`/academy/courses/${course.slug}`}
            className="btn btn-outline btn-sm"
            style={{ color: "var(--danger)", borderColor: "#f3c5c0" }}
          >
            Closed
          </Link>
        )}
      </div>
    </div>
  );
}

export function CourseCatalogSection({
  courses,
  cohorts,
  progressByCourseId,
  selectedCategory,
  onSelectCategory,
  compareIds,
  onToggleCompare,
  mounted,
  comparisonSlot,
}: {
  courses: Course[];
  cohorts: Cohort[];
  progressByCourseId: Record<string, CourseCompletionSummary>;
  selectedCategory: string;
  onSelectCategory: (category: "all" | AcademyCategory) => void;
  compareIds: string[];
  onToggleCompare: (courseId: string) => void;
  mounted: boolean;
  comparisonSlot?: React.ReactNode;
}) {
  const [pinnedCourseId, setPinnedCourseId] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedToolchains, setSelectedToolchains] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<CourseSortOption>("newest");
  const [query, setQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<CatalogViewMode>("cards");

  useEffect(() => {
    const initialQ = new URLSearchParams(window.location.search).get("q");
    if (initialQ && initialQ.trim()) {
      setQuery(initialQ.trim());
    }
    const handleHeaderSearch = (event: Event) => {
      const detail = (event as CustomEvent<{ query?: string }>).detail;
      const nextQuery = detail?.query?.trim() || "";
      setQuery(nextQuery);
      onSelectCategory("all");
    };
    window.addEventListener("ets-academy-catalog-search", handleHeaderSearch);
    return () => {
      window.removeEventListener("ets-academy-catalog-search", handleHeaderSearch);
    };
  }, [onSelectCategory]);

  const todayKey = useMemo(() => getTodayUtcIsoKey(), []);

  const coursesByProgram = useMemo(
    () =>
      ACADEMY_CATEGORIES.map((program) => ({
        program,
        items: courses.filter((c) => c.category === program),
      })),
    [courses]
  );

  const availableToolchains = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => c.tools.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [courses]);

  const toggleDifficulty = (level: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleToolchain = (tool: string) => {
    setSelectedToolchains((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const selectProgram = (program: "all" | AcademyCategory) => {
    setPinnedCourseId("");
    onSelectCategory(selectedCategory === program && program !== "all" ? "all" : program);
  };

  const selectSingleCourse = (course: Course) => {
    if (pinnedCourseId === course.id) {
      setPinnedCourseId("");
      return;
    }
    setPinnedCourseId(course.id);
    if (selectedCategory !== course.category) {
      onSelectCategory(course.category);
    }
  };

  const filteredCourses = useMemo(() => {
    const matched = courses.filter((c) =>
      matchesCourseFacets(c, {
        category: selectedCategory,
        pinnedCourseId,
        mode: selectedMode,
        difficulties: selectedDifficulties,
        toolchains: selectedToolchains,
        query,
      })
    );

    const getCourseTimestamp = (course: Course) => {
      if (course.createdAt) {
        const parsed = Date.parse(course.createdAt);
        if (!Number.isNaN(parsed)) return parsed;
      }
      const cohortDates = cohorts
        .filter((coh) => coh.courseId === course.id)
        .map((coh) => Date.parse(coh.startDateIso))
        .filter((ms) => !Number.isNaN(ms));
      return cohortDates.length > 0 ? Math.max(...cohortDates) : 0;
    };

    return [...matched].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "duration") {
        if (a.durationWeeks !== b.durationWeeks) {
          return a.durationWeeks - b.durationWeeks;
        }
        if (a.sessionCount !== b.sessionCount) {
          return a.sessionCount - b.sessionCount;
        }
        return a.title.localeCompare(b.title);
      }
      const timeDiff = getCourseTimestamp(b) - getCourseTimestamp(a);
      if (timeDiff !== 0) return timeDiff;
      return a.title.localeCompare(b.title);
    });
  }, [
    courses,
    cohorts,
    selectedCategory,
    pinnedCourseId,
    selectedMode,
    selectedDifficulties,
    selectedToolchains,
    sortBy,
    query,
  ]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (pinnedCourseId ? 1 : 0) +
    (selectedMode !== "all" ? 1 : 0) +
    selectedDifficulties.length +
    selectedToolchains.length +
    (query.trim().length > 0 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;
  const pinnedCourse = courses.find((c) => c.id === pinnedCourseId);

  const resetCatalogFilters = () => {
    onSelectCategory("all");
    setPinnedCourseId("");
    setSelectedMode("all");
    setSelectedDifficulties([]);
    setSelectedToolchains([]);
    setSortBy("newest");
    setQuery("");
  };

  const courseEntries = useMemo(
    () =>
      filteredCourses.map((course) => {
        const upcomingCohorts = getCourseUpcomingCohorts(course, cohorts, todayKey);
        const nextCohort =
          upcomingCohorts[0] ||
          cohorts.find((c) => c.courseId === course.id && c.status !== "completed") ||
          cohorts.find((c) => c.courseId === course.id);
        const isEnrollable = upcomingCohorts.length > 0;
        const isCompared = compareIds.includes(course.id);
        const compareLimitReached = !isCompared && compareIds.length >= 3;
        const progress = progressByCourseId[course.id];
        return {
          course,
          nextCohort,
          isEnrollable,
          isCompared,
          compareLimitReached,
          progress,
        };
      }),
    [filteredCourses, cohorts, todayKey, compareIds, progressByCourseId]
  );

  return (
    <section className="acad-section acad-cat-section" id="catalog">
      <div className="container">
        {/* ============ ARCHITECTURAL CATALOG HEADER ============ */}
        <div className="acad-cat-header">
          <div className="acad-cat-header-copy">
            <span className="acad-cat-eyebrow">Curriculum Index · Practitioner Tracks</span>
            <h2>Engineering Programs &amp; Curriculum Catalog</h2>
            <p>
              Browse courses grouped into their respective engineering programs, filter by delivery mode or skill level, compare tracks side-by-side, and start enrollment.
            </p>
          </div>
        </div>

        {/* ============ TWO-COLUMN FLEXBOX SIDEBAR + STAGE ============ */}
        <div className="acad-cat-shell">
          {/* Left Sticky Program Directory & Facet Sidebar */}
          <aside
            className={`acad-cat-sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}
            aria-label="Program directory and course filters"
          >
            <div className="acad-sb-head">
              <div className="acad-sb-title">
                <SlidersHorizontal size={16} aria-hidden="true" />
                <span>Programs &amp; Filters</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetCatalogFilters}
                    className="acad-sb-reset"
                    title="Clear all active filters"
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="acad-sb-mobile-close"
                  aria-label="Close program filter sidebar"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Group 1: Courses Organized Under Respective Programs */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">Programs &amp; Courses</div>

              <button
                type="button"
                onClick={() => selectProgram("all")}
                className={`acad-sb-all-btn ${
                  selectedCategory === "all" && !pinnedCourseId ? "active" : ""
                }`}
              >
                <Layers size={14} aria-hidden="true" />
                <span>All Academy Programs</span>
              </button>

              <div className="acad-sb-programs" role="tree" aria-label="Courses grouped by program">
                {coursesByProgram.map(({ program, items }) => {
                  const programActive = selectedCategory === program && !pinnedCourseId;
                  const programContainsPinned =
                    Boolean(pinnedCourseId) && items.some((item) => item.id === pinnedCourseId);
                  return (
                    <div
                      key={program}
                      className={`acad-sb-program-group ${
                        programActive || programContainsPinned ? "active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectProgram(program)}
                        aria-pressed={programActive}
                        className={`acad-sb-program-btn ${programActive ? "active" : ""}`}
                      >
                        <span className="acad-sb-program-icon">
                          <ProgramIcon category={program} />
                        </span>
                        <span className="acad-sb-program-name">{program}</span>
                      </button>

                      {items.length > 0 && (
                        <div className="acad-sb-course-tree">
                          {items.map((item) => {
                            const courseActive = pinnedCourseId === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => selectSingleCourse(item)}
                                aria-pressed={courseActive}
                                className={`acad-sb-course-btn ${courseActive ? "active" : ""}`}
                                title={`${item.title} (${item.durationWeeks} weeks)`}
                              >
                                <span className="acad-sb-course-dot" aria-hidden="true" />
                                <span className="acad-sb-course-name">{item.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Group 2: Delivery Format */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">Delivery Format</div>
              <div className="acad-sb-pills" role="radiogroup" aria-label="Filter by delivery format">
                {DELIVERY_FORMATS.map((mode) => {
                  const active = selectedMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() =>
                        setSelectedMode((prev) =>
                          prev === mode && mode !== "all" ? "all" : mode
                        )
                      }
                      className={`acad-cat-facet-chip ${active ? "active" : ""}`}
                    >
                      <span>{mode === "all" ? "All Formats" : mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 3: Skill Level */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">Skill Level</div>
              <div className="acad-sb-pills" role="group" aria-label="Filter by skill level">
                {SKILL_LEVELS.map((level) => {
                  const checked = selectedDifficulties.includes(level);
                  return (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleDifficulty(level)}
                      className={`acad-cat-facet-chip ${checked ? "active" : ""}`}
                    >
                      {checked && <Check size={12} strokeWidth={2.8} aria-hidden="true" />}
                      <span>{level}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 4: Technical Stack */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">Toolchain Stack</div>
              <div className="acad-sb-pills acad-sb-tools-scroll" role="group" aria-label="Filter by toolchain">
                {availableToolchains.map((tool) => {
                  const checked = selectedToolchains.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleToolchain(tool)}
                      className={`acad-cat-facet-chip acad-mono ${checked ? "active" : ""}`}
                    >
                      {checked && <Check size={11} strokeWidth={2.8} aria-hidden="true" />}
                      <span>{tool}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Main Catalog Stage */}
          <div className="acad-cat-stage">
            {/* Compact Search + Sort + View Mode Bar */}
            <div className="acad-cat-studio">
              <div className="acad-cat-dock">
                <div className="acad-search-wrap acad-cat-search">
                  <Search size={16} aria-hidden="true" />
                  <input
                    id="acad-catalog-search"
                    name="q"
                    type="search"
                    className="acad-input"
                    placeholder="Search SQL, AWS, Terraform, Kubernetes, role, or course..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search courses"
                  />
                  {query.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="acad-cat-search-clear"
                      aria-label="Clear search query"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="acad-cat-dock-actions">
                  <div className="acad-sort-wrap">
                    <label htmlFor="acad-sort-select" className="acad-sort-label">
                      <ArrowUpDown size={14} aria-hidden="true" />
                      <span>Sort</span>
                    </label>
                    <select
                      id="acad-sort-select"
                      className="acad-select acad-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as CourseSortOption)}
                      aria-label="Sort courses by"
                    >
                      <option value="newest">Newest</option>
                      <option value="duration">Duration</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen((prev) => !prev)}
                    className={`acad-cat-mobile-btn ${
                      mobileSidebarOpen || hasActiveFilters ? "active" : ""
                    }`}
                    aria-expanded={mobileSidebarOpen}
                  >
                    <SlidersHorizontal size={14} aria-hidden="true" />
                    <span>Programs &amp; Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="acad-cat-refine-badge acad-mono">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <div className="acad-cat-view-switch" role="group" aria-label="Catalog view mode">
                    <button
                      type="button"
                      onClick={() => setViewMode("cards")}
                      className={`acad-cat-view-btn ${viewMode === "cards" ? "active" : ""}`}
                      aria-pressed={viewMode === "cards"}
                      title="Card specification view"
                    >
                      <Layers size={14} aria-hidden="true" />
                      <span>Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`acad-cat-view-btn ${viewMode === "list" ? "active" : ""}`}
                      aria-pressed={viewMode === "list"}
                      title="Compact index rows"
                    >
                      <List size={14} aria-hidden="true" />
                      <span>Index</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dismissible Active Filter Chips */}
              {hasActiveFilters && (
                <div className="acad-cat-active-strip" aria-label="Active catalog filters">
                  <span className="acad-cat-active-title">Active:</span>
                  <div className="acad-cat-active-chips">
                    {selectedCategory !== "all" && (
                      <button
                        type="button"
                        onClick={() => {
                          setPinnedCourseId("");
                          onSelectCategory("all");
                        }}
                        className="acad-cat-active-chip"
                      >
                        <span>Program: {selectedCategory}</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    )}
                    {pinnedCourse && (
                      <button
                        type="button"
                        onClick={() => setPinnedCourseId("")}
                        className="acad-cat-active-chip"
                      >
                        <span>Course: {pinnedCourse.title}</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    )}
                    {selectedMode !== "all" && (
                      <button
                        type="button"
                        onClick={() => setSelectedMode("all")}
                        className="acad-cat-active-chip"
                      >
                        <span>Format: {selectedMode}</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    )}
                    {selectedDifficulties.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => toggleDifficulty(level)}
                        className="acad-cat-active-chip"
                      >
                        <span>{level}</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    ))}
                    {selectedToolchains.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleToolchain(tool)}
                        className="acad-cat-active-chip acad-mono"
                      >
                        <span>{tool}</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    ))}
                    {query.trim() && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="acad-cat-active-chip"
                      >
                        <span>&ldquo;{query.trim()}&rdquo;</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={resetCatalogFilters}
                    className="acad-cat-clear-all"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* ============ PROGRAM RESULTS (FLEXBOX ARCHITECTURAL SURFACE) ============ */}
            {filteredCourses.length === 0 ? (
              <div className="acad-cat-empty">
                <h3>No engineering programs match these filters</h3>
                <p>
                  Clear a program constraint, expand delivery format, or reset catalog filters to view all active Academy curricula.
                </p>
                <button
                  type="button"
                  className="btn btn-navy btn-sm"
                  onClick={resetCatalogFilters}
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : viewMode === "list" ? (
              <div className="acad-prog-index">
                <AnimatePresence mode="popLayout">
                  {courseEntries.map(
                    (
                      {
                        course,
                        nextCohort,
                        isEnrollable,
                        isCompared,
                        compareLimitReached,
                        progress,
                      },
                      idx
                    ) => (
                      <motion.article
                        layout
                        key={course.id}
                        className={`acad-prog-row ${isCompared ? "comparing" : ""}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{
                          duration: 0.22,
                          delay: Math.min(idx * 0.025, 0.14),
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <div className="acad-prog-row-thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.heroImage}
                            alt={course.title}
                            width={360}
                            height={220}
                            referrerPolicy="no-referrer"
                          />
                          <span className="acad-prog-row-cat acad-mono">{course.category}</span>
                        </div>

                        <div className="acad-prog-row-main">
                          <div className="acad-prog-row-top">
                            <div>
                              <h3>
                                <Link href={`/academy/courses/${course.slug}`}>
                                  {course.title}
                                </Link>
                              </h3>
                              <p className="acad-prog-row-sub">{course.subtitle}</p>
                            </div>
                          </div>

                          {progress && (
                            <CourseProgressBlock
                              course={course}
                              progress={progress}
                              mounted={mounted}
                            />
                          )}

                          <div className="acad-prog-specs acad-prog-specs-row">
                            <div className="acad-prog-spec">
                              <small>Curriculum</small>
                              <strong>
                                {course.durationWeeks} Weeks · {course.modules.length} Modules
                              </strong>
                            </div>
                            <div className="acad-prog-spec-div" aria-hidden="true" />
                            <div className="acad-prog-spec">
                              <small>Format &amp; Tier</small>
                              <strong>
                                {course.level} · {course.deliveryMode}
                              </strong>
                            </div>
                          </div>

                          <div className="acad-prog-tools">
                            {course.tools.slice(0, 6).map((tool) => {
                              const toolActive = selectedToolchains.includes(tool);
                              return (
                                <button
                                  key={tool}
                                  type="button"
                                  onClick={() => toggleToolchain(tool)}
                                  className={`acad-prog-tool-btn acad-mono ${
                                    toolActive ? "active" : ""
                                  }`}
                                  title={`Filter catalog by ${tool}`}
                                >
                                  {tool}
                                </button>
                              );
                            })}
                            {course.tools.length > 6 && (
                              <span className="acad-prog-tool-more acad-mono">
                                +{course.tools.length - 6}
                              </span>
                            )}
                          </div>
                        </div>

                        <CourseActionFooter
                          course={course}
                          nextCohort={nextCohort}
                          isEnrollable={isEnrollable}
                          className="acad-prog-row-cta"
                          extraCompareButton={
                            <button
                              type="button"
                              onClick={() => onToggleCompare(course.id)}
                              disabled={compareLimitReached}
                              aria-pressed={isCompared}
                              className={`acad-compare-card-btn ${isCompared ? "active" : ""}`}
                            >
                              {isCompared ? (
                                <Check size={13} strokeWidth={2.5} />
                              ) : (
                                <Scale size={13} />
                              )}
                              <span>
                                {isCompared
                                  ? "Comparing"
                                  : compareLimitReached
                                  ? "Max 3"
                                  : "Compare"}
                              </span>
                            </button>
                          }
                        />
                      </motion.article>
                    )
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="acad-prog-flex">
                <AnimatePresence mode="popLayout">
                  {courseEntries.map(
                    (
                      {
                        course,
                        nextCohort,
                        isEnrollable,
                        isCompared,
                        compareLimitReached,
                        progress,
                      },
                      idx
                    ) => (
                      <motion.article
                        layout
                        key={course.id}
                        className={`acad-prog-card ${isCompared ? "comparing" : ""}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                          duration: 0.24,
                          delay: Math.min(idx * 0.03, 0.15),
                          ease: [0.16, 1, 0.3, 1],
                          layout: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                        }}
                      >
                        {/* Top Media Band with Frosted Metadata Overlay */}
                        <div className="acad-prog-media">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.heroImage}
                            alt={course.title}
                            width={640}
                            height={360}
                            referrerPolicy="no-referrer"
                            className="acad-prog-thumb"
                          />
                          <div className="acad-prog-media-scrim" aria-hidden="true" />

                          <div className="acad-prog-media-top">
                            <span className="acad-prog-domain-pill acad-mono">
                              {course.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => onToggleCompare(course.id)}
                              disabled={compareLimitReached}
                              aria-pressed={isCompared}
                              title={
                                compareLimitReached
                                  ? "Maximum of 3 courses selected for comparison"
                                  : isCompared
                                  ? "Remove from side-by-side comparison"
                                  : "Add to side-by-side comparison (up to 3)"
                              }
                              className={`acad-prog-compare-pill ${isCompared ? "active" : ""}`}
                            >
                              {isCompared ? (
                                <Check size={12} strokeWidth={2.5} />
                              ) : (
                                <Scale size={12} />
                              )}
                              <span>
                                {isCompared
                                  ? "Comparing"
                                  : compareLimitReached
                                  ? "Max 3"
                                  : "Compare"}
                              </span>
                            </button>
                          </div>

                          <div className="acad-prog-media-bottom">
                            <span className="acad-prog-session-pill acad-mono">
                              {course.modules.length} Modules · {course.sessionCount} Sessions
                            </span>
                          </div>
                        </div>

                        {/* Main Specification Body */}
                        <div className="acad-prog-body">
                          <div className="acad-prog-heading-block">
                            <h3>
                              <Link href={`/academy/courses/${course.slug}`}>
                                {course.title}
                              </Link>
                            </h3>
                            <p className="acad-prog-sub">{course.subtitle}</p>
                          </div>

                          {progress && (
                            <CourseProgressBlock
                              course={course}
                              progress={progress}
                              mounted={mounted}
                            />
                          )}

                          {/* 2-Column Flexbox Specification Strip with Vertical Hairline */}
                          <div className="acad-prog-specs">
                            <div className="acad-prog-spec">
                              <small>Duration</small>
                              <strong>{course.durationWeeks} Weeks</strong>
                            </div>
                            <div className="acad-prog-spec-div" aria-hidden="true" />
                            <div className="acad-prog-spec">
                              <small>Level &amp; Mode</small>
                              <strong>
                                {course.level} · {course.deliveryMode}
                              </strong>
                            </div>
                          </div>

                          {/* Target Roles + Clickable Stack Pills */}
                          <div className="acad-prog-stack">
                            {course.roles.length > 0 && (
                              <div className="acad-prog-roles">
                                <span>Roles:</span> {course.roles.slice(0, 3).join(" · ")}
                              </div>
                            )}
                            <div className="acad-prog-tools">
                              {course.tools.slice(0, 5).map((tool) => {
                                const toolActive = selectedToolchains.includes(tool);
                                return (
                                  <button
                                    key={tool}
                                    type="button"
                                    onClick={() => toggleToolchain(tool)}
                                    className={`acad-prog-tool-btn acad-mono ${
                                      toolActive ? "active" : ""
                                    }`}
                                    title={`Filter catalog by ${tool}`}
                                  >
                                    {tool}
                                  </button>
                                );
                              })}
                              {course.tools.length > 5 && (
                                <span className="acad-prog-tool-more acad-mono">
                                  +{course.tools.length - 5}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Footer Action Dock */}
                          <CourseActionFooter
                            course={course}
                            nextCohort={nextCohort}
                            isEnrollable={isEnrollable}
                          />
                        </div>
                      </motion.article>
                    )
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {comparisonSlot}
      </div>
    </section>
  );
}
