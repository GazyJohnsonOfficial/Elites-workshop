"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export function CareerRoadmapTab({ courseTitle, category, completedCount, totalModules }: { courseTitle: string; category: string; completedCount: number; totalModules: number }) {
  const isCompleted = completedCount >= totalModules;

  const milestones = [
    {
      level: "Milestone 1 · Advanced Specialization",
      title: isCompleted ? "Mastery Verified · Ready for Distributed Systems" : "In Progress · Core Syllabus Mastery",
      desc: `Building on your proficiency in ${category}, transition into multi-region high-availability cluster design, distributed state locking, and fault-tolerant pipeline architecture.`,
      tools: ["Terraform Enterprise", "Kafka / Spark Streaming", "Advanced SQL Optimization"],
    },
    {
      level: "Milestone 2 · Capstone Portfolio Project",
      title: "Enterprise Multi-Cloud Reference Architecture",
      desc: "Design and defend an end-to-end production system incorporating immutable infrastructure, zero-trust IAM boundaries, and automated CI/CD security scanning (Trivy / Vault).",
      tools: ["GitHub Actions", "Kubernetes", "Prometheus & Grafana"],
    },
    {
      level: "Milestone 3 · Industry Certification Readiness",
      title: "Professional Cloud Architect & Data Engineering Certifications",
      desc: "Prepare for top-tier industry examinations with Elites Tech Academy diagnostic exam simulators and direct advisory mentorship from senior cloud architects.",
      tools: ["AWS Certified Solutions Architect", "Google Cloud Professional", "Databricks Accredited"],
    },
  ];

  return (
    <div className="acad-card">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--blue)", flexShrink: 0 }}>
          <Compass size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
            Career Roadmap &amp; Next-Level Milestones
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0 0" }}>
            Tailored progression pathway for your track: {courseTitle}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
        {milestones.map((m, idx) => (
          <div key={idx} style={{ background: "#f8fafd", border: "1px solid #dce5f5", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
              <span className="acad-kicker" style={{ margin: 0 }}>{m.level}</span>
              <span className="acad-mono" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--blue)" }}>
                Stage {idx + 1} of 3
              </span>
            </div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}>
              {m.title}
            </h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "14px", lineHeight: 1.55, maxWidth: "65ch" }}>
              {m.desc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {m.tools.map((t, i) => (
                <span key={i} style={{ background: "#ffffff", border: "1px solid #dce5f5", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, color: "var(--navy)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="acad-banner-split" style={{ background: "linear-gradient(145deg, #050e26 0%, #0f2557 100%)", color: "#ffffff", padding: "28px", borderRadius: "12px" }}>
        <div>
          <span className="acad-kicker" style={{ color: "#ffd166" }}>Executive Career Placement Support</span>
          <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
            Ready to Accelerate Your Senior Engineering Promotion?
          </h4>
          <p style={{ fontSize: "0.88rem", color: "rgba(226,236,255,0.85)", margin: 0, maxWidth: "55ch" }}>
            Elites Tech Solutions partner network connects certified graduates with senior roles across North America, EMEA, and West Africa tech enterprises.
          </p>
        </div>
        <div>
          <Link href="/academy" className="btn btn-gold btn-sm">
            <span>Explore Advanced Tracks</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
