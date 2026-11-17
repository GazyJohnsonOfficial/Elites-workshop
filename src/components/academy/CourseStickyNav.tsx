"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CourseStickyNavProps {
  courseTitle: string;
  enrollHref: string;
  hasCohorts: boolean;
}

export function CourseStickyNav({
  courseTitle,
  enrollHref,
  hasCohorts,
}: CourseStickyNavProps) {
  const [activeId, setActiveId] = useState<string>("overview");
  const clickLockUntilRef = useRef<number>(0);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "outcomes", label: "Outcomes" },
    { id: "modules", label: "Curriculum" },
    ...(hasCohorts ? [{ id: "cohorts", label: "Cohorts" }] : []),
    { id: "faq", label: "FAQ" },
  ];

  useEffect(() => {
    const onScroll = () => {
      if (Date.now() < clickLockUntilRef.current) {
        return;
      }
      const stickyOffset = Math.max(
        window.innerWidth <= 1080 ? 170 : 220,
        Math.round(window.innerHeight * 0.42)
      );
      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;
      if (reachedBottom) {
        setActiveId(tabs[tabs.length - 1].id);
        return;
      }
      for (let i = tabs.length - 1; i >= 0; i--) {
        const el = document.getElementById(tabs[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= stickyOffset) {
            setActiveId(tabs[i].id);
            return;
          }
        }
      }
      setActiveId("overview");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasCohorts]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToSection = (id: string) => {
    clickLockUntilRef.current = Date.now() + 850;
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="acad-course-sticky-bar acad-no-print" aria-label="Program section navigation">
      <div className="container acad-course-sticky-inner">
        <div className="acad-course-sticky-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeId === tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`acad-course-sticky-tab ${activeId === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="acad-course-sticky-right">
          <span className="acad-course-sticky-title">{courseTitle}</span>
          <Link href={enrollHref} className="btn btn-gold btn-sm">
            <span>Enroll Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
