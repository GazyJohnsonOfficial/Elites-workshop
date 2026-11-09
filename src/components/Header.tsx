"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/training", label: "Training" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={`site-header ${isScrolled ? "scrolled" : ""}`} id="top">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label={`${SITE_CONFIG.COMPANY} home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="brand-logo"
              src="/logo.png"
              alt={SITE_CONFIG.COMPANY}
              width={54}
              height={54}
            />
            <span className="brand-name">
              Elites Tech Solutions <small>LLC</small>
            </span>
          </Link>

          <button
            className="nav-toggle"
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="main-nav"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav
            id="main-nav"
            className={`main-nav ${isOpen ? "open" : ""}`}
            aria-label="Main"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact#enquiry" className="btn btn-gold btn-sm">
              Request a consultation
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
