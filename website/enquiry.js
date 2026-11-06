/* =========================================================
   Enquiry form (contact.html).
   Sends the enquiry to the company, then a formal acknowledgement
   to the sender. Depends on: config.js, common.js, vendor/emailjs.min.js
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const form = $("#enq-form");
  if (!form) return;

  const E = CONFIG.EMAILJS, X = CONFIG.EMAILJS_EXTRA, C = CONFIG.CONTACT;
  const ok = (v) => typeof v === "string" && v && !v.startsWith("YOUR_");
  const configured = Object.values(E).every(ok);
  const ackConfigured = ok(X.TEMPLATE_ENQUIRY_ACK);
  const isLocal = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]", ""].includes(location.hostname);
  const demoMode = !configured && isLocal;
  const unavailable = !configured && !isLocal;
  if (configured && typeof emailjs !== "undefined") emailjs.init({ publicKey: E.PUBLIC_KEY, blockHeadless: true });

  /* ---------- Input hygiene ---------- */
  const CONTROL_CHARS = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F\\u200B-\\u200F\\u2028\\u2029\\uFEFF]", "g");
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
    eName: (v) => { v = clean(v); return v.length >= 3 && v.length <= 80 && /\s/.test(v) && NAME_RE.test(v) ? "" : "Enter your first and last name, using letters only."; },
    eEmail: (v) => { v = clean(v); return v.length <= 120 && EMAIL_RE.test(v) ? "" : "Enter a valid email address, for example name@example.com."; },
    ePhone: (v) => { v = clean(v); if (!v) return ""; const n = digits(v).length; return PHONE_RE.test(v) && n >= 9 && n <= 15 ? "" : "Enter a valid phone number with 9 to 15 digits, or leave it empty."; },
    eOrg: (v) => (clean(v).length <= 100 ? "" : "Keep this under 100 characters."),
    eRegion: (v) => (v ? "" : "Select your region."),
    eService: (v) => (v ? "" : "Select a service."),
    eMessage: (v) => { v = clean(v, true); return v.length >= 15 && v.length <= 1500 ? "" : "Write a message of 15 to 1,500 characters."; },
    ePrivacy: (_v, el) => (el.checked ? "" : "You need to agree before you can send your enquiry."),
  };

  const fields = $$("[data-rule]", form);
  function setErr(el, msg) {
    const out = form.querySelector('.error[data-for="' + el.id + '"]');
    if (out) out.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (out) el.setAttribute("aria-describedby", out.id);
    const f = el.closest(".field"); if (f) f.classList.toggle("invalid", !!msg);
  }
  const check = (el) => { const m = rules[el.dataset.rule](el.type === "checkbox" ? el.checked : el.value, el); setErr(el, m); return !m; };
  fields.forEach((el) => {
    el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "blur", () => check(el));
    el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") check(el); });
  });
  const validate = () => { let first = null; fields.forEach((el) => { if (!check(el) && !first) first = el; }); if (first) first.focus(); return !first; };

  const msg = $("#eMessage"), count = $("#e-count");
  if (msg && count) msg.addEventListener("input", () => (count.textContent = msg.value.length + " / 1500"));

  // Preselect the service from ?service=slug (links from the Services and Training pages)
  try {
    const slug = new URLSearchParams(location.search).get("service");
    if (slug) { const o = [...$("#eService").options].find((x) => x.value === slug); if (o) $("#eService").value = slug; }
  } catch (_) { /* ignore */ }

  /* ---------- Anti-spam ---------- */
  let t0 = 0;
  const start = () => { if (!t0) t0 = Date.now(); };
  form.addEventListener("focusin", start); form.addEventListener("input", start);
  const humanEnough = () => t0 > 0 && Date.now() - t0 > 1500;
  const KEY = "ets_last_enquiry", COOLDOWN = 45000;
  const cooling = () => { const t = Number(ETS.session.get(KEY)); return Number.isFinite(t) && Date.now() - t < COOLDOWN; };

  const status = $("#enq-status"), btn = $("#enq-btn");
  const show = (m, kind) => { status.textContent = m; status.classList.toggle("err", kind === "err"); status.classList.toggle("ok", kind === "ok"); };
  const busy = (on) => { btn.disabled = on; btn.classList.toggle("is-loading", on); btn.setAttribute("aria-busy", String(on)); $(".btn-label", btn).textContent = on ? "Sending…" : "Send enquiry"; };

  const send = (tpl, params) => {
    if (typeof emailjs === "undefined") return Promise.reject(new Error("EmailJS did not load"));
    return Promise.race([emailjs.send(E.SERVICE_ID, tpl, params), new Promise((_, rej) => setTimeout(() => rej(new Error("Request timed out")), 20000))]);
  };
  const stamp = () => new Date().toLocaleString("en-GB", { timeZone: "Africa/Accra", dateStyle: "long", timeStyle: "short" }) + " (GMT)";
  function reference() {
    const d = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const a = new Uint8Array(3);
    try { crypto.getRandomValues(a); } catch (_) { a.forEach((_, i) => (a[i] = Math.floor(Math.random() * 256))); }
    return "ETS-EQ-" + d + "-" + [...a].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  let sending = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    show("", "");
    if (form.elements.company_url.value) { show("Thank you. Your enquiry has been sent.", "ok"); form.reset(); return; }
    if (!validate()) { show("Please correct the highlighted fields and try again.", "err"); return; }
    if (!humanEnough()) { show("Please review your enquiry and press send again.", "err"); return; }
    if (cooling()) { show("Please wait a moment before sending another enquiry.", "err"); return; }

    const svcSel = form.elements.eService;
    const ref = reference();
    const name = clean(form.elements.eName.value);
    const email = clean(form.elements.eEmail.value).toLowerCase();
    const service = svcSel.options[svcSel.selectedIndex].text;
    const params = {
      company: CONFIG.COMPANY, sent_at: stamp(), reference: ref,
      from_name: name, from_email: email, reply_to: email, to_name: name, to_email: email,
      phone: clean(form.elements.ePhone.value) || "Not provided",
      organisation: clean(form.elements.eOrg.value) || "Not provided",
      region: form.elements.eRegion.value, topic: service, service,
      message: clean(form.elements.eMessage.value, true),
      site_url: C.WEBSITE_URL, website: C.WEBSITE_DISPLAY,
      support_email: C.EMAIL, support_phone: C.PHONE_DISPLAY, programme: "Website enquiry",
    };

    sending = true; busy(true);
    let ackSent = false;
    try {
      if (demoMode) {
        console.info("[Demo mode] EmailJS keys not set. Nothing was sent.", params);
        await new Promise((r) => setTimeout(r, 600));
      } else if (unavailable) {
        await new Promise((r) => setTimeout(r, 500));
        const subj = encodeURIComponent(`[Enquiry ${ref}] ${service} — ${name}`);
        const body = encodeURIComponent(
          `Reference: ${ref}\nName: ${name}\nEmail: ${email}\nPhone: ${params.phone}\nOrganisation: ${params.organisation}\nRegion: ${params.region}\nService: ${service}\n\nMessage:\n${params.message}`
        );
        window.location.href = `mailto:${C.EMAIL}?subject=${subj}&body=${body}`;
      } else {
        await send(E.TEMPLATE_CONTACT, params);          // the company is told first
        if (ackConfigured) { try { await send(X.TEMPLATE_ENQUIRY_ACK, params); ackSent = true; } catch (err) { console.error("Acknowledgement failed:", err); } }
      }
      ETS.session.set(KEY, String(Date.now()));
      $("#enq-name").textContent = name.split(" ")[0];
      $("#enq-ref").textContent = ref;
      $("#enq-email").textContent = email;
      $("#enq-ok").hidden = !(ackSent);
      $("#enq-warn").hidden = demoMode || ackSent;
      $("#enq-demo").hidden = !demoMode;
      if (!demoMode && !ackSent) $("#enq-warn").textContent = ackConfigured
        ? "We could not send the acknowledgement email, so please check the address you entered. Our team has your enquiry and will reply. Keep your reference number."
        : "Our team has your enquiry and will reply to " + email + ". Keep your reference number.";
      form.reset(); if (count) count.textContent = "0 / 1500"; fields.forEach((el) => setErr(el, ""));
      $("#enq-wrap").hidden = true; $("#enq-success").hidden = false;
      $("#enq-success").scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.error("Enquiry failed:", err);
      show("We could not send your enquiry. Please try again, or email " + C.EMAIL + " directly.", "err");
    } finally { sending = false; busy(false); }
  });

  $("#enq-again").addEventListener("click", () => { $("#enq-success").hidden = true; $("#enq-wrap").hidden = false; t0 = 0; $("#eName").focus(); });
});
