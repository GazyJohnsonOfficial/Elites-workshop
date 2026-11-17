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

const BRAND_LOGOS: Array<{ name: string; render: () => React.ReactNode }> = [
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
    name: "Next.js",
    render: () => (
      <svg
        className="acad-hero-logo-svg acad-hero-logo-nextjs"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 394 79"
        aria-label="Next.js"
      >
        <path fill="currentColor" d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z" />
        <path fill="currentColor" d="M149.052 0.0330722V12.7H94.0421V33.0772H138.281V45.7441H94.0421V66.6721H149.052V79.339H80.43V12.7H80.4243V0.0330722H149.052Z" />
        <path fill="currentColor" d="M183.32 0.0661486H165.506L229.312 79.3721H247.178L215.271 39.7464L247.127 0.126654L229.312 0.154184L206.352 28.6697L183.32 0.0661486Z" />
        <path fill="currentColor" d="M201.6 56.7148L192.679 45.6229L165.455 79.4326H183.32L201.6 56.7148Z" />
        <path
          fill="currentColor"
          clipRule="evenodd"
          d="M80.907 79.339L17.0151 0H0V79.3059H13.6121V16.9516L63.8067 79.339H80.907Z"
          fillRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    render: () => (
      <svg
        className="acad-hero-logo-svg acad-hero-logo-tailwind"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 262 33"
        aria-label="Tailwind CSS"
      >
        <path
          fill="#0ea5e9"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25.004 7.263 26.472 8.754 28.097 10.403C30.744 13.09 33.808 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.496 8.937 41.028 7.446 39.403 5.797C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.504 23.464 12.972 24.954 14.597 26.603C17.244 29.29 20.308 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C28.996 25.137 27.528 23.646 25.903 21.997C23.256 19.31 20.192 16.2 13.5 16.2Z"
        />
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M80.996 13.652H76.284V22.772C76.284 25.204 77.88 25.166 80.996 25.014V28.7C74.688 29.46 72.18 27.712 72.18 22.772V13.652H68.684V9.69996H72.18V4.59596L76.284 3.37996V9.69996H80.996V13.652ZM98.958 9.69996H103.062V28.7H98.958V25.964C97.514 27.978 95.272 29.194 92.308 29.194C87.14 29.194 82.846 24.824 82.846 19.2C82.846 13.538 87.14 9.20596 92.308 9.20596C95.272 9.20596 97.514 10.422 98.958 12.398V9.69996ZM92.954 25.28C96.374 25.28 98.958 22.734 98.958 19.2C98.958 15.666 96.374 13.12 92.954 13.12C89.534 13.12 86.95 15.666 86.95 19.2C86.95 22.734 89.534 25.28 92.954 25.28ZM109.902 6.84996C108.458 6.84996 107.28 5.63396 107.28 4.22796C107.281 3.53297 107.558 2.86682 108.049 2.37539C108.541 1.88395 109.207 1.60728 109.902 1.60596C110.597 1.60728 111.263 1.88395 111.755 2.37539C112.246 2.86682 112.523 3.53297 112.524 4.22796C112.524 5.63396 111.346 6.84996 109.902 6.84996ZM107.85 28.7V9.69996H111.954V28.7H107.85ZM116.704 28.7V0.959961H120.808V28.7H116.704ZM147.446 9.69996H151.778L145.812 28.7H141.784L137.832 15.894L133.842 28.7H129.814L123.848 9.69996H128.18L131.866 22.81L135.856 9.69996H139.77L143.722 22.81L147.446 9.69996ZM156.87 6.84996C155.426 6.84996 154.248 5.63396 154.248 4.22796C154.249 3.53297 154.526 2.86682 155.017 2.37539C155.509 1.88395 156.175 1.60728 156.87 1.60596C157.565 1.60728 158.231 1.88395 158.723 2.37539C159.214 2.86682 159.491 3.53297 159.492 4.22796C159.492 5.63396 158.314 6.84996 156.87 6.84996ZM154.818 28.7V9.69996H158.922V28.7H154.818ZM173.666 9.20596C177.922 9.20596 180.962 12.094 180.962 17.034V28.7H176.858V17.452C176.858 14.564 175.186 13.044 172.602 13.044C169.904 13.044 167.776 14.64 167.776 18.516V28.7H163.672V9.69996H167.776V12.132C169.03 10.156 171.082 9.20596 173.666 9.20596ZM200.418 2.09996H204.522V28.7H200.418V25.964C198.974 27.978 196.732 29.194 193.768 29.194C188.6 29.194 184.306 24.824 184.306 19.2C184.306 13.538 188.6 9.20596 193.768 9.20596C196.732 9.20596 198.974 10.422 200.418 12.398V2.09996ZM194.414 25.28C197.834 25.28 200.418 22.734 200.418 19.2C200.418 15.666 197.834 13.12 194.414 13.12C190.994 13.12 188.41 15.666 188.41 19.2C188.41 22.734 190.994 25.28 194.414 25.28Z"
        />
      </svg>
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
  { label: "+AWS & Terraform", category: "Cloud & DevOps" },
  { label: "+Zero-Trust IAM", category: "Cybersecurity" },
  { label: "+Python ETL", category: "Data & Automation" },
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
              <span className="acad-hero2-title-line">BUILD THE</span>
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
              <span className="acad-hero2-title-line">SYSTEMS TEAMS SHIP.</span>
            </h1>

            {/* Concise System Description */}
            <p className="acad-hero2-lead">
              Structured practitioner curricula in data analytics, cloud automation, cybersecurity
              governance, and Python engineering. Complete architecture capstones backed by
              employer-verifiable credentials.
            </p>

            {/* Primary Pill/Rounded CTA */}
            <div className="acad-hero2-actions">
              <Link
                href={isAuthenticated ? "#catalog" : "/academy/get-started"}
                className="acad-hero2-btn-primary"
              >
                <span>{isAuthenticated ? "Browse Curricula" : "Get Started"}</span>
                <span className="acad-hero2-btn-arrow" aria-hidden="true">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>

            {/* Authentic System Proof Row with Vertical Hairline Dividers (Inspired by Images 1 & 2) */}
            <div className="acad-hero2-metrics" aria-label="Academy platform specifications">
              <div className="acad-hero2-metric">
                <strong className="acad-nums">100%</strong>
                <span>Project-Driven Practice</span>
              </div>
              <div className="acad-hero2-metric-divider" aria-hidden="true" />
              <div className="acad-hero2-metric">
                <strong className="acad-nums">Production</strong>
                <span>System Architectures</span>
              </div>
              <div className="acad-hero2-metric-divider" aria-hidden="true" />
              <div className="acad-hero2-metric">
                <strong className="acad-nums">Verifiable</strong>
                <span>Digital Credentials</span>
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

              {/* Top-Right Stacked Capability Badges (Inspired by Image 2) */}
              <div className="acad-hero2-check-stack">
                <div className="acad-hero2-check-pill">
                  <CheckCircle2 size={15} />
                  <span>Hands-On Capstone Labs</span>
                </div>
                <div className="acad-hero2-check-pill">
                  <ShieldCheck size={15} />
                  <span>Individual &amp; Enterprise Portals</span>
                </div>
              </div>

              {/* Floating Blue Accent Card (Inspired by Image 2's 50+ Blue Square) */}
              <div className="acad-hero2-blue-card">
                <strong className="acad-nums">{String(courseCount).padStart(2, "0")}</strong>
                <span>Structured Technical Curricula</span>
              </div>

              {/* Interactive "Focus Your Stack" Card (Inspired by Image 2's "Add your Skills" Card) */}
              <div className="acad-hero2-skills-card">
                <div className="acad-hero2-skills-head">
                  <Award size={15} />
                  <span>Select a Capability Track</span>
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

            {/* Bottom Dark Architectural Progression Card with Rising Bars (Inspired by Image 3) */}
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
                  <span>Execution Architecture</span>
                </div>
                <div className="acad-hero2-telemetry-title">
                  Applied labs, syllabus milestones &amp; verifiable registry output
                </div>
              </div>

              <div className="acad-hero2-telemetry-bars" aria-hidden="true">
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-1" />
                  <span>Labs</span>
                </div>
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-2" />
                  <span>Capstone</span>
                </div>
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-3" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="acad-hero2-telemetry-badge" aria-hidden="true">
                <TrendingUp size={16} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============ BOTTOM VECTOR TOOLCHAIN MARQUEE BAR (Inspired by Image 3 & Snippet 1) ============ */}
        <div className="acad-hero2-marquee-row">
          <div className="acad-hero2-marquee-label">
            <span>Enterprise Toolchains &amp; Cloud Ecosystems</span>
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
