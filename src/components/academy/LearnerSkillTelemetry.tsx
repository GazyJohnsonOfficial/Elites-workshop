"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3, ShieldCheck } from "lucide-react";

const SKILL_DATA = [
  { subject: "SQL & Relational DB", proficiency: 94, benchmark: 80, fullMark: 100 },
  { subject: "Python & Automation", proficiency: 88, benchmark: 75, fullMark: 100 },
  { subject: "Cloud Architecture", proficiency: 91, benchmark: 78, fullMark: 100 },
  { subject: "IaC (Terraform/Docker)", proficiency: 85, benchmark: 72, fullMark: 100 },
  { subject: "Kubernetes & SRE", proficiency: 82, benchmark: 70, fullMark: 100 },
  { subject: "Cybersecurity & IAM", proficiency: 89, benchmark: 76, fullMark: 100 },
  { subject: "BI Analytics (Power BI)", proficiency: 96, benchmark: 82, fullMark: 100 },
];

const MODULE_PERFORMANCE = [
  { module: "Mod 1: Foundations", score: 95, classAvg: 82 },
  { module: "Mod 2: Data Wrangling", score: 92, classAvg: 79 },
  { module: "Mod 3: Cloud Pipelines", score: 88, classAvg: 76 },
  { module: "Mod 4: IaC & Docker", score: 90, classAvg: 78 },
  { module: "Mod 5: Capstone Defense", score: 96, classAvg: 84 },
];

export function LearnerSkillTelemetry({ learnerName, courseTitle }: { learnerName: string; courseTitle: string }) {
  return (
    <div className="acad-card" style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--blue)", flexShrink: 0 }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
              Learner Skill Telemetry &amp; Competency Matrix
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0 0" }}>
              Proficiency growth across 7 core toolchains for {learnerName} ({courseTitle})
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span className="acad-status-ok" style={{ fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={14} /> Certified Master Level
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
        {/* Radar Chart: Core Toolchain Proficiency */}
        <div style={{ background: "#f8fafd", border: "1px solid #dce5f5", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <strong style={{ fontSize: "0.92rem", color: "var(--navy)" }}>Core Toolchain Proficiency</strong>
            <span className="acad-mono" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Target vs Benchmark</span>
          </div>
          <div style={{ width: "100%", height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#0f2557", fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Learner Score" dataKey="proficiency" stroke="#2d4fd6" fill="#2d4fd6" fillOpacity={0.4} />
                <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#0f2557" fill="#0f2557" fillOpacity={0.15} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Module Assignment & Capstone Performance */}
        <div style={{ background: "#f8fafd", border: "1px solid #dce5f5", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <strong style={{ fontSize: "0.92rem", color: "var(--navy)" }}>Assignment &amp; Capstone Scores</strong>
            <span className="acad-mono" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Module Progression (%)</span>
          </div>
          <div style={{ width: "100%", height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODULE_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="module" tick={{ fill: "#0f2557", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#0f2557", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" name="Learner Score" fill="var(--blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="classAvg" name="Cohort Average" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
        {[
          { label: "SQL & Query Optimization", score: "94 / 100", status: "Advanced Mastery" },
          { label: "Python ETL & Pipelines", score: "88 / 100", status: "Proficient Practitioner" },
          { label: "Cloud & Terraform IaC", score: "91 / 100", status: "Advanced Mastery" },
          { label: "Capstone Defense", score: "96 / 100", status: "Distinction Honors" },
        ].map((item, i) => (
          <div key={i} style={{ background: "#ffffff", border: "1px solid #dce5f5", borderRadius: "8px", padding: "14px" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "4px" }}>{item.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <strong className="acad-mono" style={{ fontSize: "1.05rem", color: "var(--navy)" }}>{item.score}</strong>
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--blue)" }}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
