"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Sprite";

export function ScrollEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Add js and reveal-all classes to guarantee nothing is ever hidden or blank
    document.documentElement.classList.add("js", "reveal-all");

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, y / max) : 0);
      setShowTopBtn(y > 500);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Ensure all reveal elements are marked visible immediately on any route change
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => {
      el.classList.add("in", "visible");
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="progress"
        aria-hidden="true"
        style={{
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: "left center",
        }}
      />
      <button
        type="button"
        className={`to-top ${showTopBtn ? "show" : ""}`}
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <Icon id="i-arrow-up" />
      </button>
    </>
  );
}
