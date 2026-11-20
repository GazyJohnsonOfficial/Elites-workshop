"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  Layers,
  Phone,
  Printer,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import type { Course } from "@/lib/academyStore";

interface SyllabusDownloadModalProps {
  course: Course;
  buttonText?: string;
  className?: string;
  variant?: "primary" | "outline" | "sidebar";
}

export function SyllabusDownloadModal({
  course,
  buttonText = "Download Detailed Syllabus",
  className = "",
  variant = "sidebar",
}: SyllabusDownloadModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [leadReference, setLeadReference] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experienceLevel: "Early Practitioner (1 to 3 yrs)",
    objective: "Career Transition into Engineering",
    requestAdvisorCall: true,
  });

  const totalHours = course.modules.reduce((acc, m) => acc + m.durationHours, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        setIsOpen(false);
        setTimeout(() => {
          setIsSuccess(false);
          setSubmitError("");
        }, 300);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/academy/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "syllabus_download",
          courseId: course.id,
          courseTitle: course.title,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          experienceLevel: formData.experienceLevel,
          objective: formData.objective,
          requestAdvisorCall: formData.requestAdvisorCall,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Unable to submit your request. Please check your details.");
      }
      setLeadReference(data.reference || "");
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Unable to process your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintSyllabus = () => {
    setIsOpen(false);
    setTimeout(() => {
      window.print();
    }, 280);
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setSubmitError("");
    }, 300);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          variant === "sidebar"
            ? `btn btn-outline btn-block btn-sm acad-no-print ${className}`
            : variant === "primary"
            ? `btn btn-gold ${className}`
            : `btn btn-outline ${className}`
        }
        title="Download curriculum brief and schedule consultation"
      >
        <Download size={15} aria-hidden="true" />
        <span>{buttonText}</span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                className="acad-syllabus-backdrop acad-no-print"
                role="dialog"
                aria-modal="true"
                aria-labelledby="syllabus-modal-title"
                onClick={(e) => {
                  if (e.target === e.currentTarget) resetAndClose();
                }}
              >
                <motion.div
                  className="acad-syllabus-modal"
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    className="acad-syllabus-close"
                    onClick={resetAndClose}
                    aria-label="Close syllabus download modal"
                  >
                    <X size={18} />
                  </button>

                  {!isSuccess ? (
                    <div>
                      <div className="acad-syllabus-modal-head">
                        <span className="acad-syllabus-badge">
                          <BookOpen size={13} aria-hidden="true" />
                          <span>Official Curriculum Package</span>
                        </span>
                        <h3 id="syllabus-modal-title">
                          Download Detailed Curriculum Brief
                        </h3>
                        <p className="acad-syllabus-course-name">
                          {course.title} · {course.durationWeeks} Weeks ({totalHours} Hours)
                        </p>
                        <p className="acad-syllabus-subtitle">
                          Receive the module-by-module competency syllabus, lab blueprints, capstone rubric, and employer sponsorship package.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="acad-syllabus-form">
                        {submitError && (
                          <div className="alert-error" role="alert" style={{ padding: "10px 14px", fontSize: "0.85rem", margin: 0 }}>
                            {submitError}
                          </div>
                        )}
                        <div className="acad-syllabus-form-grid">
                          <div className="acad-syllabus-field">
                            <label htmlFor="syl-name">
                              Full Name <span style={{ color: "var(--danger)" }}>*</span>
                            </label>
                            <input
                              id="syl-name"
                              type="text"
                              required
                              placeholder="e.g. Alex Morgan"
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                              }
                              className="acad-input"
                            />
                          </div>

                          <div className="acad-syllabus-field">
                            <label htmlFor="syl-email">
                              Work or Professional Email <span style={{ color: "var(--danger)" }}>*</span>
                            </label>
                            <input
                              id="syl-email"
                              type="email"
                              required
                              placeholder="alex@company.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, email: e.target.value }))
                              }
                              className="acad-input"
                            />
                          </div>
                        </div>

                        <div className="acad-syllabus-form-grid">
                          <div className="acad-syllabus-field">
                            <label htmlFor="syl-phone">Phone / WhatsApp Number</label>
                            <input
                              id="syl-phone"
                              type="tel"
                              placeholder="+1 555 019 2834"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, phone: e.target.value }))
                              }
                              className="acad-input"
                            />
                          </div>

                          <div className="acad-syllabus-field">
                            <label htmlFor="syl-exp">Professional Experience Level</label>
                            <select
                              id="syl-exp"
                              value={formData.experienceLevel}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, experienceLevel: e.target.value }))
                              }
                              className="acad-select"
                            >
                              <option value="Career Switcher (0 to 1 yrs)">Career Switcher (0 to 1 yrs)</option>
                              <option value="Early Practitioner (1 to 3 yrs)">Early Practitioner (1 to 3 yrs)</option>
                              <option value="Mid-Level Engineer (3 to 6 yrs)">Mid-Level Engineer (3 to 6 yrs)</option>
                              <option value="Senior / Tech Lead (6+ yrs)">Senior / Tech Lead (6+ yrs)</option>
                              <option value="Engineering Manager / Director">Engineering Manager / Director</option>
                            </select>
                          </div>
                        </div>

                        <div className="acad-syllabus-field">
                          <label htmlFor="syl-objective">Primary Goal</label>
                          <select
                            id="syl-objective"
                            value={formData.objective}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, objective: e.target.value }))
                            }
                            className="acad-select"
                          >
                            <option value="Career Transition into Engineering">
                              Career Transition into Engineering
                            </option>
                            <option value="Team / Corporate Workforce Upskilling">
                              Team / Corporate Workforce Upskilling
                            </option>
                            <option value="Exam Preparation for Industry Certification">
                              Exam Preparation for Industry Certification
                            </option>
                            <option value="Applied Production Project Delivery">
                              Applied Production Project Delivery
                            </option>
                          </select>
                        </div>

                        <label className="acad-syllabus-checkbox" style={{ marginTop: "4px" }}>
                          <input
                            type="checkbox"
                            checked={formData.requestAdvisorCall}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                requestAdvisorCall: e.target.checked,
                              }))
                            }
                          />
                          <span>
                            Include cohort calendar, installment schedule, and optional 15-minute course advisor consultation
                          </span>
                        </label>

                        <div className="acad-syllabus-actions">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-gold btn-block"
                          >
                            {isSubmitting ? (
                              <span>Preparing Curriculum...</span>
                            ) : (
                              <>
                                <span>Access Syllabus &amp; Cohort Pack</span>
                                <ArrowRight size={16} />
                              </>
                            )}
                          </button>
                        </div>

                        <div className="acad-syllabus-privacy">
                          <UserCheck size={12} aria-hidden="true" />
                          <span>Zero spam. Used exclusively to deliver curriculum and cohort details.</span>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="acad-syllabus-success">
                      <div className="acad-success-icon-wrap">
                        <FileCheck size={36} color="var(--ok)" />
                      </div>
                      <h3>Curriculum Package Unlocked</h3>
                      <p className="acad-success-lead">
                        Thank you, <strong>{formData.fullName}</strong>. Your curriculum brief for{" "}
                        <strong>{course.title}</strong> is ready
                        {leadReference ? ` (Ref: ${leadReference})` : ""}.
                      </p>

                      <div className="acad-success-summary-box">
                        <div className="acad-success-row">
                          <span><Layers size={14} /> Curriculum Scope</span>
                          <strong>{course.modules.length} Modules ({totalHours} Guided Hours)</strong>
                        </div>
                        <div className="acad-success-row">
                          <span><Clock size={14} /> Duration &amp; Format</span>
                          <strong>{course.durationWeeks} Weeks · {course.deliveryMode}</strong>
                        </div>
                        <div className="acad-success-row">
                          <span><Calendar size={14} /> Next Cohort Intake</span>
                          <strong>Upcoming Cohorts Available</strong>
                        </div>
                        <div className="acad-success-row">
                          <span><Sparkles size={14} /> Verified Credential</span>
                          <strong>Open Badges v2 + Capstone Portfolio</strong>
                        </div>
                      </div>

                      <div className="acad-success-actions">
                        <button
                          type="button"
                          onClick={handlePrintSyllabus}
                          className="btn btn-gold btn-block"
                        >
                          <Printer size={16} />
                          <span>Print / Save Formatted Syllabus PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={resetAndClose}
                          className="btn btn-outline btn-block btn-sm"
                        >
                          <span>Return to Course Overview</span>
                        </button>
                      </div>

                      {formData.requestAdvisorCall && (
                        <div className="acad-success-callout">
                          <Phone size={14} color="var(--blue)" />
                          <span>
                            An academy advisor will follow up via email with the complete PDF packet and optional consultation slots.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
