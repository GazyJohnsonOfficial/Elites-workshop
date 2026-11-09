import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Sprite";

const ENGAGEMENT_PILLARS = [
  "Clear technical plans",
  "Client-owned systems",
  "Practical handover",
];

export function HomeHero() {
  return (
    <section className="hx" aria-labelledby="hx-title">
      <Image
        src="/hero-datacenter.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hx-img"
      />
      <div className="hx-overlay" aria-hidden="true" />
      <div className="hx-atmosphere" aria-hidden="true">
        <span className="hx-glow" />
      </div>

      <div className="container hx-inner">
        <div className="hx-copy">
          <h1 id="hx-title">
            Technology that{" "}
            <span className="hx-accent">moves your organisation forward</span>
          </h1>
          <p className="hx-lead">
            Practical cloud architecture, cybersecurity governance, and data engineering to help your
            team make confident decisions, modernise systems, and retain full technical ownership.
          </p>

          <div className="hx-actions">
            <Link href="/contact#enquiry" className="hx-btn-primary">
              Request a Consultation <Icon id="i-arrow-right" />
            </Link>
            <Link href="/services" className="hx-btn-secondary">
              Explore Our Capabilities <Icon id="i-arrow-right" />
            </Link>
          </div>

          <div className="hx-approach">
            <span className="hx-approach-label">Guiding Principles</span>
            <ul className="hx-trust">
              {ENGAGEMENT_PILLARS.map((pillar) => (
                <li key={pillar}>
                  <Icon id="i-check" /> {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a className="hx-scroll" href="#services" aria-label="Scroll to services">
          <span className="hx-scroll-line" aria-hidden="true" />
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
