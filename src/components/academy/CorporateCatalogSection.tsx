"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpDown,
  Building2,
  Check,
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
  formatCurrencyAmount,
  type AcademyCategory,
  type Course,
  type CurrencyCode,
} from "@/lib/academyStore";

type CorporateSortOption =
  | "bootcamps_first"
  | "duration"
  | "price_asc"
  | "alphabetical";

type CatalogViewMode = "cards" | "list";

const DELIVERY_FORMATS = ["all", ...DELIVERY_MODES] as const;
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

const SEAT_PACK_PRESETS = [
  { seats: 10, label: "5 to 14 Seats", plan: "Team Pack" },
  { seats: 15, label: "15 to 29 Seats", plan: "Private Cohort" },
  { seats: 30, label: "30+ Seats", plan: "Enterprise Pool" },
] as const;

function DomainIcon({ category }: { category: AcademyCategory }) {
  if (category === "Data & BI") return <Database size={15} aria-hidden="true" />;
  if (category === "Cloud & DevOps") return <Cloud size={15} aria-hidden="true" />;
  if (category === "Cybersecurity") return <ShieldCheck size={15} aria-hidden="true" />;
  return <Cpu size={15} aria-hidden="true" />;
}

export function CorporateCatalogSection({
  courses,
  currency,
  seatCount,
  onSeatCountChange,
  selectedCategory,
  onSelectCategory,
  selectedMode,
  onSelectMode,
}: {
  courses: Course[];
  currency: CurrencyCode;
  seatCount: number;
  onSeatCountChange: (seats: number) => void;
  selectedCategory: string;
  onSelectCategory: (category: "all" | AcademyCategory) => void;
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}) {
  const [pinnedCourseId, setPinnedCourseId] = useState<string>("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedToolchains, setSelectedToolchains] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<CorporateSortOption>("bootcamps_first");
  const [query, setQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<CatalogViewMode>("cards");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialQ = new URLSearchParams(window.location.search).get("q");
      if (initialQ && initialQ.trim()) {
        setQuery(initialQ.trim());
      }
    }
    const handleCorpSearch = (event: Event) => {
      const detail = (event as CustomEvent<{ query?: string }>).detail;
      setQuery(detail?.query?.trim() || "");
      onSelectCategory("all");
      onSelectMode("all");
      setPinnedCourseId("");
    };
    window.addEventListener("ets-corporate-catalog-search", handleCorpSearch);
    return () => {
      window.removeEventListener("ets-corporate-catalog-search", handleCorpSearch);
    };
  }, [onSelectCategory, onSelectMode]);

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

  const activePackLabel =
    seatCount >= 30
      ? "Enterprise Pool"
      : seatCount >= 15
      ? "Private Cohort"
      : "Team Pack";

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

  const toggleCompare = (courseId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(courseId)) return prev.filter((id) => id !== courseId);
      if (prev.length >= 3) return prev;
      return [...prev, courseId];
    });
  };

  const selectProgram = (program: "all" | AcademyCategory) => {
    setPinnedCourseId("");
    onSelectCategory(
      selectedCategory === program && program !== "all" ? "all" : program
    );
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
    const q = query.trim().toLowerCase();
    const matched = courses.filter((course) => {
      if (pinnedCourseId && course.id !== pinnedCourseId) return false;
      if (selectedCategory !== "all" && course.category !== selectedCategory)
        return false;
      if (selectedMode !== "all" && course.deliveryMode !== selectedMode)
        return false;
      if (
        selectedDifficulties.length > 0 &&
        !selectedDifficulties.includes(course.level)
      ) {
        return false;
      }
      if (
        selectedToolchains.length > 0 &&
        !course.tools.some((tool) => selectedToolchains.includes(tool))
      ) {
        return false;
      }
      if (!q) return true;
      const hay = [
        course.title,
        course.subtitle,
        course.description,
        course.category,
        course.deliveryMode,
        ...course.tools,
        ...course.roles,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    return [...matched].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "duration") {
        if (a.durationWeeks !== b.durationWeeks) {
          return a.durationWeeks - b.durationWeeks;
        }
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "price_asc") {
        if (a.tuitionUsd !== b.tuitionUsd) {
          return a.tuitionUsd - b.tuitionUsd;
        }
        return a.title.localeCompare(b.title);
      }
      const aBiz = a.audience === "business" ? 0 : 1;
      const bBiz = b.audience === "business" ? 0 : 1;
      if (aBiz !== bBiz) return aBiz - bBiz;
      return a.title.localeCompare(b.title);
    });
  }, [
    courses,
    pinnedCourseId,
    selectedCategory,
    selectedMode,
    selectedDifficulties,
    selectedToolchains,
    sortBy,
    query,
  ]);

  const comparedCourses = useMemo(
    () =>
      compareIds
        .map((id) => courses.find((c) => c.id === id))
        .filter((c): c is Course => Boolean(c)),
    [compareIds, courses]
  );

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (pinnedCourseId ? 1 : 0) +
    (selectedMode !== "all" ? 1 : 0) +
    selectedDifficulties.length +
    selectedToolchains.length +
    (query.trim().length > 0 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;
  const pinnedCourse = courses.find((c) => c.id === pinnedCourseId);

  const resetFilters = () => {
    onSelectCategory("all");
    onSelectMode("all");
    setPinnedCourseId("");
    setSelectedDifficulties([]);
    setSelectedToolchains([]);
    setSortBy("bootcamps_first");
    setQuery("");
  };

  return (
    <section
      className="acad-section acad-section-tint acad-cat-section"
      id="corporate-catalog"
    >
      <div className="container">
        <div className="acad-cat-header acad-biz-cat-head-row">
          <div className="acad-cat-header-copy">
            <span className="acad-cat-eyebrow">
              Enterprise Curriculum Directory · Multi-Seat Team Enrollment
            </span>
            <h2>Corporate Bootcamps &amp; Enterprise Programs</h2>
            <p>
              Filter dedicated team bootcamps and multi-seat engineering courses
              by department, delivery format, skill level, or toolchain, compare
              tracks side by side, and generate a formal Net-30 quote.
            </p>
          </div>
          <Link
            href={`/academy/tuition?mode=corporate&seats=${seatCount}`}
            className="btn btn-navy btn-sm"
          >
            <span>Open Full Seat Calculator</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* Two-Column Flexbox Enterprise Sidebar + Main Stage */}
        <div className="acad-cat-shell">
          <aside
            className={`acad-cat-sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}
            aria-label="Enterprise program filters"
          >
            <div className="acad-sb-head">
              <div className="acad-sb-title">
                <SlidersHorizontal size={16} aria-hidden="true" />
                <span>Business Filters</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="acad-sb-reset"
                    title="Clear all active business filters"
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="acad-sb-mobile-close"
                  aria-label="Close filter sidebar"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Team Size Pack Selector */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">
                Team Pack ({seatCount} Seats)
              </div>
              <div
                className="acad-biz-sb-tiers"
                role="radiogroup"
                aria-label="Select team pack size"
              >
                {SEAT_PACK_PRESETS.map((pack) => {
                  const active = activePackLabel === pack.plan;
                  return (
                    <button
                      key={pack.label}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => onSeatCountChange(pack.seats)}
                      className={`acad-biz-sb-tier-btn ${active ? "active" : ""}`}
                    >
                      <span>{pack.label}</span>
                      <strong>{pack.plan}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department & Course Tree */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">
                Departments &amp; Tracks
              </div>

              <button
                type="button"
                onClick={() => selectProgram("all")}
                className={`acad-sb-all-btn ${
                  selectedCategory === "all" && !pinnedCourseId ? "active" : ""
                }`}
              >
                <Layers size={14} aria-hidden="true" />
                <span>All Business Programs ({courses.length})</span>
              </button>

              <div
                className="acad-sb-programs"
                role="tree"
                aria-label="Business courses grouped by department"
              >
                {coursesByProgram.map(({ program, items }) => {
                  const programActive =
                    selectedCategory === program && !pinnedCourseId;
                  const programContainsPinned =
                    Boolean(pinnedCourseId) &&
                    items.some((item) => item.id === pinnedCourseId);
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
                        className={`acad-sb-program-btn ${
                          programActive ? "active" : ""
                        }`}
                      >
                        <span className="acad-sb-program-icon">
                          <DomainIcon category={program} />
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
                                className={`acad-sb-course-btn ${
                                  courseActive ? "active" : ""
                                }`}
                                title={`${item.title} (${item.durationWeeks} weeks)`}
                              >
                                <span
                                  className="acad-sb-course-dot"
                                  aria-hidden="true"
                                />
                                <span className="acad-sb-course-name">
                                  {item.title}
                                </span>
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

            {/* Delivery Format */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">Delivery Format</div>
              <div
                className="acad-sb-pills"
                role="radiogroup"
                aria-label="Filter by corporate delivery format"
              >
                {DELIVERY_FORMATS.map((mode) => {
                  const active = selectedMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() =>
                        onSelectMode(
                          selectedMode === mode && mode !== "all" ? "all" : mode
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

            {/* Skill Level */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">Team Proficiency</div>
              <div
                className="acad-sb-pills"
                role="group"
                aria-label="Filter by skill level"
              >
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
                      {checked && (
                        <Check size={12} strokeWidth={2.8} aria-hidden="true" />
                      )}
                      <span>{level}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toolchain Stack */}
            <div className="acad-sb-section">
              <div className="acad-sb-section-label">Enterprise Toolchain</div>
              <div
                className="acad-sb-pills acad-sb-tools-scroll"
                role="group"
                aria-label="Filter by enterprise toolchain"
              >
                {availableToolchains.map((tool) => {
                  const checked = selectedToolchains.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleToolchain(tool)}
                      className={`acad-cat-facet-chip acad-mono ${
                        checked ? "active" : ""
                      }`}
                    >
                      {checked && (
                        <Check size={11} strokeWidth={2.8} aria-hidden="true" />
                      )}
                      <span>{tool}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Right Enterprise Catalog Stage */}
          <div className="acad-cat-stage">
            <div className="acad-cat-studio">
              <div className="acad-cat-dock">
                <div className="acad-search-wrap acad-cat-search">
                  <Search size={16} aria-hidden="true" />
                  <input
                    id="acad-corp-catalog-search"
                    name="q"
                    type="search"
                    className="acad-input"
                    placeholder="Search Kubernetes, Executive BI, AWS, Terraform, Vault..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search corporate programs"
                  />
                  {query.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="acad-cat-search-clear"
                      aria-label="Clear corporate search query"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="acad-cat-dock-actions">
                  <div className="acad-sort-wrap">
                    <label
                      htmlFor="acad-corp-sort-select"
                      className="acad-sort-label"
                    >
                      <ArrowUpDown size={14} aria-hidden="true" />
                      <span>Sort</span>
                    </label>
                    <select
                      id="acad-corp-sort-select"
                      className="acad-select acad-sort-select"
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as CorporateSortOption)
                      }
                      aria-label="Sort corporate programs by"
                    >
                      <option value="bootcamps_first">Bootcamps First</option>
                      <option value="duration">Duration</option>
                      <option value="price_asc">Seat Rate (Low to High)</option>
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
                    <span>Business Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="acad-cat-refine-badge acad-mono">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <div
                    className="acad-cat-view-switch"
                    role="group"
                    aria-label="Enterprise catalog view mode"
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode("cards")}
                      className={`acad-cat-view-btn ${
                        viewMode === "cards" ? "active" : ""
                      }`}
                      aria-pressed={viewMode === "cards"}
                    >
                      <Layers size={14} aria-hidden="true" />
                      <span>Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`acad-cat-view-btn ${
                        viewMode === "list" ? "active" : ""
                      }`}
                      aria-pressed={viewMode === "list"}
                    >
                      <List size={14} aria-hidden="true" />
                      <span>Index</span>
                    </button>
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <div
                  className="acad-cat-active-strip"
                  aria-label="Active business catalog filters"
                >
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
                        <span>Department: {selectedCategory}</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    )}
                    {pinnedCourse && (
                      <button
                        type="button"
                        onClick={() => setPinnedCourseId("")}
                        className="acad-cat-active-chip"
                      >
                        <span>Track: {pinnedCourse.title}</span>
                        <X size={12} aria-hidden="true" />
                      </button>
                    )}
                    {selectedMode !== "all" && (
                      <button
                        type="button"
                        onClick={() => onSelectMode("all")}
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
                    onClick={resetFilters}
                    className="acad-cat-clear-all"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="acad-cat-empty">
                <h3>No corporate programs match these filters</h3>
                <p>
                  Clear a department filter, expand delivery format, or reset
                  business filters to inspect all team-ready tracks.
                </p>
                <button
                  type="button"
                  className="btn btn-navy btn-sm"
                  onClick={resetFilters}
                >
                  Reset Business Filters
                </button>
              </div>
            ) : viewMode === "list" ? (
              <div className="acad-prog-index">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, idx) => {
                    const isExclusive = course.audience === "business";
                    const isCompared = compareIds.includes(course.id);
                    const limitReached = !isCompared && compareIds.length >= 3;
                    return (
                      <motion.article
                        layout
                        key={course.id}
                        className={`acad-prog-row ${isCompared ? "comparing" : ""}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{
                          duration: 0.22,
                          delay: Math.min(idx * 0.025, 0.14),
                        }}
                      >
                        <div className="acad-prog-row-thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.heroImage}
                            alt={course.title}
                            width={360}
                            height={220}
                          />
                          <span
                            className={`acad-prog-row-cat ${
                              isExclusive ? "acad-biz-badge-gold" : ""
                            }`}
                          >
                            {isExclusive ? "Corporate Bootcamp" : course.category}
                          </span>
                        </div>

                        <div className="acad-prog-row-main">
                          <div className="acad-prog-row-top">
                            <div>
                              <h3>
                                <Link href={`/academy/courses/${course.slug}`}>
                                  {course.title}
                                </Link>
                              </h3>
                              <p className="acad-prog-row-sub">
                                {course.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="acad-prog-specs acad-prog-specs-row">
                            <div className="acad-prog-spec">
                              <small>Duration &amp; Format</small>
                              <strong>
                                {course.durationWeeks} Wks · {course.deliveryMode}
                              </strong>
                            </div>
                            <div className="acad-prog-spec-div" aria-hidden="true" />
                            <div className="acad-prog-spec">
                              <small>Level</small>
                              <strong>{course.level}</strong>
                            </div>
                          </div>

                          <div className="acad-prog-tools">
                            {course.tools.slice(0, 6).map((tool) => {
                              const toolActive =
                                selectedToolchains.includes(tool);
                              return (
                                <button
                                  key={tool}
                                  type="button"
                                  onClick={() => toggleToolchain(tool)}
                                  className={`acad-prog-tool-btn acad-mono ${
                                    toolActive ? "active" : ""
                                  }`}
                                >
                                  {tool}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="acad-prog-row-cta">
                          <div className="acad-prog-actions">
                            <button
                              type="button"
                              onClick={() => toggleCompare(course.id)}
                              disabled={limitReached}
                              aria-pressed={isCompared}
                              className={`acad-compare-card-btn ${
                                isCompared ? "active" : ""
                              }`}
                            >
                              {isCompared ? (
                                <Check size={13} strokeWidth={2.5} />
                              ) : (
                                <Scale size={13} />
                              )}
                              <span>
                                {isCompared
                                  ? "Comparing"
                                  : limitReached
                                  ? "Max 3"
                                  : "Compare"}
                              </span>
                            </button>
                            <Link
                              href={`/academy/courses/${course.slug}`}
                              className="btn btn-outline btn-sm"
                            >
                              Inspect Syllabus
                            </Link>
                            <Link
                              href={`/academy/tuition?mode=corporate&course=${encodeURIComponent(
                                course.id
                              )}&seats=${seatCount}`}
                              className="btn btn-navy btn-sm"
                            >
                              <span>Quote ({seatCount})</span>
                              <ArrowRight size={13} aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="acad-prog-flex">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, idx) => {
                    const isExclusive = course.audience === "business";
                    const isCompared = compareIds.includes(course.id);
                    const limitReached = !isCompared && compareIds.length >= 3;
                    return (
                      <motion.article
                        layout
                        key={course.id}
                        className={`acad-prog-card ${isCompared ? "comparing" : ""}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                          duration: 0.24,
                          delay: Math.min(idx * 0.03, 0.15),
                        }}
                      >
                        <div className="acad-prog-media">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.heroImage}
                            alt={course.title}
                            width={640}
                            height={360}
                            className="acad-prog-thumb"
                          />
                          <div
                            className="acad-prog-media-scrim"
                            aria-hidden="true"
                          />

                          <div className="acad-prog-media-top">
                            <span
                              className={`acad-prog-domain-pill ${
                                isExclusive ? "acad-biz-pill-gold" : ""
                              }`}
                            >
                              {isExclusive
                                ? "Corporate Bootcamp"
                                : `${course.category} · Team`}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleCompare(course.id)}
                              disabled={limitReached}
                              aria-pressed={isCompared}
                              className={`acad-prog-compare-pill ${
                                isCompared ? "active" : ""
                              }`}
                            >
                              {isCompared ? (
                                <Check size={12} strokeWidth={2.5} />
                              ) : (
                                <Scale size={12} />
                              )}
                              <span>
                                {isCompared
                                  ? "Comparing"
                                  : limitReached
                                  ? "Max 3"
                                  : "Compare"}
                              </span>
                            </button>
                          </div>

                          <div className="acad-prog-media-bottom">
                            <span className="acad-prog-session-pill acad-mono">
                              {course.modules.length} Modules ·{" "}
                              {course.sessionCount} Sessions
                            </span>
                          </div>
                        </div>

                        <div className="acad-prog-body">
                          <div className="acad-prog-heading-block">
                            <h3>
                              <Link href={`/academy/courses/${course.slug}`}>
                                {course.title}
                              </Link>
                            </h3>
                            <p className="acad-prog-sub">{course.subtitle}</p>
                          </div>

                          <div className="acad-prog-specs">
                            <div className="acad-prog-spec">
                              <small>Duration &amp; Format</small>
                              <strong>
                                {course.durationWeeks} Wks · {course.deliveryMode}
                              </strong>
                            </div>
                            <div className="acad-prog-spec-div" aria-hidden="true" />
                            <div className="acad-prog-spec">
                              <small>Level</small>
                              <strong>{course.level}</strong>
                            </div>
                          </div>

                          <div className="acad-prog-stack">
                            {course.roles.length > 0 && (
                              <div className="acad-prog-roles">
                                <span>Teams:</span>{" "}
                                {course.roles.slice(0, 3).join(" · ")}
                              </div>
                            )}
                            <div className="acad-prog-tools">
                              {course.tools.slice(0, 5).map((tool) => {
                                const toolActive =
                                  selectedToolchains.includes(tool);
                                return (
                                  <button
                                    key={tool}
                                    type="button"
                                    onClick={() => toggleToolchain(tool)}
                                    className={`acad-prog-tool-btn acad-mono ${
                                      toolActive ? "active" : ""
                                    }`}
                                    title={`Filter by ${tool}`}
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

                          <div className="acad-prog-footer">
                            <div className="acad-prog-actions">
                              <Link
                                href={`/academy/courses/${course.slug}`}
                                className="btn btn-outline btn-sm"
                              >
                                Inspect Syllabus
                              </Link>
                              <Link
                                href={`/academy/tuition?mode=corporate&course=${encodeURIComponent(
                                  course.id
                                )}&seats=${seatCount}`}
                                className="btn btn-navy btn-sm"
                              >
                                <span>Quote ({seatCount} Seats)</span>
                                <ArrowRight size={13} aria-hidden="true" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Inline Business Side-by-Side Comparison Matrix */}
            <AnimatePresence>
              {comparedCourses.length > 0 && (
                <motion.div
                  className="acad-compare-panel"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.22 }}
                  style={{ marginTop: "24px" }}
                >
                  <div className="acad-compare-panel-head">
                    <div>
                      <span
                        className="acad-kicker"
                        style={{ color: "var(--blue)" }}
                      >
                        Side-by-Side Team Comparison · {comparedCourses.length}{" "}
                        of 3 Selected
                      </span>
                      <h3>
                        Compare Corporate Seat Investment ({seatCount} Seats ·{" "}
                        {currency})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompareIds([])}
                      className="btn btn-outline btn-sm"
                    >
                      Clear Comparison
                    </button>
                  </div>

                  <div className="acad-table-wrap">
                    <table className="acad-compare-table">
                      <thead>
                        <tr>
                          <th scope="col" className="acad-compare-attr-col">
                            Attribute
                          </th>
                          {comparedCourses.map((course) => (
                            <th
                              key={course.id}
                              scope="col"
                              className="acad-compare-course-col"
                            >
                              <div className="acad-compare-col-head">
                                <div>
                                  <span className="acad-compare-col-cat">
                                    {course.audience === "business"
                                      ? "Corporate Bootcamp"
                                      : course.category}
                                  </span>
                                  <Link
                                    href={`/academy/courses/${course.slug}`}
                                    className="acad-compare-col-title"
                                  >
                                    {course.title}
                                  </Link>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleCompare(course.id)}
                                  className="acad-compare-remove-btn"
                                  aria-label={`Remove ${course.title}`}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row" className="acad-compare-attr-cell">
                            Per-Seat Tuition ({currency})
                          </th>
                          {comparedCourses.map((course) => (
                            <td key={course.id}>
                              <strong
                                style={{
                                  fontSize: "1.04rem",
                                  color: "var(--navy)",
                                }}
                              >
                                {formatCurrencyAmount(course.tuitionUsd, currency)}{" "}
                                / seat
                              </strong>
                              <div
                                style={{
                                  fontSize: "0.78rem",
                                  color: "var(--muted)",
                                }}
                              >
                                {seatCount} seats total:{" "}
                                {formatCurrencyAmount(
                                  course.tuitionUsd * seatCount,
                                  currency
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th scope="row" className="acad-compare-attr-cell">
                            Format &amp; Duration
                          </th>
                          {comparedCourses.map((course) => (
                            <td key={course.id}>
                              <strong>{course.durationWeeks} Weeks</strong> ·{" "}
                              {course.deliveryMode} ({course.level})
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th scope="row" className="acad-compare-attr-cell">
                            Core Toolchain
                          </th>
                          {comparedCourses.map((course) => (
                            <td key={course.id}>
                              <div className="acad-compare-tools">
                                {course.tools.map((t) => (
                                  <span
                                    key={t}
                                    className="acad-compare-tool-tag acad-mono"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th scope="row" className="acad-compare-attr-cell">
                            Procurement Action
                          </th>
                          {comparedCourses.map((course) => (
                            <td key={course.id}>
                              <Link
                                href={`/academy/tuition?mode=corporate&course=${encodeURIComponent(
                                  course.id
                                )}&seats=${seatCount}`}
                                className="btn btn-gold btn-sm"
                              >
                                <Building2 size={14} />
                                <span>Quote {seatCount} Seats</span>
                              </Link>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
