"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";

export function AcademyFooter() {
  const pathname = usePathname();
  if (
    pathname === "/academy/signin" ||
    pathname === "/academy/register" ||
    pathname === "/academy/get-started" ||
    pathname === "/academy/corporate/signin" ||
    pathname === "/academy/corporate/register" ||
    pathname === "/signin" ||
    pathname === "/register" ||
    pathname === "/get-started"
  ) {
    return null;
  }
  return (
    <footer className="acad-footer">
      <div className="container">
        <div className="acad-footer-grid">
          <div>
            <h3>Elites Tech Academy</h3>
            <p className="acad-footer-copy">
              The workforce enablement and credentialing portal of {SITE_CONFIG.COMPANY}, delivering instructor-led practitioner tracks and corporate cloud bootcamps across North America, EMEA, and West Africa.
            </p>
          </div>

          <div>
            <h3>Academy Portals</h3>
            <ul>
              <li>
                <Link href="/academy">Course Catalog</Link>
              </li>
              <li>
                <Link href="/academy/learn">Learner Workspace</Link>
              </li>
              <li>
                <Link href="/academy/corporate">Corporate Team Portal</Link>
              </li>
              <li>
                <Link href="/academy/tuition">Tuition &amp; Seat Quotes</Link>
              </li>
              <li>
                <Link href="/academy/signin">Workspace Sign In</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Credentials &amp; Ops</h3>
            <ul>
              <li>
                <Link href="/academy/verify">Verify a Certificate</Link>
              </li>
              <li>
                <Link href="/academy/get-started">Workspace Setup Guide</Link>
              </li>
              <li>
                <Link href="/academy#paths">Learning Paths</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Corporate Parent</h3>
            <ul>
              <li>
                <Link href="/">Elites Tech Solutions Home</Link>
              </li>
              <li>
                <Link href="/services">Cloud &amp; DevOps Consulting</Link>
              </li>
              <li>
                <Link href="/contact#inquiry">Request Enterprise RFP</Link>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL_ACADEMY}`}>
                  {SITE_CONFIG.CONTACT.EMAIL_ACADEMY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="acad-footer-bottom">
          <span>&copy; 2026 {SITE_CONFIG.COMPANY}. All rights reserved.</span>
          <div className="acad-footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
