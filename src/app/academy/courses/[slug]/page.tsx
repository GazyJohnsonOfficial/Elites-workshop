import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { formatCurrencyAmount, getAcademyStore } from "@/lib/academyStore";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { SITE_CONFIG } from "@/lib/config";
import { AcademyCourseFAQ } from "@/components/academy/AcademyCourseFAQ";
import { CourseStickyNav } from "@/components/academy/CourseStickyNav";
import { SyllabusDownloadModal } from "@/components/academy/SyllabusDownloadModal";
import { Module01FreePreview } from "@/components/academy/CoursePreviewModule";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = getAcademyStore();
  const course = store.courses.find((c) => c.slug === slug);
  if (!course) {
    return { title: `Program Not Found | Elites Tech Academy` };
  }
  return {
    title: `${course.title} | Elites Tech Academy`,
    description: course.subtitle,
  };
}

export default async function AcademyCourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = getAcademyStore();
  const course = store.courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const courseCohorts = store.cohorts.filter((c) => c.courseId === course.id);
  const totalHours = course.modules.reduce((acc, m) => acc + m.durationHours, 0);
  const totalObjectives = course.modules.reduce((acc, m) => acc + m.objectives.length, 0);
  const region = await getServerRegionContext();

  const competencyBreakdown = [
    {
      label: "Hands-On Lab Deliverables",
      value: `${course.modules.length} graded applied labs`,
      pct: 100,
    },
    {
      label: "Guided Technical Hours",
      value: `${totalHours} structured hours across ${course.durationWeeks} weeks`,
      pct: Math.min(100, Math.round((totalHours / 70) * 100)),
    },
    {
      label: "Learning Objectives Mastered",
      value: `${totalObjectives} core practitioner competencies`,
      pct: Math.min(100, Math.round((totalObjectives / 24) * 100)),
    },
    {
      label: "Production Platform Toolchain",
      value: `${course.tools.length} enterprise platforms verified`,
      pct: Math.min(100, Math.round((course.tools.length / 8) * 100)),
    },
  ];

  return (
    <main id="main">
      <section className="acad-page-hero">
        <div className="container acad-course-hero-split">
          <div className="acad-course-hero-copy">
            <div className="acad-crumbs">
              <Link href="/academy">Academy Catalog</Link>
              <span>/</span>
              <span>{course.category}</span>
              <span>/</span>
              <span>{course.title}</span>
            </div>

            <div className="acad-course-meta-line" style={{ marginBottom: "8px" }}>
              {course.category} · {course.deliveryMode} · {course.level} · {course.durationWeeks} Weeks
            </div>
            <h1>{course.title}</h1>
            <p className="lead">{course.subtitle}</p>

            <div className="acad-course-hero-facts">
              <span>
                <Layers size={15} aria-hidden="true" />
                {course.modules.length} Modules ({totalHours} Hours)
              </span>
              <span>
                <Briefcase size={15} aria-hidden="true" />
                {course.roles.length} Target Roles
              </span>
              <span>
                <Award size={15} aria-hidden="true" />
                Verified Open Badges v2 Credential
              </span>
            </div>
          </div>

          <div className="acad-course-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.heroImage}
              alt={course.title}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <CourseStickyNav
        courseTitle={course.title}
        enrollHref={`/academy/tuition?course=${course.id}`}
        hasCohorts={courseCohorts.length > 0}
      />

      <section className="acad-section">
        <div className="container">
          <div className="acad-detail-grid">
            {/* Left Main Syllabus Column */}
            <div>
              <div id="overview" className="acad-card acad-anchor-section" style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "1.32rem", color: "var(--navy)", marginBottom: "10px" }}>
                  Program Overview &amp; Outcomes
                </h2>
                <p style={{ color: "var(--ink)", marginBottom: 0, maxWidth: "65ch" }}>{course.description}</p>
                <div className="acad-overview-strip">
                  <div>
                    <div className="acad-overview-label">Tools &amp; Platforms</div>
                    <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.94rem" }}>
                      {course.tools.join(", ")}
                    </div>
                  </div>
                  <div>
                    <div className="acad-overview-label">Target Career Roles</div>
                    <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.94rem" }}>
                      {course.roles.join(", ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Readiness & Curriculum Outcomes Matrix */}
              <div id="outcomes" className="acad-card acad-anchor-section" style={{ marginBottom: "28px" }}>
                <div className="acad-outcomes-header">
                  <div>
                    <h2 style={{ fontSize: "1.3rem", color: "var(--navy)", marginBottom: "6px" }}>
                      Career Readiness &amp; Curriculum Depth
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
                      Every module concludes with an applied engineering lab and formal checkpoint verification.
                    </p>
                  </div>
                  <div className="acad-outcomes-badge">
                    <ShieldCheck size={16} />
                    <span>Employer Verifiable</span>
                  </div>
                </div>

                <div className="acad-outcomes-grid">
                  <div className="acad-outcomes-metrics">
                    {competencyBreakdown.map((item) => (
                      <div key={item.label} className="acad-outcomes-bar-row">
                        <div className="acad-outcomes-bar-head">
                          <strong>{item.label}</strong>
                          <span>{item.value}</span>
                        </div>
                        <div className="acad-outcomes-bar-track" aria-hidden="true">
                          <div className="acad-outcomes-bar-fill" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="acad-outcomes-roles-box">
                    <div className="acad-overview-label" style={{ marginBottom: "10px" }}>
                      Target Roles &amp; Applied Deliverables
                    </div>
                    <ul className="acad-obj-list" style={{ marginBottom: "12px" }}>
                      {course.roles.map((role) => (
                        <li key={role} className="acad-obj-item">
                          <Briefcase size={15} color="var(--blue)" style={{ flexShrink: 0, marginTop: "3px" }} />
                          <span style={{ fontWeight: 600, color: "var(--navy)" }}>{role}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="acad-outcomes-note">
                      Includes shareable{" "}
                      <Link href="/academy/verify" style={{ color: "var(--blue)", fontWeight: 600 }}>
                        public certificate verification
                      </Link>
                      , JSON-LD badge metadata, and Net-30 invoicing readiness for teams of 5+.
                    </div>
                  </div>
                </div>
              </div>

              <Module01FreePreview course={course} firstModule={course.modules[0]} />

              <h2 id="modules" className="acad-anchor-section" style={{ fontSize: "1.38rem", color: "var(--navy)", marginBottom: "14px" }}>
                Module-by-Module Curriculum ({course.modules.length} Modules · {totalHours} Guided Hours)
              </h2>

              <div className="acad-syllabus-list" style={{ marginBottom: "30px" }}>
                {course.modules.map((mod) => (
                  <article key={mod.id} className="acad-module-card">
                    <div className="acad-module-top">
                      <span className="acad-module-week">
                        Module {String(mod.order).padStart(2, "0")} · {mod.weekLabel}
                      </span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={14} /> {mod.durationHours} hrs
                      </span>
                    </div>
                    <h3>{mod.title}</h3>
                    <p style={{ fontSize: "0.91rem", color: "var(--muted)", marginBottom: "8px", maxWidth: "65ch" }}>
                      {mod.summary}
                    </p>
                    <ul className="acad-obj-list">
                      {mod.objectives.map((obj, idx) => (
                        <li key={idx} className="acad-obj-item">
                          <CheckCircle2 size={15} color="var(--ok)" style={{ flexShrink: 0, marginTop: "3px" }} />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="acad-module-lab">
                      <strong>Applied Lab Deliverable:</strong> {mod.labTask}
                    </div>
                  </article>
                ))}
              </div>

              {courseCohorts.length > 0 && (
                <div id="cohorts" className="acad-anchor-section" style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "1.28rem", color: "var(--navy)", marginBottom: "12px" }}>
                    Upcoming Cohorts &amp; Schedules
                  </h2>
                  <div className="acad-table-wrap">
                    <table className="acad-table">
                      <thead>
                        <tr>
                          <th>Cohort Code</th>
                          <th>Start Date</th>
                          <th>Schedule</th>
                          <th>Availability</th>
                          <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseCohorts.map((coh) => {
                          const openSeats = Math.max(0, coh.seatCapacity - coh.seatsTaken);
                          return (
                            <tr key={coh.id}>
                              <td style={{ fontWeight: 700, color: "var(--navy)" }}>
                                {coh.code}
                              </td>
                              <td>{coh.startDateText}</td>
                              <td style={{ color: "var(--muted)" }}>{coh.schedule}</td>
                              <td style={{ fontWeight: 700, color: openSeats > 0 ? "var(--ok-text)" : "var(--danger)" }}>
                                {openSeats > 0 ? `${openSeats} of ${coh.seatCapacity} Open` : "Cohort Full"}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <Link
                                  href={`/academy/tuition?course=${course.id}&cohort=${coh.id}`}
                                  className="btn btn-navy btn-sm"
                                >
                                  Select
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FAQ Component */}
              <div id="faq" className="acad-anchor-section">
                <AcademyCourseFAQ />
              </div>
            </div>

            {/* Right Sticky Enrollment & Tuition Card */}
            <aside className="acad-side-card">
              <div className="acad-overview-label" style={{ marginBottom: "6px" }}>
                Standard Program Tuition
              </div>
              <div className="acad-side-price">{formatCurrencyAmount(course.tuitionUsd, region.currency)}</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)", marginBottom: "14px" }}>
                Regional settlement · {region.currency}
              </div>

              <table className="acad-spec-table">
                <tbody>
                  <tr>
                    <th>Installment Plan</th>
                    <td style={{ fontWeight: 700 }}>
                      2 × {formatCurrencyAmount(Math.ceil(course.tuitionUsd / 2), region.currency)}
                    </td>
                  </tr>
                  <tr>
                    <th>Duration</th>
                    <td>{course.durationWeeks} Weeks</td>
                  </tr>
                  <tr>
                    <th>Sessions</th>
                    <td>{course.sessionCount} Sessions</td>
                  </tr>
                  <tr>
                    <th>Credential</th>
                    <td>Verified Capstone Certificate</td>
                  </tr>
                  <tr>
                    <th>Team Discount</th>
                    <td>10% to 22% (5+ Seats)</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} className="acad-no-print">
                <Link href={`/academy/tuition?course=${course.id}`} className="btn btn-gold btn-block">
                  <span>Enroll as Individual</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/academy/tuition?mode=corporate&course=${course.id}`}
                  className="btn btn-navy btn-block"
                >
                  <Building2 size={16} />
                  <span>Request Business Team Quote</span>
                </Link>
                <SyllabusDownloadModal
                  course={course}
                  buttonText="Download Detailed Syllabus"
                  variant="sidebar"
                />
                <Link href="/academy/learn" className="btn btn-outline btn-block btn-sm">
                  <GraduationCap size={16} />
                  <span>Open Learner Workspace</span>
                </Link>
              </div>

              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "14px", marginBottom: 0 }}>
                Need employer sponsorship or formal PO documentation? Call {SITE_CONFIG.CONTACT.PHONE_DISPLAY} or select Business Quote above.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
