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
              The online learning and credentialing platform of {SITE_CONFIG.COMPANY}, delivering practical IT, Data, Cloud, AI, and Cybersecurity courses for individual learners alongside private engineering enablement for businesses.
            </p>
          </div>

          <div>
            <h3>For Individuals</h3>
            <ul>
              <li>
                <Link href="/academy#catalog">Individual Course Catalog</Link>
              </li>
              <li>
                <Link href="/academy/get-started">Career Track Finder</Link>
              </li>
              <li>
                <Link href="/academy/tuition">Tuition &amp; Installment Plans</Link>
              </li>
              <li>
                <Link href="/academy/learn">Learner Workspace</Link>
              </li>
              <li>
                <Link href="/academy/signin">Individual Sign In</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>For Businesses &amp; Credentials</h3>
            <ul>
              <li>
                <Link href="/academy/corporate">Corporate Team Training Hub</Link>
              </li>
              <li>
                <Link href="/academy/tuition?mode=corporate">Team Seat Quote Calculator</Link>
              </li>
              <li>
                <Link href="/academy/corporate#request-demo">Schedule Team Consultation</Link>
              </li>
              <li>
                <Link href="/academy/corporate/signin">Corporate Admin Sign In</Link>
              </li>
              <li>
                <Link href="/academy/verify">Verify a Certificate</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Elites Tech Solutions</h3>
            <ul>
              <li>
                <Link href="/">Company Home</Link>
              </li>
              <li>
                <Link href="/services">Cloud &amp; DevOps Consulting</Link>
              </li>
              <li>
                <Link href="/contact">Contact Admissions &amp; Support</Link>
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
