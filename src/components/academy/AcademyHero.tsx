"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { AcademyCategory } from "@/lib/academyStore";

/* -----------------------------------------------------------------------------
 * 1. VECTOR BRAND & TOOLCHAIN LOGO COMPONENTS
 * Inline vectors styled for the Elites Tech Academy architectural theme
 * -------------------------------------------------------------------------- */

export const BRAND_LOGOS: Array<{ name: string; render: () => React.ReactNode }> = [
  {
    name: "AWS",
    render: () => (
      <svg
        className="acad-hero-logo-svg acad-hero-logo-aws"
        version="1.1"
        viewBox="-45.101 -44.95 390.872 269.7"
        aria-label="Amazon Web Services"
      >
        <g transform="translate(-1.668 -1.1)">
          <path
            d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3L83.2 92c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9Q59.2 94.7 41.5 94.7c-8.4 0-15.1-2.4-20-7.2s-7.4-11.2-7.4-19.2c0-8.5 3-15.4 9.1-20.6s14.2-7.8 24.5-7.8c3.4 0 6.9.3 10.6.8s7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3s-7.3 2-10.8 3.4c-1.6.7-2.8 1.1-3.5 1.3s-1.2.3-1.6.3c-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5s1.4-1.4 2.8-2.1Q28.75 5 36.1 3.2C41 1.9 46.2 1.3 51.7 1.3c11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8s6.8-3.4 9.5-6.4c1.6-1.9 2.8-4 3.4-6.4s1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7s-6.3-.6-9.4-.6c-6.7 0-11.6 1.3-14.9 4s-4.9 6.5-4.9 11.5c0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7m80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9s2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6s-.3 1.4-.7 2.5l-24.1 77.3q-.9 3-2.1 3.9c-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1s-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4s-2.2 1-4 1zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8s-8.9-2.5-11.5-4c-1.6-.9-2.7-1.9-3.1-2.8s-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1q.9 0 1.8.3c.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3s5.2-5.4 5.2-9.5c0-2.8-.9-5.1-2.7-7s-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5q0-6.3 2.7-11.1c1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2s8.2-1.7 12.6-1.7c2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6q2.7.9 4.2 1.8c1.4.8 2.4 1.6 3 2.5q.9 1.2.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2q-8.55-3.9-19.2-3.9c-5.7 0-10.2.9-13.3 2.8s-4.7 4.8-4.7 8.9c0 2.8 1 5.2 3 7.1s5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6s4.6 8.8 4.6 14c0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1"
            fill="currentColor"
          />
          <g>
            <path
              d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6"
              fill="#f59e0b"
            />
            <path
              d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5"
              fill="#f59e0b"
            />
          </g>
        </g>
      </svg>
    ),
  },
  {
    name: "Microsoft Azure",
    render: () => (
      <div className="acad-hero-logo-item">
        <svg viewBox="0 0 24 24" className="acad-hero-logo-mark" fill="currentColor" aria-hidden="true">
          <path d="M13.05 3.2L6.2 19.2H2l6.1-12.5 4.95-3.5zm1.4 1.35L22 19.2h-4.6l-3.1-6.5-3.5 6.5H6.9l7.55-14.65z" />
        </svg>
        <span>Microsoft Azure</span>
      </div>
    ),
  },
  {
    name: "Linux & Docker",
    render: () => (
      <div className="acad-hero-logo-item">
        <svg viewBox="0 0 24 24" className="acad-hero-logo-mark" fill="currentColor" aria-hidden="true">
          <path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h3v2H7V9zm4 0h3v2h-3V9zm4 0h2v2h-2V9zm-8 4h6v2H7v-2z" />
        </svg>
        <span>Linux &amp; Docker</span>
      </div>
    ),
  },
  {
    name: "Terraform",
    render: () => (
      <div className="acad-hero-logo-item">
        <svg viewBox="0 0 24 24" className="acad-hero-logo-mark" fill="currentColor" aria-hidden="true">
          <path d="M8.6 0v7.5l6.5 3.7V3.7L8.6 0zm7.3 4.2v7.5l6.5 3.7V7.9l-6.5-3.7zM1.6 4.2v7.5l6.5 3.7V7.9L1.6 4.2zm7 8.4v7.5l6.5 3.7v-7.5l-6.5-3.7z" />
        </svg>
        <span>Terraform</span>
      </div>
    ),
  },
  {
    name: "Kubernetes",
    render: () => (
      <div className="acad-hero-logo-item">
        <svg viewBox="0 0 24 24" className="acad-hero-logo-mark" fill="currentColor" aria-hidden="true">
          <path d="M12 1.5l-9.2 4.4L.5 15.8l6.3 7.7h10.4l6.3-7.7-2.3-9.9L12 1.5zm0 3.2l5.8 2.8 1.4 6.2-4 4.8H8.8l-4-4.8 1.4-6.2L12 4.7z" />
        </svg>
        <span>Kubernetes</span>
      </div>
    ),
  },
  {
    name: "Python & dbt",
    render: () => (
      <div className="acad-hero-logo-item">
        <svg viewBox="0 0 14 21" className="acad-hero-logo-mark" fill="currentColor" aria-hidden="true">
          <path d="M0 0h14v7H7zm0 7h7l7 7H7v7l-7-7z" />
        </svg>
        <span>Python · SQL · Power BI</span>
      </div>
    ),
  },
];

/* -----------------------------------------------------------------------------
 * 2. CANVAS STAGGERED PHYSICS ENGINE (PixelCanvas)
 * Calibrated outward expansion ripple and subtle ambient shimmer
 * -------------------------------------------------------------------------- */

type Pixel = {
  x: number;
  y: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInt: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  draw: () => void;
  appear: () => void;
  disappear: () => void;
  shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color: string,
  baseSpeed: number,
  delay: number
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const p: Pixel = {
    x,
    y,
    color,
    ctx,
    speed: rand(0.08, 0.36) * baseSpeed,
    size: 0,
    sizeStep: rand(0.12, 0.26),
    minSize: 0.6,
    maxSizeInt: 2,
    maxSize: rand(0.75, 2.1),
    delay,
    counter: 0,
    counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer();
      else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) {
        p.isIdle = true;
        return;
      }
      p.size -= 0.1;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed;
      else p.size += p.speed;
    },
  };

  return p;
}

export type PixelCanvasProps = {
  colors: string[];
  gap?: number;
  speed?: number;
};

export function PixelCanvas({ colors, gap = 10, speed = 28 }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || colors.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    if (w <= 0 || h <= 0) return;

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w * 0.55;
        const dy = y - h * 0.45;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.55;
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode: "appear" | "disappear") => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 45;

    const loop = (now: number) => {
      animationRef.current = requestAnimationFrame(loop);

      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();

      if (pixels.every((p) => p.isIdle)) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();

    const resizeObserver = new ResizeObserver(() => init());
    if (wrapRef.current) resizeObserver.observe(wrapRef.current);

    animate("appear");

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="acad-hero-pixel-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="acad-hero-pixel-canvas" />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 3. ANIMATED MESH GRADIENT SHADER (MeshGradient)
 * Organic multi-stop animated canvas mesh matching the Academy palette
 * -------------------------------------------------------------------------- */

export interface MeshGradientProps {
  colors?: string[];
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  speed?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  proportion?: number;
  shape?: "edge" | "wave" | "circle";
  shapeScale?: number;
  scale?: number;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const MeshGradient = React.memo(function MeshGradient({
  colors: colorsProp,
  color1 = "#4c9bff",
  color2 = "#1f4fd8",
  color3 = "#0a1a4a",
  color4 = "#f5b82e",
  speed = 1,
  swirl = 0.57,
  scale = 1.45,
  rotation = 120,
  className = "",
  style,
}: MeshGradientProps) {
  const colors = useMemo(() => {
    if (colorsProp && colorsProp.length > 0) return colorsProp;
    const list = [color1, color2, color3];
    if (color4) list.push(color4);
    return list;
  }, [colorsProp, color1, color2, color3, color4]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();

    const renderFrame = (now: number) => {
      const t = reduced ? 0 : ((now - start) * 0.00065 * speed);
      const w = canvas.width;
      const h = canvas.height;

      // Base deep navy fill
      ctx.fillStyle = colors[2] || "#0a1a4a";
      ctx.fillRect(0, 0, w, h);

      // Animated organic mesh nodes
      const nodes = [
        {
          color: colors[0] || "#4c9bff",
          x: w * (0.28 + 0.22 * Math.cos(t * 1.1 + rotation * 0.01)),
          y: h * (0.26 + 0.2 * Math.sin(t * 0.9)),
          r: Math.max(w, h) * 0.62 * (scale / 1.45),
        },
        {
          color: colors[1] || "#1f4fd8",
          x: w * (0.74 + 0.2 * Math.sin(t * 0.85 + swirl * 3)),
          y: h * (0.64 + 0.22 * Math.cos(t * 1.05)),
          r: Math.max(w, h) * 0.68 * (scale / 1.45),
        },
        {
          color: colors[3] || "#f5b82e",
          x: w * (0.82 + 0.14 * Math.cos(t * 1.35 + 2.1)),
          y: h * (0.2 + 0.16 * Math.sin(t * 1.15 + 1.2)),
          r: Math.max(w, h) * 0.42,
        },
      ];

      ctx.globalCompositeOperation = "screen";
      for (const node of nodes) {
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r);
        grad.addColorStop(0, node.color);
        grad.addColorStop(1, "rgba(10, 26, 74, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";

      if (!reduced) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [colors, speed, swirl, scale, rotation]);

  return (
    <div className={`acad-hero-mesh-wrap ${className}`.trim()} style={style} aria-hidden="true">
      <canvas ref={canvasRef} width={480} height={360} className="acad-hero-mesh-canvas" />
    </div>
  );
});

/* -----------------------------------------------------------------------------
 * 4. ACADEMY HERO SECTION
 * Inspired by the 3 provided editorial/architectural references + animated canvas
 * Strict Flexbox layout (no CSS grid), no "live cohort" copy, zero fake metrics
 * -------------------------------------------------------------------------- */

const CAPABILITY_PILLS: Array<{ label: string; category: AcademyCategory }> = [
  { label: "+SQL & Power BI", category: "Data & BI" },
  { label: "+IT Support & Linux", category: "Cloud & DevOps" },
  { label: "+AWS & Terraform", category: "Cloud & DevOps" },
  { label: "+Cybersecurity", category: "Cybersecurity" },
  { label: "+Python & AI", category: "Data & Automation" },
];

export interface AcademyHeroProps {
  courseCount: number;
  isAuthenticated?: boolean;
  onSelectTrack?: (category: AcademyCategory) => void;
}

export function AcademyHero({
  courseCount,
  isAuthenticated = false,
  onSelectTrack,
}: AcademyHeroProps) {
  const pixelColors = useMemo(
    () => [
      "rgba(45, 79, 214, 0.22)",
      "rgba(76, 155, 255, 0.26)",
      "rgba(15, 37, 87, 0.14)",
      "rgba(245, 184, 46, 0.25)",
    ],
    []
  );

  const handleSkillClick = (category: AcademyCategory) => {
    if (onSelectTrack) {
      onSelectTrack(category);
    } else {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="acad-hero2" aria-labelledby="acad-hero2-title">
      {/* Staggered Outward Ripple Pixel Canvas Backdrop */}
      <PixelCanvas colors={pixelColors} gap={11} speed={26} />
      <div className="acad-hero2-vignette" aria-hidden="true" />

      <div className="container">
        {/* Main Two-Column Flexbox Stage */}
        <div className="acad-hero2-stage">
          {/* ============ LEFT EDITORIAL COLUMN ============ */}
          <motion.div
            className="acad-hero2-left"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Monumental Display Headline with Inline Overlapping Portraits */}
            <h1 id="acad-hero2-title" className="acad-hero2-title">
              <span className="acad-hero2-title-line">LEARN THE</span>
              <span className="acad-hero2-title-line acad-hero2-title-inline">
                <span>CLOUD</span>
                <span className="acad-hero2-avatar-pill" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/academy/portrait_sm.webp" alt="" width={38} height={38} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/academy/portrait_lg.webp" alt="" width={38} height={38} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/academy/hero-avatar-3.jpg" alt="" width={38} height={38} />
                </span>
                <span className="acad-hero2-title-accent">&amp; DATA</span>
              </span>
              <span className="acad-hero2-title-line">SKILLS CAREERS NEED.</span>
            </h1>

            {/* Concise System Description */}
            <p className="acad-hero2-lead">
              Practical online courses in IT Support, Data Analysis, Cloud &amp; DevOps,
              Cybersecurity, Python, and Applied AI. Learn through live workshops or self-paced
              labs, pay in 2 flexible installments, and graduate with verifiable credentials.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="acad-hero2-actions">
              <Link
                href="#catalog"
                className="acad-hero2-btn-primary"
              >
                <span>Explore Courses</span>
                <span className="acad-hero2-btn-arrow" aria-hidden="true">
                  <ArrowRight size={16} />
                </span>
              </Link>
              <Link
                href={isAuthenticated ? "/academy/learn" : "/academy/get-started"}
                className="btn btn-outline"
                style={{ borderRadius: "999px", padding: "12px 22px", fontWeight: 700 }}
              >
                <span>{isAuthenticated ? "Open Learner Workspace" : "Find My Career Path"}</span>
              </Link>
            </div>

            {/* Authentic System Proof Row with Vertical Hairline Dividers */}
            <div className="acad-hero2-metrics" aria-label="Individual learning benefits">
              <div className="acad-hero2-metric">
                <strong className="acad-nums">100%</strong>
                <span>Hands-On Portfolio Labs</span>
              </div>
              <div className="acad-hero2-metric-divider" aria-hidden="true" />
              <div className="acad-hero2-metric">
                <strong className="acad-nums">Flexible</strong>
                <span>Live &amp; Self-Paced Tracks</span>
              </div>
              <div className="acad-hero2-metric-divider" aria-hidden="true" />
              <div className="acad-hero2-metric">
                <strong className="acad-nums">2-Part</strong>
                <span>Regional Installments</span>
              </div>
            </div>
          </motion.div>

          {/* ============ RIGHT ARCHITECTURAL & TELEMETRY STAGE ============ */}
          <motion.div
            className="acad-hero2-right"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Upper Architectural Frame with Slatted Fins + MeshGradient + Portrait + Floating Cards */}
            <div className="acad-hero2-visual-top">
              {/* Architectural Corrugated Fins (Inspired by Image 1) */}
              <div className="acad-hero2-fin acad-hero2-fin-silver" aria-hidden="true" />
              <div className="acad-hero2-fin acad-hero2-fin-gold" aria-hidden="true" />

              {/* Main Visual Card */}
              <div className="acad-hero2-portrait-frame">
                <MeshGradient
                  color1="#4c9bff"
                  color2="#1f4fd8"
                  color3="#0a1a4a"
                  color4="#f5b82e"
                  speed={1}
                  swirl={0.57}
                  scale={1.45}
                  rotation={120}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/academy/hero-engineering.jpg"
                  alt="Software and cloud engineers collaborating over production code and analytics workflows"
                  width={640}
                  height={460}
                  className="acad-hero2-portrait-img"
                />
                <div className="acad-hero2-portrait-scrim" aria-hidden="true" />
              </div>

              {/* Top-Right Stacked Capability Badges */}
              <div className="acad-hero2-check-stack">
                <div className="acad-hero2-check-pill">
                  <CheckCircle2 size={15} />
                  <span>Hands-On Portfolio Labs</span>
                </div>
                <div className="acad-hero2-check-pill">
                  <ShieldCheck size={15} />
                  <span>Flexible 2-Part Installments</span>
                </div>
              </div>

              {/* Floating Blue Accent Card */}
              <div className="acad-hero2-blue-card">
                <strong className="acad-nums">{String(courseCount).padStart(2, "0")}</strong>
                <span>Individual IT &amp; Tech Courses</span>
              </div>

              {/* Interactive Focus Your Stack Card */}
              <div className="acad-hero2-skills-card">
                <div className="acad-hero2-skills-head">
                  <Award size={15} />
                  <span>Explore by Topic</span>
                </div>
                <div className="acad-hero2-skills-list">
                  {CAPABILITY_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => handleSkillClick(pill.category)}
                      className="acad-hero2-skill-chip"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Dark Architectural Progression Card with Rising Bars */}
            <div className="acad-hero2-telemetry-card">
              <MeshGradient
                className="acad-hero2-telemetry-mesh"
                color1="#4c9bff"
                color2="#1f4fd8"
                color3="#0a1a4a"
                color4="#f5b82e"
                speed={0.85}
                swirl={0.6}
                scale={1.35}
                rotation={140}
              />
              <div className="acad-hero2-telemetry-copy">
                <div className="acad-hero2-telemetry-kicker">
                  <span>Your Learning Progression</span>
                </div>
                <div className="acad-hero2-telemetry-title">
                  Guided labs, portfolio capstone &amp; verifiable career badge
                </div>
              </div>

              <div className="acad-hero2-telemetry-bars" aria-hidden="true">
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-1" />
                  <span>Labs</span>
                </div>
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-2" />
                  <span>Portfolio</span>
                </div>
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-3" />
                  <span>Certified</span>
                </div>
              </div>

              <div className="acad-hero2-telemetry-badge" aria-hidden="true">
                <TrendingUp size={16} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============ BOTTOM VECTOR TOOLCHAIN MARQUEE BAR ============ */}
        <div className="acad-hero2-marquee-row">
          <div className="acad-hero2-marquee-label">
            <span>Tools &amp; Platforms You Will Master</span>
          </div>

          <div className="acad-hero2-marquee-viewport">
            <div className="acad-hero2-marquee-track">
              <div className="acad-hero2-marquee-group">
                {BRAND_LOGOS.map((item) => (
                  <div key={item.name} className="acad-hero2-marquee-slot">
                    {item.render()}
                  </div>
                ))}
              </div>
              <div className="acad-hero2-marquee-group" aria-hidden="true">
                {BRAND_LOGOS.map((item) => (
                  <div key={`dup-${item.name}`} className="acad-hero2-marquee-slot">
                    {item.render()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default AcademyHero;
