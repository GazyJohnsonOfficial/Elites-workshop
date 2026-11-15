"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import type { AcademySessionUser } from "./AcademySignInModal";

export function AcademyHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AcademySessionUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/session", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      }
    } catch {
      // Ignore network hiccup
    }
  }, []);

  useEffect(() => {
    loadSession();
    const handler = () => loadSession();
    const openSignInHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: "signin" | "register" }>;
      const mode = customEvent.detail?.mode || "signin";
      router.push(mode === "register" ? "/academy/register" : "/academy/signin");
    };
    window.addEventListener("ets-academy-session-changed", handler);
    window.addEventListener("ets-academy-open-signin", openSignInHandler);
    return () => {
      window.removeEventListener("ets-academy-session-changed", handler);
      window.removeEventListener("ets-academy-open-signin", openSignInHandler);
    };
  }, [loadSession, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await fetch("/api/academy/session", { method: "DELETE" });
    setUser(null);
    window.dispatchEvent(new Event("ets-academy-session-changed"));
    router.refresh();
  };

  const navLinks = [
    { href: "/academy", label: "Catalog", match: (p: string) => p === "/academy" || p.startsWith("/academy/courses") },
    { href: "/academy#paths", label: "Learning Paths", match: () => false },
    { href: "/academy/learn", label: "My Learning", match: (p: string) => p.startsWith("/academy/learn") },
    { href: "/academy/corporate", label: "Corporate", match: (p: string) => p.startsWith("/academy/corporate") },
    { href: "/academy/tuition", label: "Tuition", match: (p: string) => p.startsWith("/academy/tuition") },
  ];

  const accountDestination =
    user?.role === "staff_admin"
      ? "/admin"
      : user?.role === "org_admin"
      ? "/academy/corporate"
      : "/academy/learn";

  if (
    pathname === "/academy/signin" ||
    pathname === "/academy/register" ||
    pathname === "/signin" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <header className="acad-header">
      <div className="container acad-header-inner">
        <Link href="/academy" className="acad-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Elites Tech Academy"
            width={36}
            height={36}
            referrerPolicy="no-referrer"
            className="acad-brand-logo"
          />
          <span className="acad-brand-text">
            Elites Tech <span>Academy</span>
          </span>
        </Link>

        <nav className="acad-nav" aria-label="Academy navigation">
          {navLinks.map((item) => {
            const active = item.match(pathname || "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="acad-nav-link"
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="acad-header-actions">
          {user ? (
            <div className="acad-user-menu">
              <Link href={accountDestination} className="acad-user-link">
                {user.role === "staff_admin" ? <ShieldCheck size={15} /> : <User size={15} />}
                <span>{user.fullName}</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-outline btn-sm"
                title="Sign out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                href="/academy/signin"
                className="btn btn-outline btn-sm"
              >
                Sign In
              </Link>
              <Link
                href="/academy/register"
                className="btn btn-gold btn-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="acad-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`acad-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="acad-mobile-links">
          {navLinks.map((item) => {
            const active = item.match(pathname || "");
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
          <div className="acad-mobile-divider" />
          <Link href="/academy/signin">Sign In Page</Link>
          <Link href="/academy/register">Student Application / Register</Link>
          <Link href="/academy/verify">Verify Certificate</Link>
          <Link href="/admin">Staff Admin Console</Link>
          <Link href="/">Corporate Parent Website</Link>
        </div>
        {user ? (
          <button type="button" onClick={handleSignOut} className="btn btn-outline btn-block btn-sm">
            Sign Out ({user.fullName})
          </button>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <Link href="/academy/signin" className="btn btn-outline btn-block btn-sm">
              Sign In
            </Link>
            <Link href="/academy/register" className="btn btn-gold btn-block btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
