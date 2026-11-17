"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Layers,
  Video,
} from "lucide-react";
import type {
  Certificate,
  Cohort,
  Course,
  CourseModule,
  Enrollment,
} from "@/lib/academyStore";

export interface LearnerDashboardEnrollment extends Enrollment {
  course: Course | null;
  cohort: Cohort | null;
  certificate: Certificate | null;
}

interface UpcomingSessionItem {
  id: string;
  enrollmentId: string;
  courseTitle: string;
  cohortCode: string;
  format: string;
  dateLabel: string;
  dayName: string;
  timeLabel: string;
  topicTitle: string;
  moduleId?: string;
  sessionKind: "Instructor-Led Session" | "Mentor Office Hours";
}

interface ModuleActivityItem {
  id: string;
  enrollmentId: string;
  courseTitle: string;
  moduleId?: string;
  title: string;
  meta: string;
  timestampLabel: string;
  kind: "module" | "certificate" | "capstone" | "enrollment";
}

function formatUtcShortDate(isoOrKey: string): string {
  const datePart = isoOrKey.slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return isoOrKey;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

function formatUtcMonthDay(dt: Date): { dateLabel: string; dayName: string } {
  return {
    dateLabel: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(dt),
    dayName: new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "UTC",
    }).format(dt),
  };
}

function getCohortSessionDays(schedule: string): number[] {
  const lower = schedule.toLowerCase();
  if (lower.includes("office hours") || lower.includes("self-paced")) {
    return [5]; // Friday mentor office hours
  }
  if (lower.includes("tue") && lower.includes("thu")) {
    return [2, 4, 6]; // Tue, Thu, Sat Lab
  }
  if (lower.includes("mon") && lower.includes("wed")) {
    return [1, 3, 6]; // Mon, Wed, Sat Lab
  }
  return [1, 3, 5]; // Default 3 guided sessions/week (Mon, Wed, Fri)
}

function buildUpcomingSessions(
  enrollments: LearnerDashboardEnrollment[]
): UpcomingSessionItem[] {
  const todayUtc = new Date();
  const anchorUtc = Date.UTC(
    todayUtc.getUTCFullYear(),
    todayUtc.getUTCMonth(),
    todayUtc.getUTCDate()
  );
  const sessions: Array<UpcomingSessionItem & { sortMs: number }> = [];

  for (const enr of enrollments) {
    if (!enr.course || enr.status === "cancelled") continue;

    const cohortCode = enr.cohort?.code || "FLEX-TRACK";
    const schedule = enr.cohort?.schedule || "Weekly mentor check-ins";
    const format = enr.cohort?.format || enr.course.deliveryMode;
    const isCompletedCourse =
      enr.status === "completed" ||
      enr.completedModuleIds.length >= enr.course.modules.length;

    // Include active tracks, or rolling Friday office hours for completed tracks if none active
    if (isCompletedCourse && enrollments.some((e) => e.status === "active")) {
      continue;
    }

    const startMs = enr.cohort?.startDateIso
      ? Date.parse(enr.cohort.startDateIso)
      : anchorUtc;
    const searchFromMs = Math.max(anchorUtc, Number.isNaN(startMs) ? anchorUtc : startMs);
    const allowedWeekdays = getCohortSessionDays(schedule);

    const remainingModules = enr.course.modules.filter(
      (m) => !enr.completedModuleIds.includes(m.id)
    );
    const targetMod: CourseModule | undefined =
      remainingModules[0] || enr.course.modules[enr.course.modules.length - 1];

    let foundCount = 0;
    const maxFound = enrollments.filter((e) => e.status === "active").length > 1 ? 2 : 3;

    for (let offset = 1; offset <= 21 && foundCount < maxFound; offset++) {
      const candidate = new Date(searchFromMs + offset * 86400000);
      const dow = candidate.getUTCDay();
      if (!allowedWeekdays.includes(dow)) continue;

      const { dateLabel, dayName } = formatUtcMonthDay(candidate);
      const isOfficeHours = schedule.toLowerCase().includes("self-paced");
      const modForSession =
        remainingModules[foundCount] || targetMod;

      sessions.push({
        id: `${enr.id}-sess-${offset}`,
        enrollmentId: enr.id,
        courseTitle: enr.course.title,
        cohortCode,
        format,
        dateLabel,
        dayName,
        timeLabel: dow === 6 ? "10:00 GMT · Lab" : "18:00 GMT",
        topicTitle: isOfficeHours
          ? "Architect Office Hours & Code Review"
          : modForSession
          ? `Module ${String(modForSession.order).padStart(2, "0")}: ${modForSession.title}`
          : "Instructor-Led Workshop",
        moduleId: modForSession?.id,
        sessionKind: isOfficeHours ? "Mentor Office Hours" : "Instructor-Led Session",
        sortMs: candidate.getTime(),
      });
      foundCount += 1;
    }
  }

  return sessions
    .sort((a, b) => a.sortMs - b.sortMs)
    .slice(0, 4)
    .map(({ sortMs: _ignore, ...rest }) => rest);
}

function buildRecentModuleActivity(
  enrollments: LearnerDashboardEnrollment[]
): ModuleActivityItem[] {
  const items: Array<ModuleActivityItem & { sortMs: number }> = [];

  for (const enr of enrollments) {
    if (!enr.course) continue;
    const course = enr.course;
    const baseLastActiveMs = Date.parse(enr.lastActiveAt || enr.createdAt) || Date.now();

    if (enr.certificate) {
      items.push({
        id: `${enr.id}-cert-${enr.certificate.code}`,
        enrollmentId: enr.id,
        courseTitle: course.title,
        title: `Verified Certificate Issued (${enr.certificate.code})`,
        meta: `${course.title} · Graduated`,
        timestampLabel: formatUtcShortDate(enr.certificate.issuedAt),
        kind: "certificate",
        sortMs: Date.parse(enr.certificate.issuedAt) || baseLastActiveMs,
      });
    }

    if (enr.capstoneUrl) {
      items.push({
        id: `${enr.id}-capstone`,
        enrollmentId: enr.id,
        courseTitle: course.title,
        title: "Capstone Deliverable Submitted",
        meta: `${course.title} · Repository linked`,
        timestampLabel: formatUtcShortDate(enr.lastActiveAt || enr.createdAt),
        kind: "capstone",
        sortMs: baseLastActiveMs - 1000,
      });
    }

    const completedModules = course.modules
      .filter((m) => enr.completedModuleIds.includes(m.id))
      .sort((a, b) => b.order - a.order);

    completedModules.forEach((mod, idx) => {
      items.push({
        id: `${enr.id}-${mod.id}`,
        enrollmentId: enr.id,
        courseTitle: course.title,
        moduleId: mod.id,
        title: `Completed Module ${String(mod.order).padStart(2, "0")}: ${mod.title}`,
        meta: `${course.title} · ${mod.durationHours} lab hrs`,
        timestampLabel: formatUtcShortDate(enr.lastActiveAt || enr.createdAt),
        kind: "module",
        sortMs: baseLastActiveMs - (idx + 1) * 3600000,
      });
    });

    items.push({
      id: `${enr.id}-enrolled`,
      enrollmentId: enr.id,
      courseTitle: course.title,
      title: `Enrolled in ${enr.cohort?.code || course.title}`,
      meta: `${course.title} · ${enr.reference}`,
      timestampLabel: formatUtcShortDate(enr.createdAt),
      kind: "enrollment",
      sortMs: Date.parse(enr.createdAt) || 0,
    });
  }

  return items
    .sort((a, b) => b.sortMs - a.sortMs)
    .slice(0, 6)
    .map(({ sortMs: _ignore, ...rest }) => rest);
}

export function LearnerDashboard({
  userName,
  enrollments,
  selectedEnrollmentId,
  onSelectCourseModule,
  onOpenCertificate,
}: {
  userName: string;
  enrollments: LearnerDashboardEnrollment[];
  selectedEnrollmentId: string;
  onSelectCourseModule: (enrollmentId: string, moduleId?: string) => void;
  onOpenCertificate?: (enrollmentId: string) => void;
}) {
  const stats = useMemo(() => {
    const activeCount = enrollments.filter((e) => e.status === "active").length;
    const completedCount = enrollments.filter((e) => e.status === "completed").length;

    let completedMods = 0;
    let totalMods = 0;
    let certsCount = 0;

    for (const enr of enrollments) {
      completedMods += enr.completedModuleIds.length;
      totalMods += enr.course?.modules.length || 0;
      if (enr.certificateCode) certsCount += 1;
    }

    const overallPct = totalMods > 0 ? Math.round((completedMods / totalMods) * 100) : 0;

    return {
      activeCount,
      completedCount,
      completedMods,
      totalMods,
      overallPct,
      certsCount,
    };
  }, [enrollments]);

  const upcomingSessions = useMemo(
    () => buildUpcomingSessions(enrollments),
    [enrollments]
  );

  const recentActivity = useMemo(
    () => buildRecentModuleActivity(enrollments),
    [enrollments]
  );

  const firstCertEnrollment = enrollments.find((e) => Boolean(e.certificateCode));

  return (
    <section
      aria-label="Learner Dashboard"
      className="acad-ld-section"
    >
      <div className="acad-ld-header">
        <div>
          <div className="acad-ld-eyebrow">Learner Dashboard</div>
          <h2>Welcome back, {userName || "Scholar"}</h2>
        </div>
        <Link href="/academy" className="btn btn-outline btn-sm">
          <span>Browse More Tracks</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* KPI Summary Strip */}
      <div className="acad-ld-kpi-grid">
        <div className="acad-ld-kpi-card">
          <span className="acad-ld-kpi-label">Active Courses</span>
          <strong className="acad-mono">{stats.activeCount}</strong>
          <small>
            {stats.completedCount} completed track{stats.completedCount === 1 ? "" : "s"}
          </small>
        </div>

        <div className="acad-ld-kpi-card">
          <span className="acad-ld-kpi-label">Module Progress</span>
          <strong className="acad-mono">{stats.overallPct}%</strong>
          <small className="acad-mono">
            {stats.completedMods} of {stats.totalMods} modules complete
          </small>
        </div>

        <div className="acad-ld-kpi-card">
          <span className="acad-ld-kpi-label">Upcoming Sessions</span>
          <strong className="acad-mono">{upcomingSessions.length}</strong>
          <small>Next scheduled workshops &amp; labs</small>
        </div>

        <div className="acad-ld-kpi-card">
          <span className="acad-ld-kpi-label">Verified Credentials</span>
          <strong className="acad-mono">{stats.certsCount}</strong>
          <small>
            {firstCertEnrollment && onOpenCertificate ? (
              <button
                type="button"
                onClick={() => onOpenCertificate(firstCertEnrollment.id)}
                className="acad-ld-inline-link"
              >
                View {firstCertEnrollment.certificateCode}
              </button>
            ) : (
              "Earned upon capstone review"
            )}
          </small>
        </div>
      </div>

      {/* 3-Card Summary Layout: Active Courses, Upcoming Sessions, Recent Module Activity */}
      <div className="acad-ld-cards-grid">
        {/* Card 1: Active Courses */}
        <article className="acad-ld-card">
          <div className="acad-ld-card-head">
            <div className="acad-ld-card-title">
              <Layers size={17} aria-hidden="true" />
              <h3>Active Courses</h3>
            </div>
            <span className="acad-mono acad-ld-card-count">
              {enrollments.length} enrolled
            </span>
          </div>

          <div className="acad-ld-list">
            {enrollments.map((enr) => {
              if (!enr.course) return null;
              const modTotal = enr.course.modules.length || 1;
              const modDone = enr.completedModuleIds.length;
              const pct = Math.round((modDone / modTotal) * 100);
              const nextMod = enr.course.modules.find(
                (m) => !enr.completedModuleIds.includes(m.id)
              );
              const isSelected = enr.id === selectedEnrollmentId;
              const isCompleted = enr.status === "completed" || modDone >= modTotal;

              return (
                <div
                  key={enr.id}
                  className={`acad-ld-course-item ${isSelected ? "selected" : ""}`}
                >
                  <div className="acad-ld-course-top">
                    <span className="acad-mono acad-ld-course-meta">
                      {enr.cohort?.code || enr.course.category} · {enr.course.deliveryMode}
                    </span>
                    <span className={`acad-ld-status-text ${isCompleted ? "done" : "active"}`}>
                      {isCompleted ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <h4>{enr.course.title}</h4>

                  <div className="acad-ld-progress-row">
                    <div className="acad-progress-track" style={{ flex: 1 }}>
                      <div className="acad-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="acad-mono acad-ld-progress-pct">
                      {pct}% ({modDone}/{modTotal})
                    </span>
                  </div>

                  <div className="acad-ld-course-foot">
                    <span className="acad-ld-next-label">
                      {nextMod
                        ? `Next: Mod ${String(nextMod.order).padStart(2, "0")} · ${nextMod.title}`
                        : enr.certificateCode
                        ? `Credential ${enr.certificateCode} issued`
                        : "Ready for capstone certificate claim"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectCourseModule(enr.id, nextMod?.id)}
                      className="btn btn-outline btn-sm"
                    >
                      <span>{isSelected ? "Open Below" : "Continue"}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        {/* Card 2: Upcoming Sessions */}
        <article className="acad-ld-card">
          <div className="acad-ld-card-head">
            <div className="acad-ld-card-title">
              <CalendarClock size={17} aria-hidden="true" />
              <h3>Upcoming Sessions</h3>
            </div>
            <span className="acad-mono acad-ld-card-count">
              Next {upcomingSessions.length}
            </span>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="acad-ld-empty">
              No upcoming workshops scheduled. Open any track below to continue self-paced modules.
            </div>
          ) : (
            <div className="acad-ld-list">
              {upcomingSessions.map((sess) => (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => onSelectCourseModule(sess.enrollmentId, sess.moduleId)}
                  className="acad-ld-session-item"
                >
                  <div className="acad-ld-session-datebox">
                    <strong className="acad-mono">{sess.dateLabel}</strong>
                    <span>{sess.dayName}</span>
                  </div>
                  <div className="acad-ld-session-body">
                    <div className="acad-ld-session-meta">
                      <span className="acad-mono">{sess.cohortCode}</span>
                      <span>·</span>
                      <span>{sess.timeLabel}</span>
                    </div>
                    <div className="acad-ld-session-topic">{sess.topicTitle}</div>
                    <div className="acad-ld-session-sub">
                      <Video size={12} aria-hidden="true" />
                      <span>
                        {sess.sessionKind} · {sess.format}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </article>

        {/* Card 3: Recent Module Activity */}
        <article className="acad-ld-card">
          <div className="acad-ld-card-head">
            <div className="acad-ld-card-title">
              <Clock size={17} aria-hidden="true" />
              <h3>Recent Module Activity</h3>
            </div>
            <span className="acad-mono acad-ld-card-count">
              Latest {recentActivity.length}
            </span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="acad-ld-empty">
              Complete your first module below to start recording curriculum milestones.
            </div>
          ) : (
            <div className="acad-ld-list">
              {recentActivity.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => onSelectCourseModule(act.enrollmentId, act.moduleId)}
                  className="acad-ld-activity-item"
                >
                  <div className={`acad-ld-activity-icon ${act.kind}`} aria-hidden="true">
                    {act.kind === "certificate" ? (
                      <Award size={15} />
                    ) : act.kind === "module" ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <BookOpen size={15} />
                    )}
                  </div>
                  <div className="acad-ld-activity-body">
                    <div className="acad-ld-activity-title">{act.title}</div>
                    <div className="acad-ld-activity-meta">
                      <span>{act.meta}</span>
                      <span>·</span>
                      <span className="acad-mono">{act.timestampLabel}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
