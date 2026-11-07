/* =========================================================
   Data Analysis Programme page behaviour: countdown, registration form, contact form.
   Used on: data-analysis.html
   Depends on: config.js, common.js, vendor/emailjs.min.js
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const E = CONFIG.EMAILJS;
  const P = CONFIG.PROGRAMME;
  const C = CONFIG.CONTACT;

  /* ---------- Email configuration state ---------- */
  const configured = Object.values(E).every((v) => typeof v === "string" && v && !v.startsWith("YOUR_"));
  const isLocal = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]", ""].includes(location.hostname);
  const demoMode = !configured && isLocal;           // local testing only: validates and shows success, sends nothing
  const unavailable = !configured && !isLocal;       // live site without keys: be honest, never fake a send

  if (configured && typeof emailjs !== "undefined") {
    // blockHeadless refuses scripted/headless browsers. (Do not enable the library's own limitRate:
    // one registration sends two emails back to back and the second would be rejected.
    // Repeat submissions are limited by the cooldown below instead.)
    emailjs.init({ publicKey: E.PUBLIC_KEY, blockHeadless: true });
  }

  /* ---------- Countdown ---------- */
  (function countdown() {
    const target = Date.parse(P.START_DATE_ISO);
    const wrap = $("#countdown"), done = $("#countdown-done");
    if (!wrap || !Number.isFinite(target)) return;
    const els = { d: $("#cd-days"), h: $("#cd-hours"), m: $("#cd-mins"), s: $("#cd-secs") };
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { wrap.hidden = true; if (done) done.hidden = false; return false; }
      const s = Math.floor(diff / 1000);
      els.d.textContent = pad(Math.floor(s / 86400));
      els.h.textContent = pad(Math.floor((s % 86400) / 3600));
      els.m.textContent = pad(Math.floor((s % 3600) / 60));
      els.s.textContent = pad(s % 60);
      return true;
    };
    if (tick()) { const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000); }
  })();

  /* ---------- Input hygiene ---------- */
  // Control characters, zero-width marks and line/paragraph separators (written as escapes on purpose).
  const CONTROL_CHARS = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F\\u200B-\\u200F\\u2028\\u2029\\uFEFF]", "g");
  // Remove those, then tidy whitespace; keep line breaks only where allowed.
  const clean = (v, multiline = false) => {
    let s = String(v ?? "").normalize("NFKC").replace(CONTROL_CHARS, "");
    s = multiline ? s.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
    return s.trim();
  };
  const digits = (v) => String(v).replace(/\D/g, "");

  const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*[\p{L}\p{M}.]$/u;
  const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
  const PHONE_RE = /^\+?[0-9()\s.-]+$/;

  const rules = {
    fullName: (v) => { v = clean(v); return v.length >= 3 && v.length <= 80 && /\s/.test(v) && NAME_RE.test(v) ? "" : "Enter your first and last name, using letters only."; },
    email: (v) => { v = clean(v); return v.length <= 120 && EMAIL_RE.test(v) ? "" : "Enter a valid email address, for example name@example.com."; },
    phone: (v) => { v = clean(v); const n = digits(v).length; return PHONE_RE.test(v) && n >= 9 && n <= 15 ? "" : "Enter a valid phone number with 9 to 15 digits, for example +233 53 353 4687."; },
    country: (v) => { v = clean(v); return v.length >= 2 && v.length <= 60 && NAME_RE.test(v) ? "" : "Enter your country."; },
    jobTitle: (v) => { v = clean(v); return v.length >= 2 && v.length <= 80 ? "" : "Enter your job title (2 to 80 characters)."; },
    organisation: (v) => (clean(v).length <= 100 ? "" : "Keep this under 100 characters."),
    experience: (v) => (v ? "" : "Select your experience level."),
    goals: (v) => (clean(v, true).length <= 500 ? "" : "Keep this under 500 characters."),
    privacy: (_v, el) => (el.checked ? "" : "You need to agree before you can submit."),
    // contact form
    cName: (v) => rules.fullName(v),
    cEmail: (v) => rules.email(v),
    topic: (v) => (v ? "" : "Select a topic."),
    message: (v) => { v = clean(v, true); return v.length >= 15 && v.length <= 1500 ? "" : "Write a message of 15 to 1,500 characters."; },
    cPrivacy: (_v, el) => (el.checked ? "" : "You need to agree before you can send your message."),
  };

  /* ---------- Generic form wiring ---------- */
  function setFieldError(form, el, msg) {
    const field = el.closest(".field");
    const out = form.querySelector('.error[data-for="' + el.id + '"]');
    if (field) field.classList.toggle("invalid", !!msg);
    if (out) out.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (out && !el.getAttribute("aria-describedby")) el.setAttribute("aria-describedby", out.id);
  }
  const fieldsOf = (form) => $$("[data-rule]", form);
  function checkField(form, el) {
    const fn = rules[el.dataset.rule];
    const msg = fn ? fn(el.value, el) : "";
    setFieldError(form, el, msg);
    return !msg;
  }
  function validateForm(form) {
    let first = null;
    fieldsOf(form).forEach((el) => { if (!checkField(form, el) && !first) first = el; });
    if (first) first.focus();
    return !first;
  }
  function wireValidation(form) {
    fieldsOf(form).forEach((el) => {
      const ev = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "blur";
      el.addEventListener(ev, () => checkField(form, el));
      // once a field is flagged, re-check live so the message clears as soon as it is fixed
      el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") checkField(form, el); });
    });
  }
  const setBusy = (btn, on, idle) => {
    btn.disabled = on;
    btn.classList.toggle("is-loading", on);
    btn.setAttribute("aria-busy", String(on));
    $(".btn-label", btn).textContent = on ? "Sending…" : idle;
  };
  const showStatus = (el, msg, kind) => { el.textContent = msg; el.classList.toggle("err", kind === "err"); el.classList.toggle("ok", kind === "ok"); };

  // Time trap: humans take a moment; scripts post instantly.
  function trap(form) {
    let t0 = 0;
    const start = () => { if (!t0) t0 = Date.now(); };
    form.addEventListener("focusin", start);
    form.addEventListener("input", start);
    return () => t0 > 0 && Date.now() - t0 > 1500;
  }

  // Short-lived anti-spam memory (sessionStorage: gone when the tab closes)
  const COOLDOWN_MS = 45000;
  const cooling = (key) => { const t = Number(ETS.session.get(key)); return Number.isFinite(t) && Date.now() - t < COOLDOWN_MS; };
  const markSent = (key) => ETS.session.set(key, String(Date.now()));

  async function send(templateId, params) {
    if (typeof emailjs === "undefined") throw new Error("EmailJS library did not load");
    return Promise.race([
      emailjs.send(E.SERVICE_ID, templateId, params),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 20000)),
    ]);
  }
  const fmtTime = () => new Date().toLocaleString("en-GB", { timeZone: "Africa/Accra", dateStyle: "long", timeStyle: "short" }) + " (GMT)";

  function makeReference() {
    const d = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const a = new Uint8Array(3);
    try { crypto.getRandomValues(a); } catch (_) { a.forEach((_, i) => (a[i] = Math.floor(Math.random() * 256))); }
    return "ETS-DA-" + d + "-" + [...a].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  /* =====================================================
     Registration form
     ===================================================== */
  const form = $("#reg-form");
  if (form) {
    const status = $("#form-status");
    const submitBtn = $("#submit-btn");
    const success = $("#success");
    const humanEnough = trap(form);
    const REG_KEY = "ets_last_reg", LIST_KEY = "ets_reg_emails";
    let busy = false, lastRegistration = null;
    wireValidation(form);

    const registered = () => {
      try { const v = JSON.parse(ETS.session.get(LIST_KEY)); return Array.isArray(v) ? v : []; } catch (_) { return []; }
    };
    const rememberEmail = (e) => { const list = registered(); list.push(e); ETS.session.set(LIST_KEY, JSON.stringify(list.slice(-10))); };

    const val = (n) => clean(form.elements[n].value);
    function collect() {
      const tools = $$('input[name="tools"]:checked', form).map((c) => c.value);
      return {
        full_name: val("fullName"),
        email: val("email").toLowerCase(),
        phone: val("phone"),
        country: val("country"),
        job_title: val("jobTitle"),
        organisation: val("organisation") || "Not provided",
        experience: form.elements.experience.value,
        tools: tools.length ? tools.join(", ") : "None selected",
        goals: clean(form.elements.goals.value, true) || "Not provided",
        source: form.elements.source.value || "Not provided",
        marketing: form.elements.marketing.checked ? "Yes: agreed to receive news about future programmes" : "No",
        privacy_consent: "Yes: agreed to the Privacy Policy and Terms of Enrolment",
      };
    }

    function showSuccess(data, reference, confirmationSent) {
      lastRegistration = { name: data.full_name, reference };
      $("#success-name").textContent = data.full_name.split(" ")[0];
      $("#success-email").textContent = data.email;
      $("#success-ref").textContent = reference;
      $("#success-ok").hidden = !confirmationSent;
      $("#success-warn").hidden = confirmationSent;
      $("#demo-note").hidden = !demoMode;
      const payBtn = $("#pay-now-btn");
      if (payBtn) {
        payBtn.href = `checkout.html?ref=${encodeURIComponent(reference)}&name=${encodeURIComponent(data.full_name)}&email=${encodeURIComponent(data.email)}&phone=${encodeURIComponent(data.phone || "")}`;
      }
      form.hidden = true;
      success.hidden = false;
      success.classList.add("pop");
      success.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      const h = $("h3", success); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy) return;
      showStatus(status, "", "");

      if (form.elements.website.value) { // honeypot filled: a bot. Look successful, do nothing.
        showSuccess(collect(), makeReference(), true);
        return;
      }
      if (!validateForm(form)) { showStatus(status, "Please correct the highlighted fields and try again.", "err"); return; }
      if (!humanEnough()) { showStatus(status, "Please review your details and press submit again.", "err"); return; }

      const data = collect();
      if (registered().includes(data.email)) {
        showStatus(status, "This email address has already been registered in this session. Check your inbox and spam folder, or contact us if you need help.", "err");
        return;
      }
      if (cooling(REG_KEY)) { showStatus(status, "Please wait a moment before sending another registration.", "err"); return; }

      busy = true; setBusy(submitBtn, true, "Submit registration");
      const reference = makeReference();
      const common = {
        reference, registered_at: fmtTime(),
        programme: P.NAME, start_date: P.START_DATE_TEXT, duration: P.DURATION, schedule: P.SCHEDULE,
        format: P.FORMAT, tuition: P.TUITION, tuition_url: P.TUITION_URL, company: CONFIG.COMPANY,
        support_email: C.EMAIL, support_phone: C.PHONE_DISPLAY, website: C.WEBSITE_DISPLAY, site_url: C.WEBSITE_URL,
      };
      try {
        let confirmationSent = true;
        if (!demoMode && !unavailable) {
          // 1) Notify the company first. If this fails nothing is recorded, so the visitor can safely retry.
          await send(E.TEMPLATE_ADMIN, { ...common, ...data, reply_to: data.email });
          // 2) Formal confirmation to the registrant. A failure here must not lose the registration.
          try {
            await send(E.TEMPLATE_CONFIRM, { ...common, to_name: data.full_name, to_email: data.email });
          } catch (err) { confirmationSent = false; console.warn("Confirmation email failed:", err); }
        } else if (unavailable) {
          confirmationSent = false;
          await new Promise((r) => setTimeout(r, 500));
          const subj = encodeURIComponent(`[Registration ${reference}] ${P.NAME} — ${data.full_name}`);
          const body = encodeURIComponent(
            `Reference: ${reference}\nProgramme: ${P.NAME}\nFull Name: ${data.full_name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCountry: ${data.country}\nJob Title: ${data.job_title}\nOrganisation: ${data.organisation}\nExperience: ${data.experience}\nTools: ${data.tools}\nGoals: ${data.goals}`
          );
          window.location.href = `mailto:${C.EMAIL}?subject=${subj}&body=${body}`;
        } else {
          console.info("[Demo mode] EmailJS keys not set. Nothing was sent. Data:", data, reference);
          await new Promise((r) => setTimeout(r, 700));
        }
        markSent(REG_KEY); rememberEmail(data.email);
        showSuccess(data, reference, confirmationSent);
      } catch (err) {
        console.error("Registration failed:", err);
        showStatus(status, "We could not complete your registration. Please check your connection and try again, or call " + C.PHONE_DISPLAY + ".", "err");
      } finally { busy = false; setBusy(submitBtn, false, "Submit registration"); }
    });

    $("#register-another").addEventListener("click", () => {
      form.reset();
      fieldsOf(form).forEach((el) => setFieldError(form, el, ""));
      showStatus(status, "", "");
      success.hidden = true; success.classList.remove("pop"); form.hidden = false;
      form.elements.fullName.focus();
    });

    // Calendar reminder (.ics, all-day on the start date, so no unconfirmed time is promised)
    $("#add-calendar").addEventListener("click", () => {
      const esc = (s) => s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
      const next = (() => { const d = new Date(Date.UTC(+P.START_DATE_ICS.slice(0, 4), +P.START_DATE_ICS.slice(4, 6) - 1, +P.START_DATE_ICS.slice(6, 8) + 1)); return d.toISOString().slice(0, 10).replace(/-/g, ""); })();
      const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const lines = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Elites Tech Solutions LLC//Registration//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
        "BEGIN:VEVENT", "UID:" + (lastRegistration ? lastRegistration.reference : makeReference()) + "@elitestechsolutions",
        "DTSTAMP:" + stamp, "DTSTART;VALUE=DATE:" + P.START_DATE_ICS, "DTEND;VALUE=DATE:" + next,
        "SUMMARY:" + esc(P.NAME + " starts"),
        "DESCRIPTION:" + esc("The first day of the " + P.NAME + " (" + P.SCHEDULE + "). Session times and the Zoom link are sent by email before the start date.\nQuestions: " + C.EMAIL + " / " + C.PHONE_DISPLAY),
        "LOCATION:Online (Zoom)", "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Programme starts tomorrow", "END:VALARM", "END:VEVENT", "END:VCALENDAR",
      ];
      const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "data-analysis-programme.ics";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  }

  /* =====================================================
     Contact form
     ===================================================== */
  const cForm = $("#contact-form");
  if (cForm) {
    const status = $("#contact-status");
    const btn = $("#contact-btn");
    const humanEnough = trap(cForm);
    const KEY = "ets_last_contact";
    let busy = false;
    wireValidation(cForm);
    const counter = $("#msg-count"), msg = $("#message");
    if (msg && counter) msg.addEventListener("input", () => (counter.textContent = msg.value.length + " / 1500"));

    cForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy) return;
      showStatus(status, "", "");
      if (cForm.elements.company_url.value) { showStatus(status, "Thank you. Your message has been sent.", "ok"); cForm.reset(); return; }
      if (!validateForm(cForm)) { showStatus(status, "Please correct the highlighted fields and try again.", "err"); return; }
      if (!humanEnough()) { showStatus(status, "Please review your message and press send again.", "err"); return; }
      if (unavailable) { showStatus(status, "The contact form is temporarily unavailable. Please email " + C.EMAIL + " or call " + C.PHONE_DISPLAY + ".", "err"); return; }
      if (cooling(KEY)) { showStatus(status, "Please wait a moment before sending another message.", "err"); return; }

      const params = {
        company: CONFIG.COMPANY, sent_at: fmtTime(),
        from_name: clean(cForm.elements.cName.value),
        from_email: clean(cForm.elements.cEmail.value).toLowerCase(),
        reply_to: clean(cForm.elements.cEmail.value).toLowerCase(),
        topic: cForm.elements.topic.value,
        message: clean(cForm.elements.message.value, true),
        site_url: C.WEBSITE_URL, website: C.WEBSITE_DISPLAY, programme: P.NAME,
        phone: "Not provided", organisation: "Not provided", region: "Not provided", reference: "ETS-PQ-" + Date.now().toString(36).toUpperCase(),
      };
      busy = true; setBusy(btn, true, "Send message");
      try {
        if (demoMode) { console.info("[Demo mode] EmailJS keys not set. Nothing was sent.", params); await new Promise((r) => setTimeout(r, 600)); }
        else await send(E.TEMPLATE_CONTACT, params);
        markSent(KEY);
        cForm.reset(); if (counter) counter.textContent = "0 / 1500";
        fieldsOf(cForm).forEach((el) => setFieldError(cForm, el, ""));
        showStatus(status, demoMode
          ? "Demo mode: the form works, but no email was sent because the email keys are not set yet."
          : "Thank you. Your message has been sent. We will reply to " + params.from_email + ".", "ok");
      } catch (err) {
        console.error("Contact form failed:", err);
        showStatus(status, "We could not send your message. Please try again, or email " + C.EMAIL + " directly.", "err");
      } finally { busy = false; setBusy(btn, false, "Send message"); }
    });
  }
});
