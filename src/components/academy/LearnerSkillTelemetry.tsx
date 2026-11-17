"use client";

import React, { useMemo } from "react";
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
import { Award, BarChart3, CheckCircle2, ShieldCheck } from "lucide-react";
import type { Course, Enrollment } from "@/lib/academyStore";
import { computeEnrollmentMilestoneBadges } from "@/lib/credentialUtils";

export function LearnerSkillTelemetry({
  learnerName,
  course,
  enrollment,
}: {
  learnerName: string;
  course: Course;
  enrollment: Pick<
    Enrollment,
    "completedModuleIds" | "moduleScores" | "capstoneUrl" | "certificateCode"
  >;
}) {
  const orderedModules = useMemo(
    () => [...course.modules].sort((a, b) => a.order - b.order),
    [course.modules]
  );

  const completedSet = useMemo(
    () => new Set(enrollment.completedModuleIds),
    [enrollment.completedModuleIds]
  );

  const scoresMap = enrollment.moduleScores || {};
  const totalModules = Math.max(1, orderedModules.length);
  const completedRatio = completedSet.size / totalModules;

  const avgCheckpointScore = useMemo(() => {
    const values = Object.values(scoresMap).filter(
      (n): n is number => typeof n === "number" && Number.isFinite(n)
    );
    if (values.length === 0) return Math.round(completedRatio * 100);
    return Math.round(values.reduce((acc, n) => acc + n, 0) / values.length);
  }, [scoresMap, completedRatio]);

  // Compute live domain toolchain proficiency derived from module progress & checkpoint scores
  const toolRadarData = useMemo(() => {
    const tools = course.tools.slice(0, 6);
    if (tools.length === 0) return [];
    const baseRatio = Math.max(completedRatio, enrollment.certificateCode ? 1 : 0);
    return tools.map((tool, index) => {
      const moduleForSlot = orderedModules[index % orderedModules.length];
      const modDone = moduleForSlot ? completedSet.has(moduleForSlot.id) : false;
      const modScore = moduleForSlot ? scoresMap[moduleForSlot.id] : undefined;
      const derivedPct =
        typeof modScore === "number"
          ? modScore
          : modDone
          ? Math.max(85, avgCheckpointScore)
          : Math.round(baseRatio * 75);
      return {
        subject: tool.length > 16 ? `${tool.slice(0, 15)}…` : tool,
        proficiency: Math.max(18, Math.min(100, derivedPct)),
        benchmark: 80,
        fullMark: 100,
      };
    });
  }, [course.tools, orderedModules, completedSet, scoresMap, completedRatio, avgCheckpointScore, enrollment.certificateCode]);

  const moduleBarData = useMemo(
    () =>
      orderedModules.map((mod) => {
        const done = completedSet.has(mod.id);
        const recorded = scoresMap[mod.id];
        const score =
          typeof recorded === "number" ? recorded : done ? 85 : 0;
        return {
          module: `Mod ${String(mod.order).padStart(2, "0")}`,
          score,
          target: 80,
        };
      }),
    [orderedModules, completedSet, scoresMap]
  );

  const microBadges = useMemo(
    () => computeEnrollmentMilestoneBadges(course, enrollment),
    [course, enrollment]
  );

  const earnedBadgeCount = microBadges.filter((b) => b.earned).length;

  return (
    <div className="acad-card" style={{ marginBottom: "28px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
              Live Learner Skill Telemetry &amp; Milestone Badges
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0 0" }}>
              {learnerName} · {course.title} · Avg Checkpoint {avgCheckpointScore}%
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span
            className="acad-status-ok"
            style={{ fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ShieldCheck size={14} /> {earnedBadgeCount}/{microBadges.length} Milestones Unlocked
          </span>
        </div>
      </div>

      {/* Micro-Badge Progression Strip */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        {microBadges.map((badge) => (
          <div
            key={badge.id}
            style={{
              flex: "1 1 220px",
              padding: "12px 14px",
              borderRadius: "10px",
              border: badge.earned ? "1px solid #9be3b9" : "1px solid #dce5f5",
              background: badge.earned ? "#f1fbf5" : "#f8faff",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                background: badge.earned ? "#dcfce7" : "#edf2fb",
                color: badge.earned ? "var(--ok-text)" : "var(--muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {badge.earned ? <CheckCircle2 size={17} /> : <Award size={17} />}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: badge.earned ? "var(--ok-text)" : "var(--navy)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {badge.title}
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                {badge.earned ? "Earned · " : `${badge.progressPct}% · `}
                {badge.criteria}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "22px",
        }}
      >
        {/* Radar Chart: Toolchain Coverage */}
        <div
          style={{
            background: "#f8fafd",
            border: "1px solid #dce5f5",
            borderRadius: "12px",
            padding: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <strong style={{ fontSize: "0.9rem", color: "var(--navy)" }}>
              Track Toolchain Proficiency
            </strong>
            <span className="acad-mono" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Progress vs 80% Standard
            </span>
          </div>
          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="76%" data={toolRadarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#0f2557", fontSize: 10, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Learner Score"
                  dataKey="proficiency"
                  stroke="#2d4fd6"
                  fill="#2d4fd6"
                  fillOpacity={0.38}
                />
                <Radar
                  name="Passing Standard"
                  dataKey="benchmark"
                  stroke="#0f2557"
                  fill="#0f2557"
                  fillOpacity={0.12}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Real Module Checkpoint Scores */}
        <div
          style={{
            background: "#f8fafd",
            border: "1px solid #dce5f5",
            borderRadius: "12px",
            padding: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <strong style={{ fontSize: "0.9rem", color: "var(--navy)" }}>
              Module Checkpoint Performance
            </strong>
            <span className="acad-mono" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Pass Threshold: 80%
            </span>
          </div>
          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={moduleBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="module" tick={{ fill: "#0f2557", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#0f2557", fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="score"
                  name="Module Score (%)"
                  fill="var(--blue)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="target"
                  name="80% Passing Gate"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
