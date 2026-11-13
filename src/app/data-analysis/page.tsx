import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { Countdown } from "@/components/Countdown";
import { RegistrationForm } from "@/components/RegistrationForm";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.PROGRAMME.NAME} | ${SITE_CONFIG.COMPANY}`,
  description:
    "A practical, hands-on program that takes working professionals from messy data to clear, decision-ready insights across SQL, Python, Excel, Alteryx, Tableau and Power BI.",
};

export default function DataAnalysisPage() {
  return (
    <main id="main">
      {/* ============ IN-PAGE SUBNAV ============ */}
      <nav className="subnav" aria-label="On this page">
        <div className="container subnav-inner">
          <span>{SITE_CONFIG.PROGRAMME.NAME}</span>
          <a href="#about">About</a>
          <a href="#curriculum">Curriculum</a>
          <a href="#before-you-enrol">Before you enroll</a>
          <a href="#faq">FAQ</a>
          <Link href="/tuition">Tuition and fees</Link>
          <a href="#register" className="btn btn-gold btn-sm">
            Register now
          </a>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="hero" id="home">
        <div className="hero-bg" aria-hidden="true">
          <span className="b1"></span>
          <span className="b2"></span>
          <span className="b3"></span>
        </div>

        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="kicker">Upcoming program · {SITE_CONFIG.COMPANY}</p>
              <h1>
                <span>Data</span>
                <span>Analysis</span>
              </h1>
              <p className="lead">
                A practical, hands-on program that takes working professionals from messy data to
                clear, decision-ready insights across four tools over three months.
              </p>

              <div className="hero-actions">
                <a href="#register" className="btn btn-gold btn-lg">
                  Register now
                </a>
                <a href="#curriculum" className="btn btn-outline btn-lg">
                  View curriculum
                </a>
              </div>

              <ul className="hero-meta">
                <li>
                  <span className="meta-ico">
                    <Icon id="i-calendar" />
                  </span>
                  <div>
                    <strong>Starts {SITE_CONFIG.PROGRAMME.START_DATE_TEXT}</strong>
                    <em>{SITE_CONFIG.PROGRAMME.DURATION} · {SITE_CONFIG.PROGRAMME.SCHEDULE}</em>
                  </div>
                </li>
                <li>
                  <span className="meta-ico">
                    <Icon id="i-video" />
                  </span>
                  <div>
                    <strong>Online</strong>
                    <em>{SITE_CONFIG.PROGRAMME.FORMAT}</em>
                  </div>
                </li>
              </ul>
            </div>

            {/* Decorative composition: dashboard + code */}
            <div className="stage" aria-hidden="true">
              <span className="dots"></span>

              <div className="circle circle-a">
                <div className="dash">
                  <p className="dash-title">Sales Overview</p>
                  <div className="kpis">
                    <div className="kpi">
                      <small>Total Sales</small>
                      <b>$482,321</b>
                      <i>▲ 12.4%</i>
                    </div>
                    <div className="kpi">
                      <small>Total Orders</small>
                      <b>8,642</b>
                      <i>▲ 9.1%</i>
                    </div>
                    <div className="kpi">
                      <small>Avg. Order</small>
                      <b>$55.82</b>
                      <i>▲ 4.8%</i>
                    </div>
                  </div>
                  <div className="dash-row">
                    <div className="panel">
                      <svg viewBox="0 0 120 50" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#19b5e8" />
                            <stop offset="1" stopColor="#2d4fd6" />
                          </linearGradient>
                        </defs>
                        <g fill="url(#gb)" className="bars">
                          <rect x="2" y="38" width="6" height="12" rx="1" />
                          <rect x="11.6" y="32" width="6" height="18" rx="1" />
                          <rect x="21.2" y="35" width="6" height="15" rx="1" />
                          <rect x="30.8" y="26" width="6" height="24" rx="1" />
                          <rect x="40.4" y="30" width="6" height="20" rx="1" />
                          <rect x="50" y="20" width="6" height="30" rx="1" />
                          <rect x="59.6" y="24" width="6" height="26" rx="1" />
                          <rect x="69.2" y="16" width="6" height="34" rx="1" />
                          <rect x="78.8" y="20" width="6" height="30" rx="1" />
                          <rect x="88.4" y="10" width="6" height="40" rx="1" />
                          <rect x="98" y="14" width="6" height="36" rx="1" />
                          <rect x="107.6" y="4" width="6" height="46" rx="1" />
                        </g>
                      </svg>
                    </div>
                    <div className="panel donut">
                      <svg viewBox="0 0 42 42">
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#2d4fd6" strokeWidth="6" strokeDasharray="42 58" strokeDashoffset="25" />
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#19b5e8" strokeWidth="6" strokeDasharray="28 72" strokeDashoffset="-17" />
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#f5b82e" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="-45" />
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#0f2557" strokeWidth="6" strokeDasharray="12 88" strokeDashoffset="-63" />
                      </svg>
                      <ul>
                        <li><s className="dot-a"></s>A 42%</li>
                        <li><s className="dot-b"></s>B 28%</li>
                        <li><s className="dot-c"></s>C 18%</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="circle circle-b">
                <div className="code">
                  <div className="code-bar">
                    <i></i><i></i><i></i><span>analysis.py</span>
                  </div>
                  <pre>
                    <code>
                      <span className="k">import</span> pandas <span className="k">as</span> pd{"\n"}
                      df = pd.<span className="f">read_csv</span>(<span className="s">&quot;data.csv&quot;</span>){"\n\n"}
                      <span className="c"># Group sales by region</span>{"\n"}
                      summary = (df{"\n"}
                      {"  "}.<span className="f">groupby</span>(<span className="s">&quot;region&quot;</span>){"\n"}
                      {"  "}.<span className="f">agg</span>({"{"}<span className="s">&quot;sales&quot;</span>: <span className="s">&quot;sum&quot;</span>{"}"})){"\n"}
                      <span className="f">print</span>(summary)
                    </code>
                  </pre>
                  <hr />
                  <pre>
                    <code>
                      <span className="k">SELECT</span> region,{"\n"}
                      {"  "}<span className="f">SUM</span>(sales) <span className="k">AS</span> total_sales{"\n"}
                      <span className="k">FROM</span> sales{"\n"}
                      <span className="k">GROUP BY</span> region;
                    </code>
                  </pre>
                </div>
              </div>

              <span className="chip c1">
                <Icon id="i-pie-chart" /> Power BI
              </span>
              <span className="chip c2">
                <Icon id="i-code" /> Python
              </span>
              <span className="chip c3">
                <Icon id="i-db" /> SQL
              </span>
            </div>
          </div>

          {/* Countdown bar */}
          <div className="hero-bar">
            <div className="bar-text">
              <strong>Program starts in</strong>
              <span>Enrollment open · Flexible online payment &amp; installment options available</span>
            </div>
            <Countdown />
            <a href="#register" className="btn btn-gold">
              Reserve your place
            </a>
          </div>
        </div>
      </section>

      {/* ============ TOOLS ============ */}
      <section className="tools" aria-label="Tools covered">
        <div className="container tools-inner">
          <p>Tools you&apos;ll work with</p>
          <ul>
            <li>
              <Icon id="i-db" /> SQL
            </li>
            <li>
              <Icon id="i-code" /> Python
            </li>
            <li>
              <Icon id="i-table" /> Excel &amp; VBA
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
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section" id="about">
        <div className="container">
          <div className="ov-grid">
            <div className="ov-intro reveal">
              <h2>About the program</h2>
              <p>
                {SITE_CONFIG.COMPANY} is an IT solutions agency, and training is part of how we work.
                Our Data Analysis Program is built on one idea: you learn a tool best by using it on
                realistic data, then connecting it to the next tool in a real workflow.
              </p>
              <p>
                The result is a complete path from raw, messy data to clear insights that other people
                can act on.
              </p>
              <a href="#register" className="btn btn-navy">
                Reserve your place
              </a>
            </div>
            <ul className="ov-list">
              <li className="reveal">
                <span className="ov-ico">
                  <Icon id="i-target" />
                </span>
                <div>
                  <h3>Hands-on, not theory-heavy</h3>
                  <p>Every session is built around realistic datasets, so you practice each skill as you learn it.</p>
                </div>
              </li>
              <li className="reveal">
                <span className="ov-ico">
                  <Icon id="i-briefcase" />
                </span>
                <div>
                  <h3>Built for working professionals</h3>
                  <p>One-hour live sessions, three times a week, online, so it fits around your job.</p>
                </div>
              </li>
              <li className="reveal">
                <span className="ov-ico">
                  <Icon id="i-workflow" />
                </span>
                <div>
                  <h3>Four tools, one workflow</h3>
                  <p>See how databases, scripting, ETL and dashboards connect into a single end-to-end analysis process.</p>
                </div>
              </li>
              <li className="reveal">
                <span className="ov-ico">
                  <Icon id="i-award" />
                </span>
                <div>
                  <h3>A project you can show</h3>
                  <p>Finish with a capstone dashboard you can share with employers or your team.</p>
                </div>
              </li>
            </ul>
          </div>

          <ul className="stats" aria-label="The program in numbers">
            <li className="reveal">
              <strong>12</strong>
              <span>Weeks of training</span>
            </li>
            <li className="reveal">
              <strong>36</strong>
              <span>Live sessions</span>
            </li>
            <li className="reveal">
              <strong>4</strong>
              <span>Core modules</span>
            </li>
            <li className="reveal">
              <strong>7</strong>
              <span>Tools and languages</span>
            </li>
          </ul>

          <div className="duo">
            <div className="panel-soft reveal">
              <h3>Who it&apos;s for</h3>
              <ul className="check-list">
                <li>Analysts, administrators and managers who want to work with data more confidently</li>
                <li>Finance, operations, marketing and sales professionals who live in spreadsheets</li>
                <li>Career changers moving into data and business intelligence roles</li>
                <li>Anyone who wants to turn raw data into reports leaders can use</li>
              </ul>
            </div>
            <div className="panel-navy reveal">
              <h3>What you&apos;ll walk away with</h3>
              <ul className="check-list">
                <li>Confidence writing SQL queries against real databases</li>
                <li>Python and Excel/VBA skills to clean and automate repetitive work</li>
                <li>The ability to build ETL workflows in Alteryx</li>
                <li>Interactive dashboards in Tableau and Power BI</li>
                <li>A portfolio-ready capstone project</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AT A GLANCE ============ */}
      <section className="glance" aria-label="Program at a glance">
        <div className="container glance-grid">
          <div className="reveal">
            <Icon id="i-calendar" />
            <strong>Nov 10</strong>
            <span>Start date</span>
          </div>
          <div className="reveal">
            <Icon id="i-clock" />
            <strong>3 months</strong>
            <span>12 weeks in total</span>
          </div>
          <div className="reveal">
            <Icon id="i-repeat" />
            <strong>3× a week</strong>
            <span>36 live sessions</span>
          </div>
          <div className="reveal">
            <Icon id="i-clock" />
            <strong>1 hour</strong>
            <span>Each session</span>
          </div>
          <div className="reveal">
            <Icon id="i-video" />
            <strong>Zoom</strong>
            <span>Fully online</span>
          </div>
          <div className="reveal">
            <Icon id="i-landmark" />
            <strong>{SITE_CONFIG.PROGRAMME.TUITION}</strong>
            <span>
              <Link href="/tuition" className="link-inherit">
                Tuition &amp; fees
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* ============ CURRICULUM ============ */}
      <section className="section section-tint" id="curriculum">
        <div className="container">
          <div className="head-row reveal">
            <div>
              <h2>What you&apos;ll learn</h2>
              <p>
                Four modules across 12 weeks. Each module has nine live sessions and ends with a
                hands-on exercise, so every tool is used before you move on.
              </p>
            </div>
          </div>

          <ol className="modules">
            <li className="module m1 reveal">
              <div className="module-top">
                <span className="module-ico">
                  <Icon id="i-db" />
                </span>
                <span className="tag">Weeks 1–3</span>
              </div>
              <h3>Databases &amp; SQL</h3>
              <p>Learn how data is stored and how to ask databases the right questions.</p>
              <ul className="check-list compact">
                <li>Relational database concepts</li>
                <li>SELECT, WHERE and ORDER BY</li>
                <li>Aggregations and GROUP BY</li>
                <li>JOINs across tables</li>
                <li>Subqueries and CTEs</li>
                <li>Cleaning data with SQL</li>
              </ul>
            </li>

            <li className="module m2 reveal">
              <div className="module-top">
                <span className="module-ico">
                  <Icon id="i-code" />
                </span>
                <span className="tag">Weeks 4–6</span>
              </div>
              <h3>Python, Excel &amp; VBA</h3>
              <p>Clean, transform and automate your analysis with scripting and spreadsheet power tools.</p>
              <ul className="check-list compact">
                <li>Python basics for analysts</li>
                <li>pandas for data wrangling</li>
                <li>Advanced formulas and PivotTables</li>
                <li>Power Query</li>
                <li>VBA macros and automation</li>
                <li>Exploratory data analysis</li>
              </ul>
            </li>

            <li className="module m3 reveal">
              <div className="module-top">
                <span className="module-ico">
                  <Icon id="i-workflow" />
                </span>
                <span className="tag">Weeks 7–9</span>
              </div>
              <h3>ETL with Alteryx</h3>
              <p>Build repeatable workflows that extract, transform and load data without manual rework.</p>
              <ul className="check-list compact">
                <li>ETL concepts</li>
                <li>Connecting to multiple data sources</li>
                <li>Data preparation and blending</li>
                <li>Building and scheduling workflows</li>
                <li>Data quality checks</li>
              </ul>
            </li>

            <li className="module m4 reveal">
              <div className="module-top">
                <span className="module-ico">
                  <Icon id="i-chart" />
                </span>
                <span className="tag">Weeks 10–12</span>
              </div>
              <h3>Tableau &amp; Power BI</h3>
              <p>Turn analysis into interactive dashboards and a clear story for decision-makers.</p>
              <ul className="check-list compact">
                <li>Visual design principles</li>
                <li>Charts, maps and KPIs</li>
                <li>Interactive dashboards</li>
                <li>DAX and calculated fields</li>
                <li>Data storytelling</li>
              </ul>
            </li>
          </ol>

          <div className="capstone reveal">
            <span className="capstone-ico">
              <Icon id="i-award" />
            </span>
            <div>
              <h3>Capstone project</h3>
              <p>
                In the final weeks you take a real dataset from raw files to a finished dashboard,
                using SQL, Python or Excel, Alteryx and a BI tool, then present your findings.
              </p>
            </div>
            <a href="#register" className="btn btn-gold">
              Register now
            </a>
          </div>
        </div>
      </section>

      {/* ============ BEFORE YOU ENROL ============ */}
      <section className="section" id="before-you-enrol">
        <div className="container">
          <div className="head-row reveal">
            <h2>Before you enroll</h2>
            <p>Everything to check so you can start on day one.</p>
          </div>

          <div className="enrol-grid">
            <dl className="spec">
              <div className="spec-row reveal">
                <dt>
                  <Icon id="i-check" /> Prerequisites
                </dt>
                <dd>
                  <ul className="dash-list">
                    <li>No programming experience needed. We start from the basics.</li>
                    <li>Comfort using a computer and basic spreadsheet skills.</li>
                    <li>Willingness to practice between sessions.</li>
                  </ul>
                </dd>
              </div>
              <div className="spec-row reveal">
                <dt>
                  <Icon id="i-laptop" /> What to have ready
                </dt>
                <dd>
                  <ul className="dash-list">
                    <li>A laptop or desktop. Windows is recommended because some tools are Windows-only.</li>
                    <li>A stable internet connection.</li>
                    <li>The Zoom app, installed and tested.</li>
                    <li>Free disk space for course tools. Setup guidance is sent before day one.</li>
                  </ul>
                </dd>
              </div>
              <div className="spec-row reveal">
                <dt>
                  <Icon id="i-clock" /> Time commitment
                </dt>
                <dd>
                  <ul className="dash-list">
                    <li>Three one-hour live sessions every week for 12 weeks.</li>
                    <li>Plan a few extra hours a week for practice and exercises.</li>
                  </ul>
                </dd>
              </div>
              <div className="spec-row reveal">
                <dt>
                  <Icon id="i-shield" /> Your data and rights
                </dt>
                <dd>
                  <ul className="dash-list">
                    <li>
                      We use your details only to manage your registration and the program. Read our{" "}
                      <Link href="/privacy">Privacy Policy</Link>.
                    </li>
                    <li>
                      Terms of engagement and enrollment are set out in the <Link href="/terms">Terms of Service</Link>.
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>

            <aside className="tuition reveal">
              <p className="tuition-label">Fees</p>
              <p className="price fee-note">{SITE_CONFIG.PROGRAMME.TUITION}</p>
              <p>Standard tuition covers all 36 live sessions, course materials and capstone feedback.</p>
              <ul className="check-list">
                <li>36 live Zoom sessions</li>
                <li>Four tools in one workflow</li>
                <li>Capstone project review</li>
                <li>Flexible installment options available</li>
              </ul>
              <Link href="/tuition" className="btn btn-gold btn-block">
                View tuition and fees breakdown
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section section-tint" id="faq">
        <div className="container faq-grid">
          <div className="faq-intro reveal">
            <h2>Common questions</h2>
            <p>Can&apos;t find your answer? Reach our team directly.</p>
            <ul className="faq-contact">
              <li>
                <Icon id="i-phone" />
                <a href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</a>
              </li>
              <li>
                <Icon id="i-mail" />
                <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a>
              </li>
            </ul>
          </div>
          <div className="faq">
            <details className="reveal">
              <summary>When does the program start?</summary>
              <p>
                The program starts on {SITE_CONFIG.PROGRAMME.START_DATE_TEXT} and runs for three
                months (12 weeks).
              </p>
            </details>
            <details className="reveal">
              <summary>Is it online or in person?</summary>
              <p>
                It is fully online. Sessions are live on Zoom, and the secure access link is sent to
                registered participants before the first session.
              </p>
            </details>
            <details className="reveal">
              <summary>Do I need prior coding or database experience?</summary>
              <p>
                No. The program starts from fundamentals. If you are comfortable with general computer
                usage and simple spreadsheets, you will thrive.
              </p>
            </details>
            <details className="reveal">
              <summary>I work full time. Can I still participate?</summary>
              <p>
                Yes. The schedule is structured for working professionals: 3 live one-hour sessions per
                week, with practice exercises you can complete at your own pace.
              </p>
            </details>
            <details className="reveal">
              <summary>How does payment work?</summary>
              <p>
                You can reserve your seat through the online form below. Our training team confirms
                your registration, after which you can pay securely online via Debit/Credit Card or
                direct transfer.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ============ REGISTRATION SECTION ============ */}
      <section className="register" id="register">
        <div className="container reg-grid">
          <div className="reg-intro reveal">
            <h2>Reserve your place</h2>
            <p>Fill in your details and we will email you a formal confirmation straight away.</p>

            <h3 className="steps-title">How registration works</h3>
            <ol className="steps">
              <li>
                <span className="step-ico">
                  <Icon id="i-edit" />
                </span>
                <div>
                  <strong>Register online</strong>
                  <span>Complete the short form. It takes less than two minutes.</span>
                </div>
              </li>
              <li>
                <span className="step-ico">
                  <Icon id="i-mail" />
                </span>
                <div>
                  <strong>Receive your confirmation</strong>
                  <span>
                    A formal email with your reference number and program details arrives in your
                    inbox.
                  </span>
                </div>
              </li>
              <li>
                <span className="step-ico">
                  <Icon id="i-phone" />
                </span>
                <div>
                  <strong>Our coordination team contacts you</strong>
                  <span>We confirm your place and guide you through payment and onboarding.</span>
                </div>
              </li>
              <li>
                <span className="step-ico">
                  <Icon id="i-video" />
                </span>
                <div>
                  <strong>Get set up</strong>
                  <span>
                    You receive software setup guidance and Zoom coordinates before the start date.
                  </span>
                </div>
              </li>
            </ol>
          </div>

          <div className="reg-card reveal">
            <RegistrationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
