import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, CheckCircle2, Clock, GraduationCap } from "lucide-react";
import { formatCurrencyAmount, getAcademyStore } from "@/lib/academyStore";
import { SITE_CONFIG } from "@/lib/config";
import { AcademyCourseFAQ } from "@/components/academy/AcademyCourseFAQ";

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

  return (
    <main id="main">
      <section className="acad-page-hero">
        <div className="container">
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
        </div>
      </section>

      <section className="acad-section">
        <div className="container">
          <div className="acad-detail-grid">
            {/* Left Main Syllabus Column */}
            <div>
              <div className="acad-card" style={{ marginBottom: "28px" }}>
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

              <h2 style={{ fontSize: "1.38rem", color: "var(--navy)", marginBottom: "14px" }}>
                Module-by-Module Curriculum ({course.modules.length} Modules · {totalHours} Guided Hours)
              </h2>

              <div className="acad-syllabus-list" style={{ marginBottom: "30px" }}>
                {course.modules.map((mod) => (
                  <article key={mod.id} className="acad-module-card">
                    <div className="acad-module-top">
                      <span className="acad-module-week">
                        Module {String(mod.order).padStart(2, "0")} · {mod.weekLabel}
                      </span>
                      <span className="acad-mono" style={{ fontSize: "0.8rem", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
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
                <div style={{ marginBottom: "10px" }}>
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
                          <th>Open Seats</th>
                          <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseCohorts.map((coh) => {
                          const openSeats = Math.max(0, coh.seatCapacity - coh.seatsTaken);
                          return (
                            <tr key={coh.id}>
                              <td className="acad-mono" style={{ fontWeight: 700, color: "var(--navy)" }}>
                                {coh.code}
                              </td>
                              <td>{coh.startDateText}</td>
                              <td style={{ color: "var(--muted)" }}>{coh.schedule}</td>
                              <td className="acad-mono" style={{ fontWeight: 700, color: openSeats > 0 ? "var(--ok-text)" : "var(--danger)" }}>
                                {openSeats} / {coh.seatCapacity}
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
              <AcademyCourseFAQ />
            </div>

            {/* Right Sticky Enrollment & Tuition Card */}
            <aside className="acad-side-card">
              <div className="acad-overview-label" style={{ marginBottom: "6px" }}>
                Standard Program Tuition
              </div>
              <div className="acad-side-price">{formatCurrencyAmount(course.tuitionUsd, "USD")}</div>
              <div className="acad-mono" style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "14px" }}>
                {formatCurrencyAmount(course.tuitionUsd, "GHS")} GHS · {formatCurrencyAmount(course.tuitionUsd, "GBP")} GBP
              </div>

              <table className="acad-spec-table">
                <tbody>
                  <tr>
                    <th>Installment Plan</th>
                    <td className="acad-mono">
                      2 × {formatCurrencyAmount(Math.ceil(course.tuitionUsd / 2), "USD")}
                    </td>
                  </tr>
                  <tr>
                    <th>Duration</th>
                    <td>{course.durationWeeks} Weeks</td>
                  </tr>
                  <tr>
                    <th>Live Sessions</th>
                    <td>{course.sessionCount} Sessions</td>
                  </tr>
                  <tr>
                    <th>Credential</th>
                    <td>Verified Capstone Certificate</td>
                  </tr>
                  <tr>
                    <th>Team Discount</th>
                    <td>10% – 22% (5+ Seats)</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href={`/academy/tuition?course=${course.id}`} className="btn btn-gold btn-block">
                  <span>Enroll as Individual</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/academy/tuition?mode=corporate&course=${course.id}`}
                  className="btn btn-navy btn-block"
                >
                  <Building2 size={16} />
                  <span>Request Corporate Team Quote</span>
                </Link>
                <Link href="/academy/learn" className="btn btn-outline btn-block btn-sm">
                  <GraduationCap size={16} />
                  <span>Open Learner Workspace</span>
                </Link>
              </div>

              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "14px", marginBottom: 0 }}>
                Need employer sponsorship or formal PO documentation? Call {SITE_CONFIG.CONTACT.PHONE_DISPLAY} or select Corporate Quote above.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
