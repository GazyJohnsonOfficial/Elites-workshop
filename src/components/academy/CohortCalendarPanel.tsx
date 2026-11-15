"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  Users,
} from "lucide-react";
import {
  formatCurrencyAmount,
  type Cohort,
  type Course,
  type CurrencyCode,
} from "@/lib/academyStore";

interface CalendarCohortItem {
  cohort: Cohort;
  course: Course;
  startKey: string;
  windowStartKey: string;
  windowEndKey: string;
  openSeats: number;
  isEnrollable: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const TODAY_KEY = "2026-11-14";

function toIsoKey(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function parseIsoKeyParts(iso: string): { year: number; month: number; day: number; key: string } {
  const key = iso.slice(0, 10);
  const [yStr, mStr, dStr] = key.split("-");
  const year = Number(yStr) || 2026;
  const month = (Number(mStr) || 11) - 1;
  const day = Number(dStr) || 1;
  return { year, month, day, key };
}

function addDaysToKey(key: string, deltaDays: number): string {
  const { year, month, day } = parseIsoKeyParts(key);
  const dt = new Date(Date.UTC(year, month, day + deltaDays));
  return toIsoKey(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
}

function formatShortUtcDate(key: string): string {
  const { year, month, day } = parseIsoKeyParts(key);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, day)));
}

function formatShortMonthDay(key: string): string {
  const { year, month, day } = parseIsoKeyParts(key);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, day)));
}

function formatMonthHeading(year: number, monthIndex: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex, 1)));
}

function formatMonthChip(year: number, monthIndex: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex, 1)));
}

function getCalendarCells(year: number, monthIndex: number) {
  const firstDow = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;

  const cells: Array<{
    key: string;
    day: number;
    inCurrentMonth: boolean;
  }> = [];

  for (let i = 0; i < totalCells; i++) {
    const dt = new Date(Date.UTC(year, monthIndex, 1 - firstDow + i));
    const cellYear = dt.getUTCFullYear();
    const cellMonth = dt.getUTCMonth();
    const cellDay = dt.getUTCDate();
    cells.push({
      key: toIsoKey(cellYear, cellMonth, cellDay),
      day: cellDay,
      inCurrentMonth: cellYear === year && cellMonth === monthIndex,
    });
  }
  return cells;
}

export function CohortCalendarPanel({
  filteredCourses,
  cohorts,
  hideFullCohorts,
  currency,
}: {
  filteredCourses: Course[];
  cohorts: Cohort[];
  hideFullCohorts: boolean;
  currency: CurrencyCode;
}) {
  const getCohortOpenSeats = (cohort: Cohort) =>
    cohort.status === "open" ? Math.max(0, cohort.seatCapacity - cohort.seatsTaken) : 0;

  const calendarCohorts = useMemo<CalendarCohortItem[]>(() => {
    const courseMap = new Map(filteredCourses.map((c) => [c.id, c]));
    return cohorts
      .map((cohort) => {
        const course = courseMap.get(cohort.courseId);
        if (!course) return null;
        const openSeats = getCohortOpenSeats(cohort);
        if (hideFullCohorts && openSeats <= 0) return null;

        const startKey = cohort.startDateIso.slice(0, 10);
        const windowStartKey = addDaysToKey(startKey, -14);
        const windowEndKey = addDaysToKey(startKey, -1);

        return {
          cohort,
          course,
          startKey,
          windowStartKey,
          windowEndKey,
          openSeats,
          isEnrollable: openSeats > 0,
        };
      })
      .filter((item): item is CalendarCohortItem => Boolean(item))
      .sort((a, b) => a.startKey.localeCompare(b.startKey));
  }, [filteredCourses, cohorts, hideFullCohorts]);

  const [viewMonth, setViewMonth] = useState<{ year: number; month: number }>({
    year: 2026,
    month: 10, // November 2026
  });

  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  useEffect(() => {
    if (calendarCohorts.length === 0) {
      setSelectedCohortId(null);
      return;
    }
    const stillValid = calendarCohorts.some((item) => item.cohort.id === selectedCohortId);
    if (!stillValid) {
      const preferred =
        calendarCohorts.find((item) => item.startKey >= TODAY_KEY && item.isEnrollable) ||
        calendarCohorts.find((item) => item.startKey >= TODAY_KEY) ||
        calendarCohorts[0];
      setSelectedCohortId(preferred.cohort.id);
    }
  }, [calendarCohorts, selectedCohortId]);

  const activeCohort = useMemo(
    () => calendarCohorts.find((item) => item.cohort.id === selectedCohortId) || calendarCohorts[0] || null,
    [calendarCohorts, selectedCohortId]
  );

  const quickMonths = useMemo(() => {
    const seen = new Map<string, { year: number; month: number; label: string; count: number }>();
    for (const item of calendarCohorts) {
      const { year, month } = parseIsoKeyParts(item.startKey);
      const id = `${year}-${month}`;
      const existing = seen.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        seen.set(id, { year, month, label: formatMonthChip(year, month), count: 1 });
      }
    }
    return Array.from(seen.values());
  }, [calendarCohorts]);

  const calendarCells = useMemo(
    () => getCalendarCells(viewMonth.year, viewMonth.month),
    [viewMonth.year, viewMonth.month]
  );

  const shiftMonth = (delta: number) => {
    setViewMonth((prev) => {
      const dt = new Date(Date.UTC(prev.year, prev.month + delta, 1));
      return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() };
    });
  };

  const selectCohort = (item: CalendarCohortItem) => {
    setSelectedCohortId(item.cohort.id);
    setSelectedDayKey(item.startKey);
    const parts = parseIsoKeyParts(item.startKey);
    setViewMonth({ year: parts.year, month: parts.month });
  };

  const dayActivityMap = useMemo(() => {
    const map = new Map<
      string,
      {
        starts: CalendarCohortItem[];
        windows: CalendarCohortItem[];
      }
    >();

    for (const cell of calendarCells) {
      const starts: CalendarCohortItem[] = [];
      const windows: CalendarCohortItem[] = [];
      for (const item of calendarCohorts) {
        if (item.startKey === cell.key) {
          starts.push(item);
        }
        if (cell.key >= item.windowStartKey && cell.key <= item.windowEndKey) {
          windows.push(item);
        }
      }
      if (starts.length > 0 || windows.length > 0) {
        map.set(cell.key, { starts, windows });
      }
    }
    return map;
  }, [calendarCells, calendarCohorts]);

  const handleDayClick = (key: string) => {
    setSelectedDayKey(key);
    const activity = dayActivityMap.get(key);
    if (activity?.starts.length) {
      setSelectedCohortId(activity.starts[0].cohort.id);
    } else if (activity?.windows.length) {
      setSelectedCohortId(activity.windows[0].cohort.id);
    }
  };

  const selectedDayActivity = selectedDayKey ? dayActivityMap.get(selectedDayKey) : undefined;

  return (
    <section
      id="acad-cohort-calendar"
      aria-label="Upcoming cohort start dates and enrollment windows calendar"
      className="acad-calendar-panel"
    >
      <div className="acad-calendar-head">
        <div>
          <div className="acad-calendar-eyebrow">
            <CalendarDays size={15} aria-hidden="true" />
            <span>Cohort Intake Schedule</span>
          </div>
          <h3>Upcoming Cohort Start Dates &amp; Enrollment Windows</h3>
          <p>
            Select any highlighted day or cohort to inspect its 14-day registration window, live seat capacity, and kickoff date.
          </p>
        </div>

        <div className="acad-calendar-legend" aria-label="Calendar key">
          <span className="acad-cal-legend-item">
            <span className="acad-cal-swatch start" aria-hidden="true" />
            <span>Start Date</span>
          </span>
          <span className="acad-cal-legend-item">
            <span className="acad-cal-swatch window" aria-hidden="true" />
            <span>Enrollment Window (14d)</span>
          </span>
          <span className="acad-cal-legend-item">
            <span className="acad-cal-swatch full" aria-hidden="true" />
            <span>Cohort Full (0 seats)</span>
          </span>
          <span className="acad-cal-legend-item">
            <span className="acad-cal-swatch today" aria-hidden="true" />
            <span>Today (Nov 14)</span>
          </span>
        </div>
      </div>

      {calendarCohorts.length === 0 ? (
        <div className="acad-surface-note" style={{ marginTop: 0 }}>
          No cohorts match your current catalog filters. Reset or broaden your sidebar filters to view upcoming cohort start dates and enrollment windows.
        </div>
      ) : (
        <div className="acad-calendar-body">
          {/* Left: Interactive Monthly Calendar Grid */}
          <div className="acad-cal-grid-wrap">
            <div className="acad-cal-controls">
              <div className="acad-cal-month-nav">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="acad-cal-nav-btn"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <strong className="acad-cal-month-title">
                  {formatMonthHeading(viewMonth.year, viewMonth.month)}
                </strong>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="acad-cal-nav-btn"
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="acad-cal-quick-months" role="group" aria-label="Jump to intake month">
                {quickMonths.map((qm) => {
                  const isCurrent = viewMonth.year === qm.year && viewMonth.month === qm.month;
                  return (
                    <button
                      key={`${qm.year}-${qm.month}`}
                      type="button"
                      onClick={() => setViewMonth({ year: qm.year, month: qm.month })}
                      className={`acad-cal-month-chip ${isCurrent ? "active" : ""}`}
                    >
                      <span>{qm.label}</span>
                      <span className="acad-mono">({qm.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="acad-cal-weekdays" aria-hidden="true">
              {WEEKDAYS.map((day) => (
                <div key={day} className="acad-cal-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="acad-cal-grid" role="grid" aria-label={formatMonthHeading(viewMonth.year, viewMonth.month)}>
              {calendarCells.map((cell) => {
                const activity = dayActivityMap.get(cell.key);
                const starts = activity?.starts || [];
                const windows = activity?.windows || [];
                const isToday = cell.key === TODAY_KEY;
                const isSelectedDay = cell.key === selectedDayKey;

                const isActiveWindow =
                  activeCohort &&
                  cell.key >= activeCohort.windowStartKey &&
                  cell.key <= activeCohort.windowEndKey;
                const isActiveStart = activeCohort && cell.key === activeCohort.startKey;

                const hasOpenWindow = windows.some((w) => w.isEnrollable);
                const hasWindow = windows.length > 0;

                return (
                  <button
                    key={cell.key}
                    type="button"
                    onClick={() => handleDayClick(cell.key)}
                    aria-label={`${formatShortUtcDate(cell.key)}${
                      starts.length > 0
                        ? `, Cohort start: ${starts.map((s) => s.cohort.code).join(", ")}`
                        : ""
                    }${
                      windows.length > 0
                        ? `, Enrollment window open for ${windows.map((w) => w.cohort.code).join(", ")}`
                        : ""
                    }`}
                    className={[
                      "acad-cal-cell",
                      !cell.inCurrentMonth ? "outside" : "",
                      isToday ? "today" : "",
                      hasWindow ? (hasOpenWindow ? "has-window" : "has-window-full") : "",
                      isActiveWindow ? "active-window" : "",
                      isActiveStart ? "active-start" : "",
                      isSelectedDay ? "selected-day" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="acad-cal-cell-top">
                      <span className="acad-cal-day-num acad-mono">{cell.day}</span>
                      {isToday && <span className="acad-cal-today-tag">Today</span>}
                    </div>

                    <div className="acad-cal-cell-events">
                      {starts.map((item) => (
                        <span
                          key={item.cohort.id}
                          className={`acad-cal-start-marker ${
                            item.isEnrollable ? "open" : "full"
                          } ${activeCohort?.cohort.id === item.cohort.id ? "focused" : ""}`}
                        >
                          <span className="acad-mono">{item.cohort.code}</span>
                          <span>{item.isEnrollable ? "Start" : "Full"}</span>
                        </span>
                      ))}

                      {starts.length === 0 && hasWindow && (
                        <span
                          className={`acad-cal-window-bar ${
                            hasOpenWindow ? "open" : "full"
                          } ${isActiveWindow ? "focused" : ""}`}
                        >
                          {windows.length === 1
                            ? `${windows[0].cohort.code} Window`
                            : `${windows.length} Windows`}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Cohort Window Inspector & Chronological Intake List */}
          <aside className="acad-cal-inspector" aria-label="Selected cohort details">
            {activeCohort && (
              <div className="acad-cal-detail-card">
                <div className="acad-cal-detail-top">
                  <span className="acad-mono acad-cal-detail-code">
                    {activeCohort.cohort.code} · {activeCohort.course.category}
                  </span>
                  <span
                    className={`acad-cal-detail-status ${
                      activeCohort.isEnrollable ? "open" : "full"
                    }`}
                  >
                    {activeCohort.isEnrollable ? (
                      <>
                        <Users size={13} aria-hidden="true" />
                        <span>
                          {activeCohort.openSeats} / {activeCohort.cohort.seatCapacity} seats open
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock size={13} aria-hidden="true" />
                        <span>0 open seats · Full</span>
                      </>
                    )}
                  </span>
                </div>

                <h4>
                  <Link href={`/academy/courses/${activeCohort.course.slug}`}>
                    {activeCohort.course.title}
                  </Link>
                </h4>

                <div className="acad-cal-detail-meta">
                  <div>
                    <small>Cohort Start Date</small>
                    <strong>{formatShortUtcDate(activeCohort.startKey)}</strong>
                  </div>
                  <div>
                    <small>Enrollment Window</small>
                    <strong>
                      {formatShortMonthDay(activeCohort.windowStartKey)} –{" "}
                      {formatShortMonthDay(activeCohort.windowEndKey)}
                    </strong>
                  </div>
                  <div>
                    <small>Duration &amp; Level</small>
                    <strong>
                      {activeCohort.course.durationWeeks} Weeks · {activeCohort.course.level}
                    </strong>
                  </div>
                  <div>
                    <small>Tuition ({currency})</small>
                    <strong className="acad-mono">
                      {formatCurrencyAmount(activeCohort.course.tuitionUsd, currency)}
                    </strong>
                  </div>
                </div>

                <div className="acad-cal-detail-schedule">
                  <Clock size={14} aria-hidden="true" />
                  <span>
                    {activeCohort.cohort.schedule} · {activeCohort.cohort.format}
                  </span>
                </div>

                {selectedDayKey && selectedDayActivity && (selectedDayActivity.windows.length > 1 || selectedDayActivity.starts.length > 1) && (
                  <div className="acad-cal-day-multi">
                    <span>
                      Active on {formatShortMonthDay(selectedDayKey)}:{" "}
                      {[
                        ...selectedDayActivity.starts.map((s) => `${s.cohort.code} (Start)`),
                        ...selectedDayActivity.windows
                          .filter((w) => !selectedDayActivity.starts.some((s) => s.cohort.id === w.cohort.id))
                          .map((w) => `${w.cohort.code} (Window)`),
                      ].join(" · ")}
                    </span>
                  </div>
                )}

                <div className="acad-cal-detail-actions">
                  <Link
                    href={`/academy/courses/${activeCohort.course.slug}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Syllabus
                  </Link>
                  {activeCohort.isEnrollable ? (
                    <Link
                      href={`/academy/tuition?course=${activeCohort.course.id}`}
                      className="btn btn-navy btn-sm"
                    >
                      Enroll in Cohort
                    </Link>
                  ) : (
                    <Link
                      href={`/academy/courses/${activeCohort.course.slug}`}
                      className="btn btn-outline btn-sm"
                      style={{ color: "var(--danger)", borderColor: "#f3c5c0" }}
                    >
                      Cohort Full
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="acad-cal-timeline">
              <div className="acad-cal-timeline-head">
                <span>All Matching Cohorts</span>
                <span className="acad-mono">{calendarCohorts.length} scheduled</span>
              </div>
              <div className="acad-cal-timeline-list">
                {calendarCohorts.map((item) => {
                  const isSelected = activeCohort?.cohort.id === item.cohort.id;
                  return (
                    <button
                      key={item.cohort.id}
                      type="button"
                      onClick={() => selectCohort(item)}
                      className={`acad-cal-timeline-item ${isSelected ? "active" : ""}`}
                    >
                      <div className="acad-cal-timeline-row">
                        <strong className="acad-mono">{item.cohort.code}</strong>
                        <span className={`acad-cal-timeline-seats ${item.isEnrollable ? "open" : "full"}`}>
                          {item.isEnrollable ? `${item.openSeats} open` : "Full"}
                        </span>
                      </div>
                      <div className="acad-cal-timeline-title">{item.course.title}</div>
                      <div className="acad-cal-timeline-dates">
                        Window: {formatShortMonthDay(item.windowStartKey)}–{formatShortMonthDay(item.windowEndKey)} · Starts {formatShortMonthDay(item.startKey)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
