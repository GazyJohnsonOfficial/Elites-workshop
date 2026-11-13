import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { CookieManageButton } from "@/components/CookieManageButton";

export const metadata: Metadata = {
  title: `Cookie Policy | ${SITE_CONFIG.COMPANY}`,
  description:
    "How Elites Tech Solutions LLC uses minimal essential browser storage, avoids third-party advertising trackers, hosts assets first-party, and lets you manage consent.",
};

export default function CookiesPage() {
  return (
    <main id="main">
      <section className="legal-hero">
        <div className="container">
          <h1>Cookie Policy</h1>
          <p>
            How Elites Tech Solutions LLC maintains a minimal browser footprint, hosts site assets
            first-party, excludes third-party ad trackers, and gives you full control over your
            privacy choices.
          </p>
          <div className="legal-meta-bar">
            <span>
              <strong>Last updated:</strong> November 13, 2026
            </span>
            <span>
              <strong>Entity:</strong> {SITE_CONFIG.COMPANY}
            </span>
            <span>
              <strong>Scope:</strong> Public Website &amp; Client Services
            </span>
          </div>
        </div>
      </section>

      <div className="container legal-wrap">
        <aside>
          <nav className="toc" aria-label="On this page">
            <h2>On This Page</h2>
            <ol>
              <li><a href="#what">1. Overview &amp; Scope</a></li>
              <li><a href="#categories">2. Browser Storage Categories</a></li>
              <li><a href="#hosting">3. Zero Ad Tracking &amp; First-Party Hosting</a></li>
              <li><a href="#manage">4. Managing Your Preferences</a></li>
              <li><a href="#contact">5. Contact Information</a></li>
            </ol>

            <div className="toc-related">
              <h3>Related Policies</h3>
              <div className="toc-related-links">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
              </div>
            </div>
          </nav>
        </aside>

        <article className="legal">
          <h2 id="what">1. Overview &amp; Scope</h2>
          <p>
            {SITE_CONFIG.COMPANY} (&quot;Elites Tech Solutions,&quot; &quot;we,&quot; or &quot;our&quot;)
            is engineered around a minimal browser footprint. Rather than placing invasive tracking
            files across visitor devices, we restrict browser storage strictly to essential
            functionality and honoring the privacy preferences you explicitly select.
          </p>
          <p>
            In this policy, references to &quot;cookies&quot; include standard HTTP cookies as well
            as equivalent browser storage technologies such as local storage. Please review our{" "}
            <Link href="/privacy">Privacy Policy</Link> for full details on how information
            submitted through consultation inquiries or program registrations is processed.
          </p>

          <h2 id="categories">2. Browser Storage Categories</h2>
          <p>
            Across public pages, client-side storage is strictly segmented into two clear categories
            so visitors know exactly how their device is used:
          </p>

          <div className="ck-cat-grid">
            <section className="ck-cat-card">
              <h3>Essential Preference Storage</h3>
              <p>
                Remembers whether you chose essential-only mode or enabled optional preferences,
                preventing repeated consent prompts while supporting reliable site navigation and
                form interactions.
              </p>
              <span className="ck-cat-meta">Retention: Up to 12 months · Strictly necessary</span>
            </section>

            <section className="ck-cat-card">
              <h3>Optional Analytics Preferences</h3>
              <p>
                Disabled by default until you explicitly opt in. When enabled, supports aggregate
                usage insights to improve service pages and training information without creating
                individual visitor or advertising profiles.
              </p>
              <span className="ck-cat-meta">Status: Opt-in only · Off by default</span>
            </section>
          </div>

          <p>
            Protective anti-abuse checks on our inquiry, registration, and newsletter workflows run
            on our servers without installing persistent third-party tracking cookies on your
            device.
          </p>

          <h2 id="hosting">3. Zero Ad Tracking &amp; First-Party Hosting</h2>
          <p>
            Our digital infrastructure enforces strict privacy boundaries so visiting our website
            does not silently expose your browsing activity to external marketing vendors:
          </p>
          <ul>
            <li>
              <strong>Zero Third-Party Ad Trackers:</strong> We do not run behavioral advertising
              networks, cross-site retargeting pixels, affiliate beacons, or social media tracking
              tags anywhere on this website.
            </li>
            <li>
              <strong>First-Party Asset Hosting:</strong> All typography, iconography, stylesheets,
              and media assets are hosted directly from our own domain rather than loaded from
              external third-party font or script providers that log visitor IP addresses.
            </li>
            <li>
              <strong>Minimal Browser Footprint &amp; No Data Brokerage:</strong> Client-side
              storage is limited solely to your consent state, and we never sell, rent, or trade
              browsing information with data brokers or marketing aggregators.
            </li>
          </ul>

          <h2 id="manage">4. Managing Your Preferences</h2>
          <p>
            You can review your current privacy selection or update optional consent settings at
            any time using the preference control panel below or via the{" "}
            <strong>Cookie settings</strong> link in the footer of every page.
          </p>

          <CookieManageButton />

          <p>
            You can also clear or block browser storage and cookies directly through your web
            browser privacy settings (including Google Chrome, Microsoft Edge, Apple Safari, and
            Mozilla Firefox). Clearing site storage removes your saved consent choice, and the
            preference banner will appear cleanly on your next visit so you can set a fresh
            preference.
          </p>

          <h2 id="contact">5. Contact Information</h2>
          <p>
            Questions regarding this Cookie Policy or requests related to digital privacy may be
            directed to our team:
          </p>
          <div className="legal-contact-card">
            <div className="legal-contact-item">
              <span>Privacy &amp; Compliance Email</span>
              <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a>
            </div>
            <div className="legal-contact-item">
              <span>Corporate Telephone</span>
              <a href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}>
                {SITE_CONFIG.CONTACT.PHONE_DISPLAY}
              </a>
            </div>
            <div className="legal-contact-item">
              <span>Operating Jurisdictions</span>
              <strong>United States · United Kingdom · Ghana</strong>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
