"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calculator,
  ChevronDown,
  Cloud,
  Compass,
  Cpu,
  Database,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type { CourseAudience } from "@/lib/academyStore";
import type { AcademySessionUser } from "./AcademySignInModal";

export interface HeaderProgramItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: string;
  durationWeeks: number;
  deliveryMode: string;
  audience: CourseAudience;
  tools: string[];
}

function ProgramCategoryIcon({ category }: { category: string }) {
  if (category === "Data & BI") return <Database size={15} />;
  if (category === "Cloud & DevOps") return <Cloud size={15} />;
  if (category === "Cybersecurity") return <ShieldCheck size={15} />;
  if (category === "Data & Automation") return <Cpu size={15} />;
  return <BookOpen size={15} />;
}

export function AcademyHeader({ programs = [] }: { programs?: HeaderProgramItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AcademySessionUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [tuitionIsCorporate, setTuitionIsCorporate] = useState(false);

  const programsDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchWrapRef = useRef<HTMLFormElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/session", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      }
    } catch {
      // Ignore network hiccup
    }
  }, []);

  useEffect(() => {
    loadSession();
    const handler = () => loadSession();
    const openSignInHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: "signin" | "register" }>;
      const mode = customEvent.detail?.mode || "signin";
      router.push(mode === "register" ? "/academy/register" : "/academy/signin");
    };
    window.addEventListener("ets-academy-session-changed", handler);
    window.addEventListener("ets-academy-open-signin", openSignInHandler);
    return () => {
      window.removeEventListener("ets-academy-session-changed", handler);
      window.removeEventListener("ets-academy-open-signin", openSignInHandler);
    };
  }, [loadSession, router]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileProgramsOpen(false);
    setProgramsOpen(false);
    setSearchOpen(false);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setTuitionIsCorporate(
        pathname === "/academy/tuition" && params.get("mode") === "corporate"
      );
    }
  }, [pathname]);

  useEffect(() => {
    const syncTuitionQuery = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        setTuitionIsCorporate(
          window.location.pathname === "/academy/tuition" &&
            params.get("mode") === "corporate"
        );
      }
    };
    const handleTuitionMode = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: "individual" | "corporate" }>).detail;
      if (detail?.mode) {
        setTuitionIsCorporate(detail.mode === "corporate");
      }
    };
    window.addEventListener("popstate", syncTuitionQuery);
    window.addEventListener("ets-tuition-mode-changed", handleTuitionMode);
    return () => {
      window.removeEventListener("popstate", syncTuitionQuery);
      window.removeEventListener("ets-tuition-mode-changed", handleTuitionMode);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (programsDropdownRef.current && !programsDropdownRef.current.contains(target)) {
        setProgramsOpen(false);
      }
      if (searchWrapRef.current && !searchWrapRef.current.contains(target)) {
        setSearchOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProgramsOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/academy/session", { method: "DELETE" });
    setUser(null);
    window.dispatchEvent(new Event("ets-academy-session-changed"));
    router.refresh();
  };

  const individualPrograms = useMemo(
    () => programs.filter((p) => p.audience !== "business"),
    [programs]
  );

  const businessOnlyPrograms = useMemo(
    () => programs.filter((p) => p.audience === "business"),
    [programs]
  );

  const viewingBusinessCourse = useMemo(() => {
    if (!pathname?.startsWith("/academy/courses/")) return false;
    const slug = pathname.replace("/academy/courses/", "").split("/")[0];
    const match = programs.find((p) => p.slug === slug);
    return match?.audience === "business";
  }, [pathname, programs]);

  const isBusinessContext =
    Boolean(pathname?.startsWith("/academy/corporate")) ||
    tuitionIsCorporate ||
    viewingBusinessCourse;

  const trimmedQuery = searchQuery.trim();
  const filteredPrograms = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return [];
    return programs
      .filter((program) => {
        const hay = [
          program.title,
          program.category,
          program.level,
          program.deliveryMode,
          ...program.tools,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 6);
  }, [programs, trimmedQuery]);

  const executeCatalogSearch = (rawTerm: string) => {
    const q = rawTerm.trim();
    setSearchOpen(false);
    setMobileOpen(false);

    if (isBusinessContext) {
      if (!q) {
        router.push("/academy/corporate#corporate-catalog");
        return;
      }
      if (pathname === "/academy/corporate") {
        window.dispatchEvent(
          new CustomEvent("ets-corporate-catalog-search", { detail: { query: q } })
        );
        const corpCatalogEl = document.getElementById("corporate-catalog");
        if (corpCatalogEl) {
          corpCatalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
      router.push(`/academy/corporate?q=${encodeURIComponent(q)}#corporate-catalog`);
      return;
    }

    if (!q) {
      router.push("/academy#catalog");
      return;
    }
    if (pathname === "/academy") {
      window.dispatchEvent(
        new CustomEvent("ets-academy-catalog-search", { detail: { query: q } })
      );
      const catalogEl = document.getElementById("catalog");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    router.push(`/academy?q=${encodeURIComponent(q)}#catalog`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeCatalogSearch(searchQuery);
  };

  const handleProgramsMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setSearchOpen(false);
    setProgramsOpen(true);
  };

  const handleProgramsMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setProgramsOpen(false);
    }, 150);
  };

  const navLinks = isBusinessContext
    ? [
        {
          href: "/academy/corporate#enterprise-framework",
          label: "Solutions",
          match: () => false,
        },
        {
          href: "/academy/corporate#team-pricing",
          label: "Pricing",
          match: () => false,
        },
        {
          href: "/contact",
          label: "Contact",
          match: (p: string) => p.startsWith("/contact"),
        },
      ]
    : [
        {
          href: "/academy#paths",
          label: "Career Paths",
          match: () => false,
        },
        {
          href: "/academy/tuition",
          label: "Tuition",
          match: (p: string) => p === "/academy/tuition" && !tuitionIsCorporate,
        },
        {
          href: "/contact",
          label: "Contact",
          match: (p: string) => p.startsWith("/contact"),
        },
      ];

  const isProgramsActive =
    pathname === "/academy" || Boolean(pathname?.startsWith("/academy/courses"));

  const portalUser = user && user.role !== "staff_admin" ? user : null;
  const accountDestination =
    portalUser?.role === "org_admin" ? "/academy/corporate" : "/academy/learn";

  if (
    pathname === "/academy/signin" ||
    pathname === "/academy/register" ||
    pathname === "/academy/get-started" ||
    pathname === "/academy/corporate/signin" ||
    pathname === "/academy/corporate/register" ||
    pathname === "/signin" ||
    pathname === "/register" ||
    pathname === "/get-started"
  ) {
    return null;
  }

  return (
    <header className="acad-header">
      <div className="acad-context-bar" role="region" aria-label="Audience portal switcher">
        <div className="container acad-context-bar-inner">
          <div className="acad-context-tabs">
            <Link
              href="/academy"
              className={`acad-context-tab ${!isBusinessContext ? "active" : ""}`}
            >
              For Individuals
            </Link>
            <Link
              href="/academy/corporate"
              className={`acad-context-tab ${isBusinessContext ? "active" : ""}`}
            >
              For Businesses
            </Link>
          </div>
          <div className="acad-context-utils">
            <Link href="/academy/verify" className="acad-context-util-link">
              Verify Credential
            </Link>
            {isBusinessContext ? (
              <Link
                href="/academy/tuition?mode=corporate"
                className="acad-context-util-link"
              >
                Seat Calculator
              </Link>
            ) : (
              <Link href="/academy/tuition" className="acad-context-util-link">
                Tuition &amp; Installments
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container acad-header-inner">
        <Link
          href={isBusinessContext ? "/academy/corporate" : "/academy"}
          className="acad-brand"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.png"
            alt="Elites Tech Academy"
            width={42}
            height={42}
            referrerPolicy="no-referrer"
            className="acad-brand-logo"
          />
          <span className="acad-brand-text">
            Elites Tech <span>Academy</span>
          </span>
        </Link>

        <nav className="acad-nav" aria-label="Academy navigation">
          <div
            ref={programsDropdownRef}
            className="acad-nav-dropdown"
            onMouseEnter={handleProgramsMouseEnter}
            onMouseLeave={handleProgramsMouseLeave}
          >
            <button
              type="button"
              className={`acad-nav-link acad-nav-dropdown-trigger ${programsOpen ? "open" : ""}`}
              aria-expanded={programsOpen}
              aria-haspopup="menu"
              aria-current={isProgramsActive ? "page" : undefined}
              onClick={() => setProgramsOpen((prev) => !prev)}
            >
              <span>Programs</span>
              <ChevronDown
                size={15}
                className="acad-nav-chevron"
                aria-hidden="true"
              />
            </button>

            {programsOpen && (
              <div
                className="acad-nav-dropdown-panel acad-mega-dropdown"
                role="menu"
                aria-label="Academy programs"
              >
                <div className="acad-mega-columns">
                  {/* Left Column: Individual Career Tracks */}
                  <div
                    className={`acad-mega-col acad-mega-col-main ${
                      !isBusinessContext ? "is-active-context" : ""
                    }`}
                  >
                    <div className="acad-dropdown-head">
                      <span className="acad-dropdown-head-title">
                        For Individuals ({individualPrograms.length})
                      </span>
                      <Link
                        href="/academy#catalog"
                        className="acad-dropdown-head-link"
                        onClick={() => setProgramsOpen(false)}
                      >
                        Browse catalog
                      </Link>
                    </div>

                    <div className="acad-mega-list">
                      {individualPrograms.map((program) => (
                        <Link
                          key={program.id}
                          href={`/academy/courses/${program.slug}`}
                          className="acad-dropdown-item"
                          role="menuitem"
                          onClick={() => setProgramsOpen(false)}
                        >
                          <span
                            className="acad-dropdown-item-icon"
                            aria-hidden="true"
                          >
                            <ProgramCategoryIcon category={program.category} />
                          </span>
                          <span className="acad-dropdown-item-copy">
                            <span className="acad-dropdown-item-title">
                              {program.title}
                            </span>
                            <span className="acad-dropdown-item-meta">
                              {program.level} · {program.durationWeeks} Wks ·{" "}
                              {program.deliveryMode}
                            </span>
                          </span>
                          <ArrowRight
                            size={14}
                            className="acad-dropdown-item-arrow"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Corporate Team Bootcamps & Quick Links */}
                  <div
                    className={`acad-mega-col acad-mega-col-biz ${
                      isBusinessContext ? "is-active-context" : ""
                    }`}
                  >
                    <div className="acad-dropdown-head">
                      <span className="acad-dropdown-head-title">
                        For Businesses ({businessOnlyPrograms.length} Bootcamps)
                      </span>
                      <Link
                        href="/academy/corporate#corporate-catalog"
                        className="acad-dropdown-head-link"
                        onClick={() => setProgramsOpen(false)}
                      >
                        Enterprise Hub
                      </Link>
                    </div>

                    <div className="acad-mega-list">
                      {businessOnlyPrograms.map((program) => (
                        <Link
                          key={program.id}
                          href={`/academy/courses/${program.slug}`}
                          className="acad-dropdown-item acad-dropdown-item-biz"
                          role="menuitem"
                          onClick={() => setProgramsOpen(false)}
                        >
                          <span
                            className="acad-dropdown-item-icon acad-dropdown-icon-biz"
                            aria-hidden="true"
                          >
                            <Building2 size={15} />
                          </span>
                          <span className="acad-dropdown-item-copy">
                            <span className="acad-dropdown-item-title">
                              {program.title}
                            </span>
                            <span className="acad-dropdown-item-meta">
                              {program.durationWeeks} Wks · {program.level} · 5+
                              Seats
                            </span>
                          </span>
                          <ArrowRight
                            size={14}
                            className="acad-dropdown-item-arrow"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>

                    <div className="acad-mega-quick-box">
                      <div className="acad-mega-quick-title">Quick Tools</div>
                      <Link
                        href="/academy/get-started"
                        className="acad-mega-quick-link"
                        role="menuitem"
                        onClick={() => setProgramsOpen(false)}
                      >
                        <Compass size={14} aria-hidden="true" />
                        <span>Career Track Finder</span>
                      </Link>
                      <Link
                        href="/academy/tuition?mode=corporate"
                        className="acad-mega-quick-link"
                        role="menuitem"
                        onClick={() => setProgramsOpen(false)}
                      >
                        <Calculator size={14} aria-hidden="true" />
                        <span>Team Seat Quote Calculator</span>
                      </Link>
                      <Link
                        href="/academy/verify"
                        className="acad-mega-quick-link"
                        role="menuitem"
                        onClick={() => setProgramsOpen(false)}
                      >
                        <Award size={14} aria-hidden="true" />
                        <span>Verify a Graduate Credential</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href={
                    isBusinessContext
                      ? "/academy/corporate#corporate-catalog"
                      : "/academy#catalog"
                  }
                  className="acad-dropdown-footer"
                  role="menuitem"
                  onClick={() => setProgramsOpen(false)}
                >
                  <span>
                    {isBusinessContext
                      ? "Explore All Enterprise Tracks & Team Seat Rates"
                      : "Explore All Individual Courses & Upcoming Cohorts"}
                  </span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          {navLinks.map((item) => {
            const active = item.match(pathname || "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="acad-nav-link"
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form
          ref={searchWrapRef}
          onSubmit={handleSearchSubmit}
          className="acad-header-search"
          role="search"
          aria-label="Search academy programs"
        >
          <div className="acad-header-search-box">
            <Search
              size={15}
              className="acad-header-search-icon"
              aria-hidden="true"
            />
            <input
              id="acad-header-search-input"
              name="q"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
                setProgramsOpen(false);
              }}
              onFocus={() => {
                setSearchOpen(true);
                setProgramsOpen(false);
              }}
              placeholder={
                isBusinessContext
                  ? "Search team bootcamps, tools..."
                  : "Search courses, tools..."
              }
              aria-label="Search programs, tools, or skills"
              className="acad-header-search-input"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                className="acad-header-search-clear"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                aria-label="Clear program search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {searchOpen && trimmedQuery.length > 0 && (
            <div className="acad-search-results-panel" role="listbox">
              {filteredPrograms.length > 0 ? (
                <>
                  <div className="acad-search-results-list">
                    {filteredPrograms.map((program) => (
                      <Link
                        key={program.id}
                        href={`/academy/courses/${program.slug}`}
                        className="acad-search-result-item"
                        role="option"
                        aria-selected={false}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className="acad-search-result-title">
                          {program.title}
                        </span>
                        <span className="acad-search-result-meta">
                          {program.audience === "business" ? "For Business" : program.category} ·{" "}
                          {program.tools.slice(0, 3).join(", ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="acad-search-results-footer"
                  >
                    <span>
                      View catalog results for &ldquo;{trimmedQuery}&rdquo;
                    </span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <div className="acad-search-empty">
                  <span>No matching programs for &ldquo;{trimmedQuery}&rdquo;</span>
                  <Link
                    href={isBusinessContext ? "/academy/corporate#corporate-catalog" : "/academy#catalog"}
                    className="acad-search-empty-link"
                    onClick={() => setSearchOpen(false)}
                  >
                    Browse all programs
                  </Link>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="acad-header-actions">
          {portalUser ? (
            <div className="acad-user-menu">
              <Link href={accountDestination} className="acad-user-link">
                <User size={15} />
                <span>{portalUser.fullName}</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-outline btn-sm"
                title="Sign out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href={isBusinessContext ? "/academy/corporate/signin" : "/academy/signin"}
                className="acad-header-signin-link"
              >
                Sign In
              </Link>
              <Link
                href={isBusinessContext ? "/academy/tuition?mode=corporate" : "/academy/get-started"}
                className="btn btn-gold btn-sm"
              >
                {isBusinessContext ? "Request Quote" : "Get Started"}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="acad-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`acad-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="acad-mobile-context" role="group" aria-label="Select portal view">
          <Link
            href="/academy"
            className={`acad-mobile-context-btn ${!isBusinessContext ? "active" : ""}`}
          >
            For Individuals
          </Link>
          <Link
            href="/academy/corporate"
            className={`acad-mobile-context-btn ${isBusinessContext ? "active" : ""}`}
          >
            For Businesses
          </Link>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="acad-mobile-search"
          role="search"
        >
          <Search
            size={15}
            className="acad-header-search-icon"
            aria-hidden="true"
          />
          <input
            id="acad-mobile-search-input"
            name="q"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs, tools, skills..."
            aria-label="Search programs on mobile"
            className="acad-header-search-input"
          />
        </form>

        <div className="acad-mobile-links">
          <button
            type="button"
            className="acad-mobile-programs-toggle"
            aria-expanded={mobileProgramsOpen}
            onClick={() => setMobileProgramsOpen((prev) => !prev)}
          >
            <span>Programs ({programs.length})</span>
            <ChevronDown
              size={16}
              className={`acad-nav-chevron ${mobileProgramsOpen ? "open" : ""}`}
              aria-hidden="true"
            />
          </button>

          {mobileProgramsOpen && (
            <div className="acad-mobile-programs-list">
              <div className="acad-mobile-program-group-label">Individual Career Tracks</div>
              {individualPrograms.map((program) => (
                <Link
                  key={program.id}
                  href={`/academy/courses/${program.slug}`}
                  className="acad-mobile-program-link"
                >
                  <span>{program.title}</span>
                  <span className="acad-mobile-program-meta">
                    {program.category} · {program.durationWeeks} Weeks
                  </span>
                </Link>
              ))}
              {businessOnlyPrograms.length > 0 && (
                <>
                  <div className="acad-mobile-program-group-label">Corporate Team Bootcamps</div>
                  {businessOnlyPrograms.map((program) => (
                    <Link
                      key={program.id}
                      href={`/academy/courses/${program.slug}`}
                      className="acad-mobile-program-link"
                    >
                      <span>{program.title}</span>
                      <span className="acad-mobile-program-meta">
                        {program.deliveryMode} · {program.durationWeeks} Weeks
                      </span>
                    </Link>
                  ))}
                </>
              )}
              <Link
                href={isBusinessContext ? "/academy/corporate#corporate-catalog" : "/academy#catalog"}
                className="acad-mobile-program-all"
              >
                Explore Full Program Catalog
              </Link>
            </div>
          )}

          {navLinks.map((item) => {
            const active = item.match(pathname || "");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="acad-mobile-divider" />
          <Link href="/academy/get-started">Career Track Finder</Link>
          <Link href="/academy/signin">Individual Sign In</Link>
          <Link href="/academy/corporate/signin">For Business Sign In</Link>
          <Link href="/academy/verify">Verify Certificate</Link>
          <Link href="/">Elites Tech Solutions Home</Link>
        </div>

        {portalUser ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="btn btn-outline btn-block btn-sm"
          >
            Sign Out ({portalUser.fullName})
          </button>
        ) : (
          <Link
            href={isBusinessContext ? "/academy/tuition?mode=corporate" : "/academy/get-started"}
            className="btn btn-gold btn-block btn-sm"
          >
            {isBusinessContext ? "Request Team Quote" : "Get Started"}
          </Link>
        )}
      </div>
    </header>
  );
}
