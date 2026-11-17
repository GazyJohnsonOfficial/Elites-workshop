"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Cloud,
  Compass,
  Cpu,
  Database,
  ShieldCheck,
  X,
} from "lucide-react";
import type { AcademyCategory, Course } from "@/lib/academyStore";
import {
  recommendTrackPathway,
  type PathfinderInput,
} from "@/lib/curriculumAssessments";

const PATH_ITEMS: Array<{
  num: string;
  category: AcademyCategory;
  title: string;
  roles: string;
  summary: string;
  icon: "db" | "cloud" | "shield" | "cpu";
}> = [
    {
      num: "01",
      category: "Data & BI",
      title: "Data & BI Engineering",
      roles: "Data Analyst · BI Developer · Analytics Lead",
      summary:
        "Master relational SQL, Python wrangling, Excel/VBA, Alteryx ETL, Tableau, and Power BI DAX.",
      icon: "db",
    },
    {
      num: "02",
      category: "Cloud & DevOps",
      title: "Cloud & DevOps Automation",
      roles: "Cloud Architect · DevOps · Platform SRE",
      summary:
        "Build immutable AWS and Azure infrastructure with Terraform, Docker containers, Kubernetes, and CI/CD.",
      icon: "cloud",
    },
    {
      num: "03",
      category: "Cybersecurity",
      title: "Cybersecurity & Compliance",
      roles: "Cloud SecOps · DevSecOps · Risk Auditor",
      summary:
        "Implement zero-trust IAM boundaries, Vault secret rotation, Trivy scanning, and security runbooks.",
      icon: "shield",
    },
    {
      num: "04",
      category: "Data & Automation",
      title: "Python & Pipeline Automation",
      roles: "Data Engineer · Automation Specialist",
      summary:
        "Design tested dbt warehouses, resilient API extractors, and scheduled validation pipelines.",
      icon: "cpu",
    },
  ];

function PathIcon({ name }: { name: "db" | "cloud" | "shield" | "cpu" }) {
  if (name === "db") return <Database size={20} />;
  if (name === "cloud") return <Cloud size={20} />;
  if (name === "shield") return <ShieldCheck size={20} />;
  return <Cpu size={20} />;
}

export function LearningPathsSection({
  courses,
  selectedCategory,
  onSelectPath,
  onResetCategory,
}: {
  courses: Course[];
  selectedCategory: string;
  onSelectPath: (category: AcademyCategory) => void;
  onResetCategory: () => void;
}) {
  const [pathfinderOpen, setPathfinderOpen] = useState(false);
  const [pathInput, setPathInput] = useState<PathfinderInput>({
    background: "analyst",
    targetRole: "bi_analyst",
    pace: "all",
  });

  const recommendation = useMemo(
    () => recommendTrackPathway(pathInput, courses),
    [pathInput, courses]
  );

  const primaryCourse =
    courses.find((c) => c.id === recommendation.primaryCourseId) || courses[0];
  const secondaryCourse =
    courses.find((c) => c.id === recommendation.secondaryCourseId) || courses[0];

  return (
    <section className="acad-section acad-section-tint" id="paths">
      <div className="container">
        <div className="acad-section-head">
          <div>
            <h2>Career Tracks &amp; Role Outcomes</h2>
            <p>
              Map target engineering responsibilities and production tool stacks directly to active Academy curricula.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setPathfinderOpen((prev) => !prev)}
              aria-expanded={pathfinderOpen}
              className={`btn btn-sm ${pathfinderOpen ? "btn-navy" : "btn-outline"}`}
            >
              {pathfinderOpen ? <X size={14} /> : <Compass size={14} />}
              <span>{pathfinderOpen ? "Close Track Matcher" : "Match My Role & Skill Gap"}</span>
            </button>

            {selectedCategory !== "all" && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onResetCategory}
              >
                Show All Tracks
              </button>
            )}
          </div>
        </div>

        {/* Interactive Role & Skill-Gap Pathfinder Studio */}
        <AnimatePresence initial={false}>
          {pathfinderOpen && (
            <motion.div
              className="acad-pathfinder"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="acad-pathfinder-inner">
                <div className="acad-pathfinder-inputs">
                  <div className="acad-pathfinder-field">
                    <label htmlFor="pf-bg">1. Current Experience</label>
                    <select
                      id="pf-bg"
                      className="acad-select"
                      value={pathInput.background}
                      onChange={(e) =>
                        setPathInput((prev) => ({
                          ...prev,
                          background: e.target.value as PathfinderInput["background"],
                        }))
                      }
                    >
                      <option value="none">Career Switcher / Entry Technical</option>
                      <option value="analyst">Spreadsheets / Basic Reporting</option>
                      <option value="sysadmin">IT Support / Linux Admin</option>
                      <option value="developer">Software Developer / Engineer</option>
                    </select>
                  </div>

                  <div className="acad-pathfinder-field">
                    <label htmlFor="pf-role">2. Target Role</label>
                    <select
                      id="pf-role"
                      className="acad-select"
                      value={pathInput.targetRole}
                      onChange={(e) =>
                        setPathInput((prev) => ({
                          ...prev,
                          targetRole: e.target.value as PathfinderInput["targetRole"],
                        }))
                      }
                    >
                      <option value="bi_analyst">Data Analyst / BI Lead</option>
                      <option value="data_eng">Data / Pipeline Engineer</option>
                      <option value="cloud_sre">Cloud Architect / Platform SRE</option>
                      <option value="security">Cloud Security / DevSecOps</option>
                      <option value="exec_leader">Technical / Engineering Manager</option>
                    </select>
                  </div>

                  <div className="acad-pathfinder-field">
                    <label htmlFor="pf-pace">3. Learning Pace</label>
                    <select
                      id="pf-pace"
                      className="acad-select"
                      value={pathInput.pace}
                      onChange={(e) =>
                        setPathInput((prev) => ({
                          ...prev,
                          pace: e.target.value as PathfinderInput["pace"],
                        }))
                      }
                    >
                      <option value="all">Either Format</option>
                      <option value="Instructor-Led">Instructor-Led Guided Workshops</option>
                      <option value="Self-Paced">Self-Paced Asynchronous</option>
                    </select>
                  </div>
                </div>

                {primaryCourse && (
                  <div className="acad-pathfinder-result">
                    <div className="acad-pathfinder-result-copy">
                      <span className="acad-cat-eyebrow" style={{ marginBottom: "6px" }}>
                        Recommended Sequence · {recommendation.estimatedWeeks} Weeks Combined
                      </span>
                      <h3>
                        Step 1: {primaryCourse.title}
                        {secondaryCourse && secondaryCourse.id !== primaryCourse.id
                          ? ` → Step 2: ${secondaryCourse.title}`
                          : ""}
                      </h3>
                      <p>{recommendation.summary}</p>
                      <div className="acad-pathfinder-gaps">
                        {recommendation.skillGaps.map((gap) => (
                          <span key={gap} className="acad-prog-tool-btn acad-mono">
                            +{gap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="acad-pathfinder-actions">
                      <button
                        type="button"
                        onClick={() => onSelectPath(primaryCourse.category)}
                        className="btn btn-navy btn-sm"
                      >
                        <span>Filter in Catalog</span>
                        <ArrowRight size={14} />
                      </button>
                      <Link
                        href={`/academy/courses/${primaryCourse.slug}`}
                        className="btn btn-outline btn-sm"
                      >
                        Inspect Syllabus
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="acad-paths-grid">
          {PATH_ITEMS.map((item, idx) => {
            const count = courses.filter((c) => c.category === item.category).length;
            const isActive = selectedCategory === item.category;
            return (
              <motion.button
                key={item.category}
                type="button"
                onClick={() => onSelectPath(item.category)}
                className={`acad-path-card ${isActive ? "active" : ""}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.32, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <div>
                  <div className="acad-path-head">
                    <div className="acad-path-icon">
                      <PathIcon name={item.icon} />
                    </div>
                    <span className="acad-path-index">{item.num}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
                <div className="acad-path-foot">
                  <div className="acad-path-roles">{item.roles}</div>
                  <div className="acad-path-meta-row">
                    <span>
                      {count} {count === 1 ? "Program" : "Programs"} Available
                    </span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
