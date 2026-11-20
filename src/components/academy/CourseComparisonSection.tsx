"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Columns3, Layers, Scale, Users, Wrench, X } from "lucide-react";
import {
  formatCurrencyAmount,
  getCourseUpcomingCohorts,
  getTodayUtcIsoKey,
  type Cohort,
  type Course,
  type CurrencyCode,
} from "@/lib/academyStore";

export function CourseComparisonSection({
  comparedCourses,
  cohorts,
  currency,
  showCompareTable,
  onToggleCompare,
  onClearComparison,
  onCloseTable,
}: {
  comparedCourses: Course[];
  cohorts: Cohort[];
  currency: CurrencyCode;
  showCompareTable: boolean;
  onToggleCompare: (courseId: string) => void;
  onClearComparison: () => void;
  onCloseTable: () => void;
}) {
  const todayKey = getTodayUtcIsoKey();

  return (
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
                Evaluate toolchains, duration, skill level, seat availability, and tuition in{" "}
                {currency}.
              </p>
            </div>
            <div className="acad-compare-panel-actions">
              <button
                type="button"
                onClick={onClearComparison}
                className="btn btn-outline btn-sm"
              >
                Clear Selection
              </button>
              <button
                type="button"
                onClick={onCloseTable}
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
                          onClick={() => onToggleCompare(course.id)}
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
                      <div
                        style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)" }}
                      >
                        {formatCurrencyAmount(course.tuitionUsd, currency)}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2px" }}>
                        2 × {formatCurrencyAmount(Math.ceil(course.tuitionUsd / 2), currency)} installments
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
                      Next Intake &amp; Schedule
                    </span>
                  </th>
                  {comparedCourses.map((course) => {
                    const upcoming = getCourseUpcomingCohorts(course, cohorts, todayKey);
                    const nextOpen = upcoming[0];
                    const fallbackCohort = cohorts.find(
                      (c) => c.courseId === course.id && c.status !== "completed"
                    );
                    return (
                      <td key={course.id}>
                        {nextOpen ? (
                          <>
                            <div style={{ fontWeight: 700, color: "var(--ok-text)" }}>
                              {course.deliveryMode === "Self-Paced"
                                ? "Rolling Intake Open"
                                : "Admissions Open"}
                            </div>
                            <div style={{ fontSize: "0.79rem", color: "var(--muted)", marginTop: "2px" }}>
                              {nextOpen.code} · {nextOpen.startDateText}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontWeight: 700, color: "var(--danger)" }}>
                              Registration Closed
                            </div>
                            {fallbackCohort && (
                              <div style={{ fontSize: "0.79rem", color: "var(--muted)", marginTop: "2px" }}>
                                {fallbackCohort.code} · {fallbackCohort.startDateText}
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
                    const nextOpen = getCourseUpcomingCohorts(course, cohorts, todayKey)[0];
                    const tuitionUrl = nextOpen
                      ? `/academy/tuition?course=${course.id}&cohort=${nextOpen.id}`
                      : `/academy/tuition?course=${course.id}`;
                    return (
                      <td key={course.id}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <Link
                            href={`/academy/courses/${course.slug}`}
                            className="btn btn-outline btn-sm"
                          >
                            View Program
                          </Link>
                          {nextOpen ? (
                            <Link href={tuitionUrl} className="btn btn-navy btn-sm">
                              Enroll
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
  );
}

export function CompareDock({
  comparedCourses,
  showCompareTable,
  onToggleCompare,
  onClearComparison,
  onToggleTable,
}: {
  comparedCourses: Course[];
  showCompareTable: boolean;
  onToggleCompare: (courseId: string) => void;
  onClearComparison: () => void;
  onToggleTable: () => void;
}) {
  return (
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
                      onClick={() => onToggleCompare(course.id)}
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
                onClick={onClearComparison}
                className="btn btn-outline-light btn-sm"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onToggleTable}
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
  );
}
