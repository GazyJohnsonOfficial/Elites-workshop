import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Training | ${SITE_CONFIG.COMPANY}`,
  description:
    "Practical IT training for corporate teams, individual professionals, and career switchers. Live online sessions shaped around modern industry tools.",
};

export default function TrainingPage() {
  return (
    <main id="main">
      {/* ============ PHERO ============ */}
      <section className="phero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Training</li>
          </ol>
          <p className="eyebrow">Training</p>
          <h1>Training that builds real, usable skills</h1>
          <p>
            Practical, live training for teams and individuals, shaped around the tools and
            roles you work with.
          </p>
        </div>
      </section>

      {/* ============ TRACKS ============ */}
      <section className="section">
        <div className="container">
          <div className="sec-head reveal">
            <p className="eyebrow">Ways to learn</p>
            <h2>Training for teams and for individuals</h2>
          </div>
          <div className="tracks">
            <article className="track reveal" id="corporate">
              <span className="svc-ico">
                <Icon id="i-building" />
              </span>
              <h3>Corporate training</h3>
              <p>
                Training for your team, tailored to your tools, your level and your goals, for
                organisations of any size.
              </p>
              <ul className="check-list compact">
                <li>Content agreed with you in advance</li>
                <li>Live, practical sessions</li>
                <li>Suitable for departments and whole organisations</li>
              </ul>
            </article>

            <article className="track reveal" id="individual">
              <span className="svc-ico">
                <Icon id="i-user" />
              </span>
              <h3>Individual training</h3>
              <p>
                Programmes for professionals and career changers who want to learn a skill properly
                and apply it straight away.
              </p>
              <ul className="check-list compact">
                <li>Live online sessions</li>
                <li>Hands-on exercises</li>
                <li>Open to learners anywhere</li>
              </ul>
            </article>

            <article className="track reveal" id="career">
              <span className="svc-ico">
                <Icon id="i-compass" />
              </span>
              <h3>Career sessions</h3>
              <p>
                Guidance for people building or changing a career in IT, from choosing a
                direction to planning the next step.
              </p>
              <ul className="check-list compact">
                <li>Direction and skills planning</li>
                <li>For beginners and experienced staff</li>
                <li>One-to-one or group</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROGRAMME ============ */}
      <section className="section section-tint" id="featured">
        <div className="container">
          <div className="featured reveal">
            <div>
              <p className="eyebrow">Upcoming programme</p>
              <h2>{SITE_CONFIG.PROGRAMME.NAME}</h2>
              <p>
                From messy data to decision-ready insight in three months. Live on Zoom, three
                one-hour sessions a week, starting {SITE_CONFIG.PROGRAMME.START_DATE_TEXT}.
              </p>
              <ul className="chips-row">
                <li>
                  <Icon id="i-db" /> SQL
                </li>
                <li>
                  <Icon id="i-code" /> Python
                </li>
                <li>
                  <Icon id="i-table" /> Excel and VBA
                </li>
                <li>
                  <Icon id="i-workflow" /> Alteryx
                </li>
                <li>
                  <Icon id="i-chart" /> Tableau
                </li>
                <li>
                  <Icon id="i-pie-chart" /> Power BI
                </li>
              </ul>
              <div className="ahero-actions">
                <Link href="/data-analysis#register" className="btn btn-gold btn-lg">
                  Register now
                </Link>
                <Link href="/data-analysis" className="btn btn-outline btn-lg">
                  View curriculum
                </Link>
                <Link href="/tuition" className="more-link">
                  Tuition and fees <Icon id="i-arrow-right" />
                </Link>
              </div>
            </div>
            <ul className="promo-facts">
              <li>
                <Icon id="i-calendar" />
                <span>
                  Starts {SITE_CONFIG.PROGRAMME.START_DATE_TEXT}
                  <small>Registration open now</small>
                </span>
              </li>
              <li>
                <Icon id="i-clock" />
                <span>
                  3 months, 36 live sessions
                  <small>3 sessions a week, 1 hour each</small>
                </span>
              </li>
              <li>
                <Icon id="i-award" />
                <span>
                  Capstone dashboard project
                  <small>A piece of work you can show</small>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ CORPORATE CTA ============ */}
      <section className="cta">
        <div className="container reveal">
          <h2>Want training for your team?</h2>
          <p>Tell us who needs training and on what, and we will propose a programme.</p>
          <div className="ahero-actions">
            <Link
              href="/contact?service=training#enquiry"
              className="btn btn-gold btn-lg"
            >
              Request corporate training
            </Link>
            <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`} className="btn btn-outline btn-lg">
              Email us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
