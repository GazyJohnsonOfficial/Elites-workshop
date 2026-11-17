"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Printer,
  Terminal,
} from "lucide-react";
import type { Course, CourseModule } from "@/lib/academyStore";
import { getModuleCheckpointQuestions } from "@/lib/curriculumAssessments";

export function CourseSyllabusPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-outline btn-block btn-sm acad-no-print"
      title="Save or print a formatted PDF syllabus summary for manager/sponsor approval"
    >
      <Printer size={15} />
      <span>Download / Print Syllabus Brief</span>
    </button>
  );
}

export function Module01FreePreview({
  course,
  firstModule,
}: {
  course: Course;
  firstModule?: CourseModule;
}) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);

  if (!firstModule) return null;

  const questions = getModuleCheckpointQuestions(course.category, 1);
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const allAnswered = questions.every((q) => typeof answers[q.id] === "number");

  return (
    <div
      className="acad-card acad-no-print"
      style={{
        marginBottom: "28px",
        background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
        borderColor: "#c5d6f5",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "var(--navy)",
              color: "#ffd166",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Terminal size={18} />
          </div>
          <div>
            <span className="acad-kicker" style={{ margin: "0 0 2px 0", color: "var(--blue)" }}>
              Complimentary Open Access · Module 01 Preview
            </span>
            <h2 style={{ fontSize: "1.14rem", color: "var(--navy)", margin: 0 }}>
              Sample Starter Lab &amp; Technical Readiness Check
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className={`btn btn-sm ${open ? "btn-outline" : "btn-navy"}`}
        >
          <BookOpen size={14} />
          <span>{open ? "Hide Module 01 Preview" : "Preview Module 01 & Readiness Quiz"}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid #dce5f5" }}>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #dce5f5",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "18px",
                }}
              >
                <div className="acad-overview-label" style={{ color: "var(--blue)" }}>
                  Module 01 Lab Brief · {firstModule.weekLabel} ({firstModule.durationHours} hrs)
                </div>
                <strong style={{ display: "block", fontSize: "1rem", color: "var(--navy)", marginBottom: "6px" }}>
                  {firstModule.title}
                </strong>
                <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "10px", lineHeight: 1.55 }}>
                  {firstModule.summary}
                </p>
                <div className="acad-module-lab" style={{ marginTop: 0 }}>
                  <strong>Sample Deliverable:</strong> {firstModule.labTask}
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <ClipboardCheck size={16} color="var(--blue)" />
                    <strong style={{ fontSize: "0.92rem", color: "var(--navy)" }}>
                      Quick Track Readiness Self-Check ({questions.length} Questions)
                    </strong>
                  </div>
                  {checked && (
                    <span
                      className="acad-mono"
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: correctCount >= 2 ? "var(--ok-text)" : "var(--blue)",
                      }}
                    >
                      Score: {correctCount}/{questions.length}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {questions.map((q, qIdx) => {
                    const selected = answers[q.id];
                    return (
                      <div
                        key={q.id}
                        style={{
                          padding: "12px 14px",
                          background: "#ffffff",
                          border: "1px solid #dce5f5",
                          borderRadius: "9px",
                        }}
                      >
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>
                          {qIdx + 1}. {q.prompt}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selected === optIdx;
                            const isCorrect = checked && optIdx === q.correctIndex;
                            const isWrong = checked && isSelected && optIdx !== q.correctIndex;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  setChecked(false);
                                  setAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                }}
                                style={{
                                  textAlign: "left",
                                  padding: "7px 10px",
                                  borderRadius: "7px",
                                  border: isCorrect
                                    ? "1px solid #22c55e"
                                    : isWrong
                                    ? "1px solid #ef4444"
                                    : isSelected
                                    ? "1px solid var(--blue)"
                                    : "1px solid #e3ebfa",
                                  background: isCorrect
                                    ? "#f0fdf4"
                                    : isWrong
                                    ? "#fef2f2"
                                    : isSelected
                                    ? "var(--blue-soft)"
                                    : "#f8faff",
                                  color: "var(--navy)",
                                  fontSize: "0.8rem",
                                  fontWeight: isSelected ? 700 : 500,
                                  cursor: "pointer",
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {checked && (
                          <p style={{ margin: "8px 0 0", fontSize: "0.78rem", color: "var(--muted)" }}>
                            <strong>Note:</strong> {q.rationale}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  <button
                    type="button"
                    disabled={!allAnswered}
                    onClick={() => setChecked(true)}
                    className="btn btn-navy btn-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>{allAnswered ? "Check Readiness Score" : "Select Answers Above"}</span>
                  </button>

                  <Link href={`/academy/tuition?course=${course.id}`} className="btn btn-gold btn-sm">
                    <span>Unlock Full {course.modules.length}-Module Track</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
