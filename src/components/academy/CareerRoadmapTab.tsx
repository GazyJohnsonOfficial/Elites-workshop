"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import type { AcademyCategory } from "@/lib/academyStore";
import { getCategoryRoadmapMilestones } from "@/lib/curriculumAssessments";

export function CareerRoadmapTab({
  courseTitle,
  category,
  completedCount,
  totalModules,
}: {
  courseTitle: string;
  category: AcademyCategory;
  completedCount: number;
  totalModules: number;
}) {
  const milestones = getCategoryRoadmapMilestones(
    category,
    courseTitle,
    completedCount,
    totalModules
  );

  return (
    <div className="acad-card">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "var(--blue-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--blue)",
            flexShrink: 0,
          }}
        >
          <Compass size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
            Career Roadmap &amp; Stack Progression ({category})
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0 0" }}>
            Role-aligned advancement pathway tailored from {courseTitle}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
        {milestones.map((m, idx) => (
          <div
            key={m.level}
            style={{
              background: "#f8fafd",
              border: "1px solid #dce5f5",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span className="acad-kicker" style={{ margin: 0 }}>
                {m.level}
              </span>
              <span
                className="acad-mono"
                style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--blue)" }}
              >
                Stage {idx + 1} of {milestones.length}
              </span>
            </div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}>
              {m.title}
            </h4>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--muted)",
                marginBottom: "14px",
                lineHeight: 1.55,
                maxWidth: "65ch",
              }}
            >
              {m.desc}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {m.tools.map((tool) => (
                  <span
                    key={tool}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dce5f5",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--navy)",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {m.recommendedSlug && (
                <Link
                  href={`/academy/courses/${m.recommendedSlug}`}
                  className="acad-card-progress-link"
                >
                  <span>View Track Syllabus</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        className="acad-banner-split"
        style={{
          background: "linear-gradient(145deg, #050e26 0%, #0f2557 100%)",
          color: "#ffffff",
          padding: "28px",
          borderRadius: "12px",
        }}
      >
        <div>
          <span className="acad-kicker" style={{ color: "#ffd166" }}>
            Role Readiness &amp; Portfolio Verification
          </span>
          <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
            Publish Verified Milestones to Employers
          </h4>
          <p style={{ fontSize: "0.88rem", color: "rgba(226,236,255,0.85)", margin: 0, maxWidth: "55ch" }}>
            Pair your GitHub capstone repository with an employer-verifiable Elites Tech Academy credential linked directly to your LinkedIn profile.
          </p>
        </div>
        <div>
          <Link href="/academy" className="btn btn-gold btn-sm">
            <span>Explore Next Tracks</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
