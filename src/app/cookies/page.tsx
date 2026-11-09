import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Cookie Policy | ${SITE_CONFIG.COMPANY}`,
  description:
    "Explanation of how Elites Tech Solutions LLC uses essential storage and optional analytics preferences on our website.",
};

export default function CookiesPage() {
  return (
    <main id="main">
      <section className="legal-hero">
        <div className="container">
          <h1>Cookie Policy</h1>
          <p>What this website stores on your device, why, and how you can control it.</p>
          <p className="updated">Last updated: 4 November 2026</p>
        </div>
      </section>

      <div className="container legal-wrap">
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            <li><a href="#what">1. What this policy covers</a></li>
            <li><a href="#used">2. What we store on your device</a></li>
            <li><a href="#not">3. What we do not use</a></li>
            <li><a href="#manage">4. Managing your choices</a></li>
            <li><a href="#contact">5. Contact us</a></li>
          </ol>
        </nav>

        <article className="legal">
          <h2 id="what">1. What this policy covers</h2>
          <p>
            Cookies and storage technologies allow websites to function securely and preserve user
            preferences. This policy explains what our website stores and why.
          </p>

          <h2 id="used">2. What we store on your device</h2>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Items stored on device">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>ets_consent</code></td>
                  <td>Local storage</td>
                  <td>Stores your cookie and analytics preference choices.</td>
                  <td>12 months</td>
                  <td>Essential</td>
                </tr>
                <tr>
                  <td><code>ets_admin_token</code></td>
                  <td>HTTP-only Cookie</td>
                  <td>Secures authenticated staff sessions on the operations portal.</td>
                  <td>7 days</td>
                  <td>Essential</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="not">3. What we do not use</h2>
          <ul>
            <li>No third-party tracking or behavioral advertising pixels.</li>
            <li>No data sharing or sale to data brokers.</li>
            <li>All core fonts and assets are hosted directly from this domain.</li>
          </ul>

          <h2 id="contact">5. Contact us</h2>
          <p>
            Email: <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a><br />
            Phone: <a href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</a>
          </p>
        </article>
      </div>
    </main>
  );
}

