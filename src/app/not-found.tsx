import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container not-found-wrap" style={{ textAlign: "center", padding: "100px 16px" }}>
      <strong style={{ fontSize: "6rem", display: "block", color: "var(--navy)", lineHeight: 1 }}>
        404
      </strong>
      <h1 className="nf-title" style={{ marginTop: "16px", marginBottom: "12px" }}>
        We can&apos;t find that page
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "0 auto 28px" }}>
        The link may be outdated or mistyped. You can head back to the home page or contact our team for assistance.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <Link className="btn btn-gold" href="/">
          Back to the home page
        </Link>
        <Link className="btn btn-outline" href="/contact">
          Contact support
        </Link>
      </div>
    </main>
  );
}

