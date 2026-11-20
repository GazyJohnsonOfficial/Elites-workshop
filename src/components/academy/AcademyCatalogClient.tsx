"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  isIndividualCourse,
  type AcademyCategory,
  type Cohort,
  type Course,
  type CourseCompletionSummary,
  type CurrencyCode,
} from "@/lib/academyStore";
import { AcademyHero } from "./AcademyHero";
import { LearningPathsSection } from "./LearningPathsSection";
import { CourseCatalogSection } from "./CourseCatalogSection";
import {
  CompareDock,
  CourseComparisonSection,
} from "./CourseComparisonSection";
import { IndividualLearningFlowSection } from "./IndividualLearningFlowSection";
import { AcademyInsightsBlogSection } from "./AcademyInsightsBlogSection";
import { AcademyHomeFaqSection } from "./AcademyCourseFAQ";
import { CorporateEnablementCtaSection } from "./CorporateEnablementCtaSection";

export function AcademyCatalogClient({
  courses,
  cohorts,
  courseProgress = [],
  isAuthenticated = false,
  initialCurrency = "USD",
}: {
  courses: Course[];
  cohorts: Cohort[];
  courseProgress?: CourseCompletionSummary[];
  isAuthenticated?: boolean;
  initialCurrency?: CurrencyCode;
}) {
  const individualCourses = useMemo(
    () => courses.filter((c) => isIndividualCourse(c)),
    [courses]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareTable, setShowCompareTable] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  useEffect(() => {
    const handleRegionChange = (event: Event) => {
      const detail = (event as CustomEvent<{ currency?: CurrencyCode }>).detail;
      if (detail?.currency) {
        setCurrency(detail.currency);
      }
    };
    window.addEventListener("ets-region-currency-changed", handleRegionChange);
    return () => {
      window.removeEventListener("ets-region-currency-changed", handleRegionChange);
    };
  }, []);

  const [courseProgressList, setCourseProgressList] =
    useState<CourseCompletionSummary[]>(courseProgress);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setCourseProgressList(courseProgress);
  }, [courseProgress]);

  useEffect(() => {
    let active = true;
    const syncCourseProgress = async () => {
      try {
        const sessionRes = await fetch("/api/academy/session", {
          cache: "no-store",
        });
        if (!active || !sessionRes.ok) return;
        const sessionData = await sessionRes.json();
        if (!sessionData?.user) {
          if (active) setCourseProgressList([]);
          return;
        }
        const res = await fetch("/api/academy/learn", { cache: "no-store" });
        if (!active || !res.ok) return;
        const data = await res.json();
        if (active && Array.isArray(data?.courseProgress)) {
          setCourseProgressList(data.courseProgress);
        }
      } catch {
        // Retain SSR progress snapshot if transient sync fails
      }
    };

    if (isAuthenticated) {
      syncCourseProgress();
    }
    window.addEventListener("ets-academy-session-changed", syncCourseProgress);
    return () => {
      active = false;
      window.removeEventListener(
        "ets-academy-session-changed",
        syncCourseProgress
      );
    };
  }, [isAuthenticated]);

  const progressByCourseId = useMemo(() => {
    const map: Record<string, CourseCompletionSummary> = {};
    for (const item of courseProgressList) {
      map[item.courseId] = item;
    }
    return map;
  }, [courseProgressList]);

  const comparedCourses = useMemo(
    () =>
      compareIds
        .map((id) => individualCourses.find((c) => c.id === id))
        .filter((c): c is Course => Boolean(c)),
    [compareIds, individualCourses]
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

  const toggleComparisonTable = () => {
    if (showCompareTable) {
      setShowCompareTable(false);
      return;
    }
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
      {/* ============ INDIVIDUAL LEARNER HERO SECTION ============ */}
      <AcademyHero
        courseCount={individualCourses.length}
        isAuthenticated={isAuthenticated}
        onSelectTrack={handleSelectPath}
      />

      {/* ============ INDIVIDUAL CAREER TRACKS ============ */}
      <LearningPathsSection
        courses={individualCourses}
        selectedCategory={selectedCategory}
        onSelectPath={handleSelectPath}
        onResetCategory={() => setSelectedCategory("all")}
      />

      {/* ============ INDIVIDUAL COURSE CATALOG ============ */}
      <CourseCatalogSection
        courses={individualCourses}
        cohorts={cohorts}
        currency={currency}
        progressByCourseId={progressByCourseId}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        compareIds={compareIds}
        onToggleCompare={toggleCompareCourse}
        mounted={mounted}
        comparisonSlot={
          <CourseComparisonSection
            comparedCourses={comparedCourses}
            cohorts={cohorts}
            currency={currency}
            showCompareTable={showCompareTable}
            onToggleCompare={toggleCompareCourse}
            onClearComparison={clearComparison}
            onCloseTable={() => setShowCompareTable(false)}
          />
        }
      />

      {/* ============ FLOATING STICKY COMPARISON DOCK ============ */}
      <CompareDock
        comparedCourses={comparedCourses}
        showCompareTable={showCompareTable}
        onToggleCompare={toggleCompareCourse}
        onClearComparison={clearComparison}
        onToggleTable={toggleComparisonTable}
      />

      {/* ============ HOW INDIVIDUAL LEARNING WORKS ============ */}
      <IndividualLearningFlowSection />

      {/* ============ INDIVIDUAL CAREER GUIDES & STUDY PLAYBOOKS ============ */}
      <AcademyInsightsBlogSection variant="individual" />

      {/* ============ INDIVIDUAL FAQ ============ */}
      <AcademyHomeFaqSection audience="individual" />

      {/* ============ LIGHTWEIGHT CROSS-LINK TO FOR BUSINESSES ============ */}
      <CorporateEnablementCtaSection compact />
    </main>
  );
}
