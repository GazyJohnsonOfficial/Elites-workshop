"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", background: "var(--paper)" }}>
      <div className="card" style={{ maxWidth: "440px", width: "100%", padding: "36px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ color: "var(--gold)", marginBottom: "8px" }}>
            <Icon id="i-lock" />
          </div>
          <h1 style={{ fontSize: "1.5rem", color: "var(--navy)", margin: "0 0 6px 0" }}>Staff Portal Login</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: 0 }}>
            {SITE_CONFIG.COMPANY} internal dashboard
          </p>
        </div>

        {error && (
          <div className="alert-error" role="alert" style={{ padding: "10px 14px", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field" style={{ marginBottom: "16px" }}>
            <label htmlFor="admin-email">Staff email</label>
            <input
              id="admin-email"
              type="email"
              required
              autoFocus
              placeholder="admin@elitestechsolutions.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field" style={{ marginBottom: "24px" }}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-md"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              "Sign In to Portal"
            )}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <Link href="/" style={{ fontSize: "0.85rem", color: "var(--blue)" }}>
            ← Back to public website
          </Link>
        </div>
      </div>
    </main>
  );
}

