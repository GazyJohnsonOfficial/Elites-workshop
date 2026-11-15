"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Columns3,
  Cpu,
  Database,
  Layers,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wrench,
  X,
} from "lucide-react";
import {
  formatCurrencyAmount,
  type AcademyCategory,
  type Cohort,
  type Course,
  type CourseCompletionSummary,
  type CurrencyCode,
} from "@/lib/academyStore";
import { CohortCalendarPanel } from "./CohortCalendarPanel";

const PATH_ITEMS: Array<{
  num: string;
  category: AcademyCategory;
  title: string;
  roles: string;
  summary: string;
  icon: "db" | "cloud" | "shield" | "cpu";
}> = [
  {
    num: "01",
    category: "Data & BI",
    title: "Data & BI Engineering",
    roles: "Data Analyst · BI Developer · Analytics Lead",
    summary: "Master relational SQL, Python wrangling, Excel/VBA, Alteryx ETL, Tableau, and Power BI DAX.",
    icon: "db",
  },
  {
    num: "02",
    category: "Cloud & DevOps",
    title: "Cloud & DevOps Automation",
    roles: "Cloud Architect · DevOps · Platform SRE",
    summary: "Build immutable AWS/Azure infrastructure with Terraform, Docker containers, Kubernetes, and CI/CD.",
    icon: "cloud",
  },
  {
    num: "03",
    category: "Cybersecurity",
    title: "Cybersecurity & Compliance",
    roles: "Cloud SecOps · DevSecOps · Risk Auditor",
    summary: "Implement zero-trust IAM boundaries, Vault secret rotation, Trivy scanning, and breach runbooks.",
    icon: "shield",
  },
  {
    num: "04",
    category: "AI & Automation",
    title: "Python & Pipeline Automation",
    roles: "Data Engineer · Automation Specialist",
    summary: "Design tested dbt warehouses, resilient API extractors, and automated scheduled pipelines.",
    icon: "cpu",
  },
];

function PathIcon({ name }: { name: "db" | "cloud" | "shield" | "cpu" }) {
  if (name === "db") return <Database size={20} />;
  if (name === "cloud") return <Cloud size={20} />;
  if (name === "shield") return <ShieldCheck size={20} />;
  return <Cpu size={20} />;
}

export type CourseSortOption = "newest" | "duration" | "alphabetical";

const TECHNICAL_TRACKS: Array<"all" | AcademyCategory> = [
  "all",
  "Data & BI",
  "Cloud & DevOps",
  "Cybersecurity",
  "AI & Automation",
];

const DIFFICULTY_LEVELS = ["all", "Beginner", "Intermediate", "Advanced"] as const;

const DELIVERY_FORMATS = [
  "all",
  "Live Cohort",
  "Self-Paced",
  "Corporate Bootcamp",
] as const;

export function AcademyCatalogClient({
  courses,
  cohorts,
  courseProgress = [],
  isAuthenticated = false,
}: {
  courses: Course[];
  cohorts: Cohort[];
  courseProgress?: CourseCompletionSummary[];
  isAuthenticated?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedToolchains, setSelectedToolchains] = useState<string[]>([]);
  const [onlyEnrollable, setOnlyEnrollable] = useState<boolean>(false);
  const [sidebarToolSearch, setSidebarToolSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<CourseSortOption>("newest");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [query, setQuery] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareTable, setShowCompareTable] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const availableToolchains = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => c.tools.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [courses]);

  const filteredTechnicalTracks = useMemo(() => {
    const q = sidebarToolSearch.trim().toLowerCase();
    if (!q) return TECHNICAL_TRACKS;
    return TECHNICAL_TRACKS.filter((tr) =>
      tr === "all" ? "all tracks".includes(q) : tr.toLowerCase().includes(q)
    );
  }, [sidebarToolSearch]);

  const filteredAvailableToolchains = useMemo(() => {
    const q = sidebarToolSearch.trim().toLowerCase();
    if (!q) return availableToolchains;
    return availableToolchains.filter((t) => t.toLowerCase().includes(q));
  }, [availableToolchains, sidebarToolSearch]);

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

  // Store-backed course completion summaries (hydrated from SSR + kept fresh on session change)
  const [courseProgressList, setCourseProgressList] =
    useState<CourseCompletionSummary[]>(courseProgress);

  useEffect(() => {
    setCourseProgressList(courseProgress);
  }, [courseProgress]);

  useEffect(() => {
    let active = true;
    const syncCourseProgress = async () => {
      try {
        const sessionRes = await fetch("/api/academy/session", { cache: "no-store" });
        if (!active || !sessionRes.ok) return;
        const sessionData = await sessionRes.json();
        if (!sessionData?.user) {
          if (active) setCourseProgressList([]);
          return;
        }
        const res = await fetch("/api/academy/learn", { cache: "no-store" });
        if (!active) return;
        if (!res.ok) return;
        const data = await res.json();
        if (active && Array.isArray(data?.courseProgress)) {
          setCourseProgressList(data.courseProgress);
        }
      } catch {
        // Keep server-provided progress snapshot on transient network failure
      }
    };

    if (isAuthenticated) {
      syncCourseProgress();
    }
    window.addEventListener("ets-academy-session-changed", syncCourseProgress);
    return () => {
      active = false;
      window.removeEventListener("ets-academy-session-changed", syncCourseProgress);
    };
  }, [isAuthenticated]);

  const progressByCourseId = useMemo(() => {
    const map: Record<string, CourseCompletionSummary> = {};
    for (const item of courseProgressList) {
      map[item.courseId] = item;
    }
    return map;
  }, [courseProgressList]);

  // Search Assistant state for Google Search grounding tool
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleCloudSearch = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = customQ !== undefined ? customQ : searchQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch("/api/academy/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, category: selectedCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch insights");
      setSearchResult(data.text);
      setSearchSources(data.sources || []);
    } catch (err: any) {
      setSearchError(err.message || "Failed to query real-time trends");
    } finally {
      setIsSearching(false);
    }
  };

  const getCohortOpenSeats = (cohort: Cohort) =>
    cohort.status === "open" ? Math.max(0, cohort.seatCapacity - cohort.seatsTaken) : 0;

  const enrollableCourseCount = useMemo(
    () =>
      courses.filter((course) =>
        cohorts.some((coh) => coh.courseId === course.id && getCohortOpenSeats(coh) > 0)
      ).length,
    [courses, cohorts]
  );

  const contextualEnrollableCount = useMemo(
    () =>
      courses.filter((c) => {
        if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
        if (selectedMode !== "all" && c.deliveryMode !== selectedMode) return false;
        if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(c.level)) return false;
        if (selectedToolchains.length > 0 && !c.tools.some((t) => selectedToolchains.includes(t))) return false;
        if (!cohorts.some((coh) => coh.courseId === c.id && getCohortOpenSeats(coh) > 0)) {
          return false;
        }
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [c.title, c.subtitle, c.description, ...c.tools, ...c.roles]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }).length,
    [courses, cohorts, selectedCategory, selectedMode, selectedDifficulties, selectedToolchains, query]
  );

  const courseHasQueryMatch = (course: Course, rawQuery: string) => {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return true;
    const hay = [course.title, course.subtitle, course.description, ...course.tools, ...course.roles]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  };

  const trackCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const track of TECHNICAL_TRACKS) {
      counts[track] = courses.filter((c) => {
        if (track !== "all" && c.category !== track) return false;
        if (selectedMode !== "all" && c.deliveryMode !== selectedMode) return false;
        if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(c.level)) return false;
        if (selectedToolchains.length > 0 && !c.tools.some((t) => selectedToolchains.includes(t))) return false;
        if (onlyEnrollable && !cohorts.some((coh) => coh.courseId === c.id && getCohortOpenSeats(coh) > 0)) {
          return false;
        }
        return courseHasQueryMatch(c, query);
      }).length;
    }
    return counts;
  }, [courses, cohorts, selectedMode, selectedDifficulties, selectedToolchains, onlyEnrollable, query]);

  const modeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mode of DELIVERY_FORMATS) {
      counts[mode] = courses.filter((c) => {
        if (mode !== "all" && c.deliveryMode !== mode) return false;
        if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
        if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(c.level)) return false;
        if (selectedToolchains.length > 0 && !c.tools.some((t) => selectedToolchains.includes(t))) return false;
        if (onlyEnrollable && !cohorts.some((coh) => coh.courseId === c.id && getCohortOpenSeats(coh) > 0)) {
          return false;
        }
        return courseHasQueryMatch(c, query);
      }).length;
    }
    return counts;
  }, [courses, cohorts, selectedCategory, selectedDifficulties, selectedToolchains, onlyEnrollable, query]);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedMode !== "all" ||
    selectedDifficulties.length > 0 ||
    selectedToolchains.length > 0 ||
    onlyEnrollable ||
    sidebarToolSearch.trim().length > 0 ||
    query.trim().length > 0;

  const resetCatalogFilters = () => {
    setSelectedCategory("all");
    setSelectedMode("all");
    setSelectedDifficulties([]);
    setSelectedToolchains([]);
    setOnlyEnrollable(false);
    setSidebarToolSearch("");
    setSortBy("newest");
    setQuery("");
  };

  const filteredCourses = useMemo(() => {
    const matched = courses.filter((c) => {
      if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
      if (selectedMode !== "all" && c.deliveryMode !== selectedMode) return false;
      if (
        selectedDifficulties.length > 0 &&
        !selectedDifficulties.includes(c.level)
      ) {
        return false;
      }
      if (
        selectedToolchains.length > 0 &&
        !c.tools.some((t) => selectedToolchains.includes(t))
      ) {
        return false;
      }
      if (onlyEnrollable) {
        const hasOpenCohort = cohorts.some(
          (coh) => coh.courseId === c.id && getCohortOpenSeats(coh) > 0
        );
        if (!hasOpenCohort) return false;
      }
      return courseHasQueryMatch(c, query);
    });

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
    selectedMode,
    selectedDifficulties,
    selectedToolchains,
    onlyEnrollable,
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

  const toggleCompareCourse = (courseId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(courseId)) {
        const next = prev.filter((id) => id !== courseId);
        if (next.length === 0) {
          setShowCompareTable(false);
        }
        return next;
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, courseId];
    });
  };

  const clearComparison = () => {
    setCompareIds([]);
    setShowCompareTable(false);
  };

  const openComparisonTable = () => {
    setShowCompareTable(true);
    setTimeout(() => {
      const el = document.getElementById("acad-compare-panel");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const handleSelectPath = (cat: AcademyCategory) => {
    setSelectedCategory((prev) => (prev === cat ? "all" : cat));
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main id="main">
      {/* ============ EDITORIAL HERO ============ */}
      <section className="acad-hero">
        <div className="container">
          <div className="acad-hero-topbar">
            <Link href="/" className="acad-hero-backlink">
              <ArrowLeft size={14} />
              <span>Elites Tech Solutions Corporate</span>
            </Link>
            <div className="acad-hero-quicklinks">
              <Link href="/academy/signin">Workspace Sign In</Link>
              <Link href="/academy/verify">Verify Certificate</Link>
              <Link href="/admin">Staff Admin</Link>
            </div>
          </div>

          <div className="acad-hero-grid">
            <motion.div
              className="acad-hero-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="acad-kicker">Elites Tech Academy · Individual &amp; Enterprise</span>
              <h1>
                Industry-Grade Cloud, Data &amp; Security Training Built for{" "}
                <span style={{ color: "#ffd166", fontWeight: 700 }}>Real Engineering Teams</span>
              </h1>
              <p className="acad-hero-lead">
                Enroll individually or upskill an entire engineering department through live practitioner cohorts, guided capstone laboratories, transparent multi-currency tuition plans, and verifiable digital credentials.
              </p>

              <div className="acad-hero-cta">
                <a href="#catalog" className="btn btn-gold btn-lg">
                  <span>Browse Course Catalog</span>
                  <ArrowRight size={18} />
                </a>
                <Link href="/academy/tuition?mode=corporate" className="btn btn-outline-light btn-lg">
                  <Building2 size={18} />
                  <span>Corporate Seat Quote</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="acad-hero-visual"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="acad-hero-media-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/academy/hero-workspace.jpg"
                  alt="Practicing engineer working across cloud dashboards and analytics workflows"
                  width={960}
                  height={600}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="acad-hero-caption">
                <span>Next Flagship Live Cohort: Data Analysis &amp; BI</span>
                <Link href="/academy/courses/data-analysis-bi">
                  View Syllabus →
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="acad-hero-rail"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="acad-hero-rail-item">
              <strong>{courses.length} Active Tracks</strong>
              <span>Data, Cloud, DevOps &amp; Cybersecurity</span>
            </div>
            <div className="acad-hero-rail-item">
              <strong>USD · GHS · GBP</strong>
              <span>Full Payment or 2 Monthly Installments</span>
            </div>
            <div className="acad-hero-rail-item">
              <strong>Up to 22% Off</strong>
              <span>Bulk Corporate Seat Packs &amp; Net-30 PO</span>
            </div>
            <div className="acad-hero-rail-item">
              <strong>Public Verification</strong>
              <span>Employer-verifiable graduate certificates</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ ROLE-BASED LEARNING PATHS ============ */}
      <section className="acad-section acad-section-tint" id="paths">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <h2>Role-Based Learning Paths</h2>
              <p>Select a career or departmental capability track to filter matching programs below.</p>
            </div>
            {selectedCategory !== "all" && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedCategory("all")}
              >
                Show All Paths
              </button>
            )}
          </div>

          <div className="acad-paths-grid">
            {PATH_ITEMS.map((item, idx) => {
              const count = courses.filter((c) => c.category === item.category).length;
              const isActive = selectedCategory === item.category;
              return (
                <motion.button
                  key={item.category}
                  type="button"
                  onClick={() => handleSelectPath(item.category)}
                  className={`acad-path-card ${isActive ? "active" : ""}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.32, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div>
                    <div className="acad-path-head">
                      <div className="acad-path-icon">
                        <PathIcon name={item.icon} />
                      </div>
                      <span className="acad-path-index">{item.num}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <div className="acad-path-foot">
                    <div className="acad-path-roles">{item.roles}</div>
                    <div className="acad-path-meta-row">
                      <span>
                        {count} {count === 1 ? "Program" : "Programs"} Available
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ INTERACTIVE COURSE CATALOG ============ */}
      <section className="acad-section" id="catalog">
        <div className="container">
          {/* ============ LIVE CLOUD TREND & DOCS ASSISTANT (GOOGLE SEARCH GROUNDING) ============ */}
          <div style={{ background: "#ffffff", border: "1px solid #dce5f5", borderRadius: "14px", padding: "28px", marginBottom: "40px", boxShadow: "0 4px 20px rgba(10,26,64,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--blue)", flexShrink: 0 }}>
                  <Cloud size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
                    Live Cloud Industry Trends &amp; Documentation Assistant
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0 0" }}>
                    Query real-time cloud architectures, compliance standards, and tool documentation powered by Google Search grounding.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["Terraform State", "AWS Well-Architected", "Kubernetes SecOps", "Power BI DAX"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSearchQuery(preset);
                      handleCloudSearch(undefined, preset);
                    }}
                    className="btn btn-outline btn-xs"
                    style={{ fontSize: "0.78rem", padding: "6px 12px", borderRadius: "6px" }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => handleCloudSearch(e)} style={{ display: "flex", gap: "12px", marginBottom: searchResult || isSearching ? "20px" : "0" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask about cloud migration trends, security baselines, or certification docs..."
                  className="acad-input"
                  style={{ paddingLeft: "42px", height: "46px", width: "100%", borderRadius: "8px", border: "1px solid #dce5f5" }}
                />
              </div>
              <button type="submit" disabled={isSearching} className="btn btn-navy" style={{ height: "46px", padding: "0 24px", whiteSpace: "nowrap" }}>
                {isSearching ? "Querying Web..." : "Query Trends"}
              </button>
            </form>

            {searchError && (
              <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontSize: "0.88rem", marginTop: "16px" }}>
                {searchError}
              </div>
            )}

            {(searchResult || isSearching) && (
              <div style={{ background: "#f8fafd", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", marginTop: "16px" }}>
                {isSearching ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--muted)", fontSize: "0.9rem" }}>
                    <div style={{ width: "18px", height: "18px", border: "2px solid var(--blue)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <span>Retrieving real-time industry trends and documentation via Google Search...</span>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--navy)", whiteSpace: "pre-line", marginBottom: searchSources.length > 0 ? "16px" : 0 }}>
                      {searchResult}
                    </div>
                    {searchSources.length > 0 && (
                      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                          Verified Grounding Sources &amp; Documentation
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {searchSources.map((src, i) => (
                            <a
                              key={i}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#ffffff", border: "1px solid #dce5f5", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem", color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}
                            >
                              <span>{src.title}</span>
                              <ArrowRight size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="acad-section-head">
            <div>
              <h2>Course &amp; Cohort Catalog</h2>
              <p>Compare structured curricula, tuition in your preferred currency, and upcoming start dates.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--muted)" }}>
                Currency
              </span>
              <div className="acad-currency-switch" role="group" aria-label="Display currency">
                {(["USD", "GHS", "GBP"] as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`acad-currency-btn ${currency === code ? "active" : ""}`}
                    aria-pressed={currency === code}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="acad-catalog-layout">
            {/* Vertical Filter Sidebar */}
            <aside className="acad-filter-sidebar academy-catalog-sidebar" aria-label="Course filters">
              <div className="acad-sidebar-head">
                <div className="acad-sidebar-title">
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  <span>Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetCatalogFilters}
                    className="acad-sidebar-reset"
                    title="Clear all active checkbox and track filters"
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* Sidebar Quick Search Input for Toolchains & Categories */}
              <div className="acad-sidebar-group" style={{ paddingBottom: "12px" }}>
                <div className="acad-search-wrap" style={{ width: "100%", display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={14} aria-hidden="true" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                    <input
                      type="text"
                      value={sidebarToolSearch}
                      onChange={(e) => setSidebarToolSearch(e.target.value)}
                      placeholder="Filter toolchains & tracks..."
                      className="acad-input"
                      style={{ width: "100%", fontSize: "0.82rem", height: "36px", paddingLeft: "32px", paddingRight: "12px" }}
                    />
                  </div>
                  {sidebarToolSearch && (
                    <button
                      type="button"
                      onClick={() => setSidebarToolSearch("")}
                      className="btn btn-outline btn-sm"
                      style={{ height: "36px", padding: "0 10px", fontSize: "0.78rem", whiteSpace: "nowrap" }}
                      title="Clear keyword search"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Only Enrollable Programs Checkbox Toggle */}
              <div className="acad-sidebar-group">
                <div className="acad-sidebar-group-label" id="filter-enrollable-heading">
                  Enrollment Status
                </div>
                <label
                  className={`acad-sidebar-checkbox-option ${onlyEnrollable ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={onlyEnrollable}
                    onChange={(e) => setOnlyEnrollable(e.target.checked)}
                    aria-label="Only Enrollable Programs"
                  />
                  <span className="acad-sidebar-checkbox-box" aria-hidden="true">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="acad-sidebar-option-text">Only Enrollable Programs</span>
                  <span className="acad-sidebar-count acad-mono">
                    ({contextualEnrollableCount}/{enrollableCourseCount})
                  </span>
                </label>
              </div>

              <div className="acad-sidebar-group">
                <div className="acad-sidebar-group-label" id="filter-track-heading">
                  Technical Track
                </div>
                <div
                  className="acad-sidebar-options"
                  role="radiogroup"
                  aria-labelledby="filter-track-heading"
                >
                  {filteredTechnicalTracks.map((track) => {
                    const active = selectedCategory === track;
                    const count = trackCounts[track] ?? 0;
                    return (
                      <button
                        key={track}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() =>
                          setSelectedCategory((prev) =>
                            prev === track && track !== "all" ? "all" : track
                          )
                        }
                        className={`acad-sidebar-option ${active ? "active" : ""}`}
                      >
                        <span className="acad-sidebar-radio" aria-hidden="true">
                          <span className="acad-sidebar-radio-dot" />
                        </span>
                        <span className="acad-sidebar-option-text">
                          {track === "all" ? "All Tracks" : track}
                        </span>
                        <span className="acad-sidebar-count acad-mono">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Course Difficulty Multi-Select Checkboxes */}
              <div className="acad-sidebar-group">
                <div className="acad-sidebar-group-label" id="filter-difficulty-heading">
                  Course Difficulty (Multi-Select)
                </div>
                <div
                  className="acad-sidebar-options"
                  role="group"
                  aria-labelledby="filter-difficulty-heading"
                >
                  {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => {
                    const checked = selectedDifficulties.includes(level);
                    return (
                      <label
                        key={level}
                        className={`acad-sidebar-checkbox-option ${checked ? "active" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDifficulty(level)}
                        />
                        <span className="acad-sidebar-checkbox-box" aria-hidden="true">
                          <Check size={11} strokeWidth={3} />
                        </span>
                        <span className="acad-sidebar-option-text">{level}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Technical Toolchains Multi-Select Checkboxes */}
              <div className="acad-sidebar-group">
                <div className="acad-sidebar-group-label" id="filter-toolchain-heading">
                  Technical Toolchains (Multi-Select)
                </div>
                <div
                  className="acad-sidebar-options acad-sidebar-scroll"
                  role="group"
                  aria-labelledby="filter-toolchain-heading"
                >
                  {filteredAvailableToolchains.map((tool) => {
                    const checked = selectedToolchains.includes(tool);
                    return (
                      <label
                        key={tool}
                        className={`acad-sidebar-checkbox-option ${checked ? "active" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleToolchain(tool)}
                        />
                        <span className="acad-sidebar-checkbox-box" aria-hidden="true">
                          <Check size={11} strokeWidth={3} />
                        </span>
                        <span className="acad-sidebar-option-text">{tool}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="acad-sidebar-group">
                <div className="acad-sidebar-group-label" id="filter-format-heading">
                  Delivery Format
                </div>
                <div
                  className="acad-sidebar-options"
                  role="radiogroup"
                  aria-labelledby="filter-format-heading"
                >
                  {DELIVERY_FORMATS.map((mode) => {
                    const active = selectedMode === mode;
                    const count = modeCounts[mode] ?? 0;
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
                        className={`acad-sidebar-option ${active ? "active" : ""}`}
                      >
                        <span className="acad-sidebar-radio" aria-hidden="true">
                          <span className="acad-sidebar-radio-dot" />
                        </span>
                        <span className="acad-sidebar-option-text">
                          {mode === "all" ? "All Formats" : mode}
                        </span>
                        <span className="acad-sidebar-count acad-mono">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="acad-sidebar-group" style={{ paddingTop: "12px", borderTop: "1px solid #edf2fb" }}>
                <button
                  type="button"
                  onClick={resetCatalogFilters}
                  className="btn btn-outline btn-sm"
                  style={{ width: "100%", justifyContent: "center", gap: "6px" }}
                  title="Reset all sidebar text searches and checkbox filters"
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>Reset All</span>
                </button>
              </div>
            </aside>

            {/* Main Catalog Results Area */}
            <div className="acad-catalog-main">
              <div className="acad-catalog-toolbar">
                <div className="acad-search-wrap acad-catalog-search">
                  <Search size={16} aria-hidden="true" />
                  <input
                    type="search"
                    className="acad-input"
                    placeholder="Search SQL, Kubernetes, AWS..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search courses"
                  />
                </div>

                <div className="acad-catalog-toolbar-right">
                  <span className="acad-catalog-count">
                    Showing {filteredCourses.length} of {courses.length} programs
                  </span>

                  <a
                    href="#acad-cohort-calendar"
                    className="acad-calendar-jump-btn"
                  >
                    <CalendarDays size={14} aria-hidden="true" />
                    <span>Cohort Calendar</span>
                  </a>

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
                </div>
              </div>

              {hasActiveFilters && (
                <div className="acad-active-filters-bar">
                  <span>
                    Active filters:{" "}
                    {[
                      selectedCategory !== "all" ? selectedCategory : null,
                      selectedDifficulties.length > 0 ? `Levels: ${selectedDifficulties.join(", ")}` : null,
                      selectedToolchains.length > 0 ? `Tools: ${selectedToolchains.join(", ")}` : null,
                      selectedMode !== "all" ? selectedMode : null,
                      onlyEnrollable ? "Only Enrollable" : null,
                      query.trim() ? `"${query.trim()}"` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  <button
                    type="button"
                    onClick={resetCatalogFilters}
                    className="acad-active-filters-clear"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {filteredCourses.length === 0 ? (
                <div className="acad-card" style={{ textAlign: "center", padding: "48px 24px" }}>
                  <h3 style={{ color: "var(--navy)", marginBottom: "8px" }}>No matching programs</h3>
                  <p style={{ color: "var(--muted)", marginBottom: "18px" }}>
                    Adjust your sidebar filters or search query to view available Academy tracks.
                  </p>
                  <button
                    type="button"
                    className="btn btn-navy btn-sm"
                    onClick={resetCatalogFilters}
                  >
                    Reset Catalog Filters
                  </button>
                </div>
              ) : (
                <div className="acad-courses-grid acad-courses-grid-sidebar">
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, idx) => {
                  const courseCohorts = cohorts.filter((c) => c.courseId === course.id);
                  const openCohorts = courseCohorts.filter((c) => getCohortOpenSeats(c) > 0);
                  const visibleCohorts = onlyEnrollable ? openCohorts : courseCohorts;
                  const nextCohort = openCohorts[0] || courseCohorts[0];
                  const isEnrollable = openCohorts.length > 0;
                  const isCompared = compareIds.includes(course.id);
                  const compareLimitReached = !isCompared && compareIds.length >= 3;
                  const progress = progressByCourseId[course.id];
                  const isCourseComplete = Boolean(progress && progress.completionPct >= 100);
                  const orderedModules = [...course.modules].sort((a, b) => a.order - b.order);
                  const completedModuleSet = new Set(progress?.completedModuleIds ?? []);

                  return (
                    <motion.article
                      layout
                      key={course.id}
                      className={`acad-course-card ${isCompared ? "comparing" : ""}`}
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
                      {/* Zone 1: Media Header with Scrim */}
                      <div className="acad-course-thumb-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.heroImage}
                          alt={course.title}
                          width={640}
                          height={360}
                          referrerPolicy="no-referrer"
                          className="acad-course-thumb"
                        />
                        <div className="acad-course-thumb-scrim">
                          <span>{course.durationWeeks} Weeks · {course.sessionCount} Sessions</span>
                          <span style={{ color: "#ffd166" }}>{course.modules.length} Modules</span>
                        </div>
                      </div>

                      <div className="acad-course-body">
                        {/* Zone 2: Category & Compare Action */}
                        <div className="acad-course-meta-row">
                          <div className="acad-course-meta-line">
                            {course.category}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCompareCourse(course.id)}
                            disabled={compareLimitReached}
                            aria-pressed={isCompared}
                            title={
                              compareLimitReached
                                ? "Maximum of 3 courses selected for comparison"
                                : isCompared
                                ? "Remove from side-by-side comparison"
                                : "Add to side-by-side comparison (up to 3)"
                            }
                            className={`acad-compare-card-btn ${isCompared ? "active" : ""}`}
                          >
                            {isCompared ? <Check size={13} strokeWidth={2.5} /> : <Scale size={13} />}
                            <span>
                              {isCompared ? "Comparing" : compareLimitReached ? "Max 3" : "Compare"}
                            </span>
                          </button>
                        </div>
                        <h3>
                          <Link href={`/academy/courses/${course.slug}`}>
                            {course.title}
                          </Link>
                        </h3>
                        <p className="acad-course-sub">{course.subtitle}</p>

                        {/* Store-Backed Course Completion Progress Bar */}
                        {progress && (
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
                              <div
                                className="acad-card-progress-segments"
                                aria-hidden="true"
                              >
                                {orderedModules.map((mod) => {
                                  const isDone = completedModuleSet.has(mod.id);
                                  const isNext =
                                    !isDone && progress.nextModuleOrder === mod.order;
                                  return (
                                    <span
                                      key={mod.id}
                                      title={`Module ${mod.order}: ${mod.title}${isDone ? " (Completed)" : isNext ? " (Next up)" : ""}`}
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
                              <Link
                                href="/academy/learn"
                                className="acad-card-progress-link"
                              >
                                <span>{isCourseComplete ? "Certificate" : "Resume"}</span>
                                <ArrowRight size={13} aria-hidden="true" />
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Zone 3: Structured 2x2 Technical Spec Grid */}
                        <div className="acad-course-spec-grid">
                          <div className="acad-course-spec-cell">
                            <small>Delivery Format</small>
                            <strong>{course.deliveryMode}</strong>
                          </div>
                          <div className="acad-course-spec-cell">
                            <small>Skill Level</small>
                            <strong>{course.level}</strong>
                          </div>
                          <div className="acad-course-spec-cell">
                            <small>Core Toolchain</small>
                            <strong title={course.tools.join(", ")}>
                              {course.tools.slice(0, 3).join(", ")}
                            </strong>
                          </div>
                          <div className="acad-course-spec-cell">
                            <small>Next Intake</small>
                            <strong style={{ color: isEnrollable ? "var(--ok-text)" : "var(--danger)" }}>
                              {nextCohort ? nextCohort.startDateText : "No Open Cohort"}
                            </strong>
                          </div>
                        </div>

                        {visibleCohorts.length > 0 && (
                          <div className="acad-cohort-availability">
                            {visibleCohorts.map((coh) => {
                              const openSeats = getCohortOpenSeats(coh);
                              return (
                                <div key={coh.id} className="acad-cohort-row">
                                  <span className="acad-cohort-code acad-mono">{coh.code}</span>
                                  <span
                                    className={`acad-cohort-seats acad-mono ${
                                      openSeats > 0 ? "open" : "full"
                                    }`}
                                  >
                                    <Users size={12} aria-hidden="true" />
                                    {openSeats > 0
                                      ? `${openSeats} open seats`
                                      : "0 open seats · Full"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Zone 4: Pricing & Actions Footer */}
                        <div className="acad-course-footer">
                          <div className="acad-course-price">
                            <strong>{formatCurrencyAmount(course.tuitionUsd, currency)}</strong>
                            <span>50% deposit: {formatCurrencyAmount(Math.ceil(course.tuitionUsd / 2), currency)}</span>
                          </div>
                          <div className="acad-course-actions">
                            <Link href={`/academy/courses/${course.slug}`} className="btn btn-outline btn-sm">
                              Syllabus
                            </Link>
                            {isEnrollable ? (
                              <Link href={`/academy/tuition?course=${course.id}`} className="btn btn-navy btn-sm">
                                Enroll
                              </Link>
                            ) : (
                              <Link
                                href={`/academy/courses/${course.slug}`}
                                className="btn btn-outline btn-sm"
                                style={{ color: "var(--danger)", borderColor: "#f3c5c0" }}
                              >
                                Cohort Full
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          <CohortCalendarPanel
            filteredCourses={filteredCourses}
            cohorts={cohorts}
            hideFullCohorts={onlyEnrollable}
            currency={currency}
          />

          {/* ============ SIDE-BY-SIDE COURSE COMPARISON TABLE ============ */}
          <AnimatePresence>
            {showCompareTable && comparedCourses.length > 0 && (
              <motion.section
                id="acad-compare-panel"
                aria-label="Side-by-side course comparison"
                className="acad-compare-panel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="acad-compare-panel-head">
                  <div>
                    <span className="acad-kicker" style={{ color: "var(--blue)" }}>
                      Side-by-Side Comparison · {comparedCourses.length} of 3 Selected
                    </span>
                    <h3>Compare Programs &amp; Technical Attributes</h3>
                    <p>
                      Evaluate toolchains, duration, skill level, open cohort seats, and tuition in {currency}.
                    </p>
                  </div>
                  <div className="acad-compare-panel-actions">
                    <button
                      type="button"
                      onClick={clearComparison}
                      className="btn btn-outline btn-sm"
                    >
                      Clear Selection
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCompareTable(false)}
                      className="btn btn-navy btn-sm"
                    >
                      <X size={14} />
                      <span>Close Table</span>
                    </button>
                  </div>
                </div>

                {comparedCourses.length === 1 && (
                  <div className="acad-surface-note" style={{ marginTop: 0, marginBottom: "16px" }}>
                    Select 1 or 2 more programs from the catalog above to compare attributes side-by-side.
                  </div>
                )}

                <div className="acad-table-wrap">
                  <table className="acad-compare-table">
                    <thead>
                      <tr>
                        <th scope="col" className="acad-compare-attr-col">
                          Attribute
                        </th>
                        {comparedCourses.map((course) => (
                          <th key={course.id} scope="col" className="acad-compare-course-col">
                            <div className="acad-compare-col-head">
                              <div>
                                <span className="acad-compare-col-cat">{course.category}</span>
                                <Link
                                  href={`/academy/courses/${course.slug}`}
                                  className="acad-compare-col-title"
                                >
                                  {course.title}
                                </Link>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleCompareCourse(course.id)}
                                className="acad-compare-remove-btn"
                                title={`Remove ${course.title} from comparison`}
                                aria-label={`Remove ${course.title} from comparison`}
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
                          Tuition ({currency})
                        </th>
                        {comparedCourses.map((course) => (
                          <td key={course.id}>
                            <div className="acad-mono" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)" }}>
                              {formatCurrencyAmount(course.tuitionUsd, currency)}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2px" }}>
                              50% deposit: {formatCurrencyAmount(Math.ceil(course.tuitionUsd / 2), currency)}
                            </div>
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          <span className="acad-compare-attr-label">
                            <Layers size={14} aria-hidden="true" />
                            Skill Level
                          </span>
                        </th>
                        {comparedCourses.map((course) => (
                          <td key={course.id}>
                            <strong style={{ color: "var(--navy)" }}>{course.level}</strong>
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          <span className="acad-compare-attr-label">
                            <Clock size={14} aria-hidden="true" />
                            Duration &amp; Intensity
                          </span>
                        </th>
                        {comparedCourses.map((course) => {
                          const totalHours = course.modules.reduce((acc, m) => acc + m.durationHours, 0);
                          return (
                            <td key={course.id}>
                              <strong style={{ color: "var(--navy)" }}>{course.durationWeeks} Weeks</strong>
                              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
                                {course.sessionCount} sessions · {course.modules.length} modules ({totalHours} lab hrs)
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          Delivery Format
                        </th>
                        {comparedCourses.map((course) => (
                          <td key={course.id}>{course.deliveryMode}</td>
                        ))}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          <span className="acad-compare-attr-label">
                            <Wrench size={14} aria-hidden="true" />
                            Core Toolchain
                          </span>
                        </th>
                        {comparedCourses.map((course) => (
                          <td key={course.id}>
                            <div className="acad-compare-tools">
                              {course.tools.map((tool) => (
                                <span key={tool} className="acad-compare-tool-tag acad-mono">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          Target Career Roles
                        </th>
                        {comparedCourses.map((course) => (
                          <td key={course.id} style={{ fontSize: "0.84rem", lineHeight: 1.5 }}>
                            {course.roles.join(" · ")}
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          <span className="acad-compare-attr-label">
                            <Users size={14} aria-hidden="true" />
                            Next Intake &amp; Open Seats
                          </span>
                        </th>
                        {comparedCourses.map((course) => {
                          const courseCohorts = cohorts.filter((c) => c.courseId === course.id);
                          const openCohorts = courseCohorts.filter((c) => getCohortOpenSeats(c) > 0);
                          const nextOpen = openCohorts[0];
                          const fallbackCohort = courseCohorts[0];
                          return (
                            <td key={course.id}>
                              {nextOpen ? (
                                <>
                                  <div style={{ fontWeight: 700, color: "var(--ok-text)" }}>
                                    {getCohortOpenSeats(nextOpen)} / {nextOpen.seatCapacity} seats open
                                  </div>
                                  <div style={{ fontSize: "0.79rem", color: "var(--muted)", marginTop: "2px" }}>
                                    <span className="acad-mono">{nextOpen.code}</span> · {nextOpen.startDateText}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div style={{ fontWeight: 700, color: "var(--danger)" }}>
                                    0 open seats · Full
                                  </div>
                                  {fallbackCohort && (
                                    <div style={{ fontSize: "0.79rem", color: "var(--muted)", marginTop: "2px" }}>
                                      <span className="acad-mono">{fallbackCohort.code}</span> · {fallbackCohort.startDateText}
                                    </div>
                                  )}
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          Syllabus Highlights
                        </th>
                        {comparedCourses.map((course) => (
                          <td key={course.id}>
                            <ul className="acad-compare-modules-list">
                              {course.modules.slice(0, 3).map((m) => (
                                <li key={m.id}>
                                  <span className="acad-mono">{m.weekLabel}:</span> {m.title}
                                </li>
                              ))}
                              {course.modules.length > 3 && (
                                <li style={{ color: "var(--blue)", fontWeight: 600 }}>
                                  +{course.modules.length - 3} more modules
                                </li>
                              )}
                            </ul>
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <th scope="row" className="acad-compare-attr-cell">
                          Next Step
                        </th>
                        {comparedCourses.map((course) => {
                          const hasSeats = cohorts.some(
                            (c) => c.courseId === course.id && getCohortOpenSeats(c) > 0
                          );
                          return (
                            <td key={course.id}>
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                <Link
                                  href={`/academy/courses/${course.slug}`}
                                  className="btn btn-outline btn-sm"
                                >
                                  Syllabus
                                </Link>
                                {hasSeats ? (
                                  <Link
                                    href={`/academy/tuition?course=${course.id}`}
                                    className="btn btn-navy btn-sm"
                                  >
                                    Enroll
                                  </Link>
                                ) : (
                                  <Link
                                    href={`/academy/courses/${course.slug}`}
                                    className="btn btn-outline btn-sm"
                                    style={{ color: "var(--danger)", borderColor: "#f3c5c0" }}
                                  >
                                    Cohort Full
                                  </Link>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ============ FLOATING STICKY COMPARISON DOCK ============ */}
      <AnimatePresence>
        {comparedCourses.length > 0 && (
          <motion.div
            className="acad-compare-dock"
            role="region"
            aria-label="Selected courses for comparison"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container acad-compare-dock-inner">
              <div className="acad-compare-dock-meta">
                <span className="acad-compare-dock-title">
                  <Columns3 size={16} aria-hidden="true" />
                  <span>Compare ({comparedCourses.length}/3)</span>
                </span>
                <div className="acad-compare-dock-chips">
                  {comparedCourses.map((course) => (
                    <span key={course.id} className="acad-compare-dock-item">
                      <span>{course.title}</span>
                      <button
                        type="button"
                        onClick={() => toggleCompareCourse(course.id)}
                        aria-label={`Remove ${course.title}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="acad-compare-dock-actions">
                <button
                  type="button"
                  onClick={clearComparison}
                  className="btn btn-outline-light btn-sm"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={
                    showCompareTable
                      ? () => setShowCompareTable(false)
                      : openComparisonTable
                  }
                  className="btn btn-gold btn-sm"
                >
                  <Scale size={15} />
                  <span>
                    {showCompareTable
                      ? "Hide Comparison"
                      : comparedCourses.length < 2
                      ? "Preview Comparison (1/3)"
                      : `Compare Side-by-Side (${comparedCourses.length})`}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ ENTERPRISE & CREDENTIAL BANNER ============ */}
      <section className="acad-section acad-section-compact">
        <div className="container">
          <div className="acad-banner-split">
            <div>
              <span className="acad-kicker">Enterprise Workforce &amp; Verification</span>
              <h2>
                Deploy Bulk Seat Packs or Verify{" "}
                <span style={{ color: "#ffd166", fontWeight: 700 }}>
                  Graduate Credentials
                </span>
              </h2>
              <p>
                Organizations enrolling 5 or more engineers unlock up to 22% volume discounts, Net-30 PO invoicing, and real-time team completion telemetry inside the Corporate Portal. Employers can also verify graduate certificates instantly.
              </p>
            </div>
            <div className="acad-banner-actions">
              <Link href="/academy/corporate" className="btn btn-gold btn-md">
                <Building2 size={16} />
                <span>Open Corporate Team Portal</span>
              </Link>
              <Link href="/academy/verify" className="btn btn-outline-light btn-sm">
                <Award size={16} />
                <span>Verify Certificate Registry</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
