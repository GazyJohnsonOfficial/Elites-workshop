"use client";

import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/config";

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    mins: string;
    secs: string;
    done: boolean;
  }>({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
    done: false,
  });

  useEffect(() => {
    const target = Date.parse(SITE_CONFIG.PROGRAMME.START_DATE_ISO);
    const pad = (n: number) => String(n).padStart(2, "0");

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", mins: "00", secs: "00", done: true });
        return false;
      }
      const s = Math.floor(diff / 1000);
      setTimeLeft({
        days: pad(Math.floor(s / 86400)),
        hours: pad(Math.floor((s % 86400) / 3600)),
        mins: pad(Math.floor((s % 3600) / 60)),
        secs: pad(s % 60),
        done: false,
      });
      return true;
    };

    tick();
    const timer = setInterval(() => {
      if (!tick()) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft.done) {
    return (
      <div className="countdown-wrap">
        <p className="countdown-sub" style={{ margin: 0, fontWeight: 700, color: "var(--gold)" }}>
          The current cohort has started. Contact admissions for the next intake!
        </p>
      </div>
    );
  }

  return (
    <div className="countdown-wrap">
      <div className="countdown" id="countdown" aria-label="Countdown to programme start">
        <div className="cd-box">
          <span className="cd-num" id="cd-days">{timeLeft.days}</span>
          <span className="cd-label">Days</span>
        </div>
        <span className="cd-colon" aria-hidden="true">:</span>
        <div className="cd-box">
          <span className="cd-num" id="cd-hours">{timeLeft.hours}</span>
          <span className="cd-label">Hours</span>
        </div>
        <span className="cd-colon" aria-hidden="true">:</span>
        <div className="cd-box">
          <span className="cd-num" id="cd-mins">{timeLeft.mins}</span>
          <span className="cd-label">Mins</span>
        </div>
        <span className="cd-colon" aria-hidden="true">:</span>
        <div className="cd-box">
          <span className="cd-num" id="cd-secs">{timeLeft.secs}</span>
          <span className="cd-label">Secs</span>
        </div>
      </div>
      <p className="countdown-sub">
        Starts {SITE_CONFIG.PROGRAMME.START_DATE_TEXT} · Live sessions on Zoom
      </p>
    </div>
  );
}

