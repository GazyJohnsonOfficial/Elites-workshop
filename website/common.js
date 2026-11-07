/* =========================================================
   Shared behaviour for every page:
   navigation, scroll effects, reveal animations, counters,
   social links, and the cookie consent banner + preferences.
   Loaded in <head> (no defer) so the "js" class is set before
   first paint. Everything else waits for DOMContentLoaded.
   ========================================================= */
document.documentElement.classList.add("js");
// Safety net: if anything stops the reveal observer, show all content after 4 s.
setTimeout(() => document.documentElement.classList.add("reveal-all"), 4000);

/* ---------- Safe storage (can throw in private mode or when blocked) ---------- */
const ETS = {
  store: {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (_) { return false; } },
    remove(k) { try { localStorage.removeItem(k); } catch (_) { /* ignore */ } },
  },
  // sessionStorage: cleared when the tab closes. Used for anti-spam state so nothing personal lingers on shared computers.
  session: {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); return true; } catch (_) { return false; } },
  },
  json(k, fallback) {
    try { const v = JSON.parse(this.store.get(k)); return v ?? fallback; } catch (_) { return fallback; }
  },
};

const SVG_NS = "http://www.w3.org/2000/svg";
function etsIcon(id, cls) {
  const s = document.createElementNS(SVG_NS, "svg");
  s.setAttribute("class", cls || "ico");
  s.setAttribute("aria-hidden", "true");
  const u = document.createElementNS(SVG_NS, "use");
  u.setAttribute("href", "#" + id);
  s.appendChild(u);
  return s;
}
function etsEl(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === "text") e.textContent = v; else e.setAttribute(k, v === true ? "" : v);
  }
  kids.forEach((c) => c && e.append(c));
  return e;
}

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));

  /* ---------- Legacy hash alias support on services.html ---------- */
  const hashAliases = {
    "#consulting": "#cloud-strategy",
    "#data": "#training-workshops",
    "#cloud": "#architecture",
    "#staffing": "#consulting-staffing",
    "#hardware": "#consulting-staffing",
    "#training": "#training-workshops",
    "#cloud-native": "#native",
    "#hybrid-cloud": "#hybrid",
  };
  if (location.hash && !$(location.hash) && hashAliases[location.hash]) {
    const targetEl = $(hashAliases[location.hash]);
    if (targetEl) {
      history.replaceState(null, "", location.pathname + location.search + hashAliases[location.hash]);
      setTimeout(() => targetEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 60);
    }
  }

  /* ---------- Mobile navigation ---------- */
  const toggle = $(".nav-toggle");
  const nav = $("#main-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("open") && !e.target.closest(".site-header")) setOpen(false);
    });
  }

  /* ---------- Header state, progress bar, back-to-top ---------- */
  const header = $(".site-header");
  const bar = etsEl("div", { class: "progress", "aria-hidden": "true" });
  const topBtn = etsEl("button", { type: "button", class: "to-top", "aria-label": "Back to top" }, etsIcon("i-arrow-up"));
  document.body.append(bar, topBtn);
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    topBtn.classList.toggle("show", y > 700);
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Scroll-spy for in-page navigation ---------- */
  const spyLinks = $$('#main-nav a[href^="#"]:not(.btn)');
  if (spyLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    spyLinks.forEach((a) => { const s = $(a.getAttribute("href")); if (s) map.set(s, a); });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        spyLinks.forEach((a) => a.removeAttribute("aria-current"));
        map.get(en.target)?.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll + count-up numbers ---------- */
  const reveals = $$(".reveal");
  if (reveals.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach((r) => r.classList.add("in"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          io.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      reveals.forEach((r) => {
        // stagger siblings that sit in the same grid/list
        const idx = r.parentElement ? [...r.parentElement.children].filter((c) => c.classList.contains("reveal")).indexOf(r) : 0;
        r.style.setProperty("--d", Math.min(idx, 6) * 70 + "ms");
        io.observe(r);
      });
    }
  }

  const counters = $$("[data-count]");
  const runCount = (el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion || !Number.isFinite(end)) { el.textContent = end + suffix; return; }
    const t0 = performance.now(), dur = 1200;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) counters.forEach((c) => (c.textContent = c.dataset.count + (c.dataset.suffix || "")));
    else {
      counters.forEach((c) => (c.textContent = "0" + (c.dataset.suffix || "")));
      const co = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach((c) => co.observe(c));
    }
  }

  /* ---------- Social links (active links or placeholders for primary networks; WhatsApp derived from phone) ---------- */
  const socialDefs = [
    ["whatsapp", "WhatsApp", "i-whatsapp"],
    ["facebook", "Facebook", "i-facebook"],
    ["instagram", "Instagram", "i-instagram"],
    ["linkedin", "LinkedIn", "i-linkedin"],
    ["x", "X (Twitter)", "i-xsocial"],
    ["youtube", "YouTube", "i-youtube"],
  ];
  const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === "https:" ? x.href : null; } catch (_) { return null; } };
  const waUrl = "https://wa.me/" + CONFIG.CONTACT.WHATSAPP_NUMBER + "?text=" +
    encodeURIComponent("Hello, I'd like to know more about the " + CONFIG.PROGRAMME.NAME + ".");
  $$("[data-socials]").forEach((box) => {
    socialDefs.forEach(([key, label, icon]) => {
      const href = key === "whatsapp" ? waUrl : safeUrl(CONFIG.SOCIALS[key] || "");
      if (!href) {
        if (["facebook", "linkedin", "x"].includes(key)) {
          box.appendChild(etsEl("span", {
            class: "social-placeholder",
            role: "img",
            "aria-label": label + " profile link not configured",
            title: label + " profile link not configured",
          }, etsIcon(icon)));
        }
        return;
      }
      const a = etsEl("a", { href, target: "_blank", rel: "noopener noreferrer", "aria-label": label + " (opens in a new tab)", title: label }, etsIcon(icon));
      box.appendChild(a);
    });
  });

  /* =====================================================
     Cookie consent
     - Essential storage is always on (remembers this choice, spam protection for forms).
     - Analytics is OFF until the visitor allows it. No analytics is loaded today;
       window.ETS_CONSENT lets you gate any future tool on the visitor's choice.
     ===================================================== */
  const KEY = "ets_consent_v1";
  const MAX_AGE = 365 * 24 * 3600 * 1000; // ask again after 12 months
  const read = () => {
    const c = ETS.json(KEY, null);
    if (!c || typeof c.analytics !== "boolean") return null;
    const age = Date.now() - Date.parse(c.at);
    return Number.isFinite(age) && age >= 0 && age < MAX_AGE ? c : null;
  };
  const save = (analytics) => {
    const c = { analytics, at: new Date().toISOString() };
    ETS.store.set(KEY, JSON.stringify(c));
    document.dispatchEvent(new CustomEvent("ets:consent", { detail: c }));
    return c;
  };
  window.ETS_CONSENT = { get: () => read() || { analytics: false }, open: () => openPrefs() };

  const banner = etsEl("div", { class: "cookie-banner", role: "region", "aria-label": "Cookie consent", hidden: true });
  const bText = etsEl("div", { class: "cookie-text" },
    etsEl("strong", { text: "Your privacy choices" }),
    etsEl("p", { text: "We use essential storage to keep this site working and secure. With your permission we may also use analytics to improve it. You can change your mind at any time." }),
    (() => { const a = etsEl("a", { href: "cookies.html", text: "Read the Cookie Policy" }); return a; })()
  );
  const bBtns = etsEl("div", { class: "cookie-actions" });
  const bAccept = etsEl("button", { type: "button", class: "btn btn-gold btn-sm", text: "Accept all" });
  const bReject = etsEl("button", { type: "button", class: "btn btn-outline btn-sm", text: "Essential only" });
  const bCustom = etsEl("button", { type: "button", class: "link-btn", text: "Customise" });
  bBtns.append(bAccept, bReject, bCustom);
  banner.append(bText, bBtns);

  const dlg = etsEl("dialog", { class: "cookie-dialog", "aria-labelledby": "ck-title" });
  const closeBtn = etsEl("button", { type: "button", class: "dlg-close", "aria-label": "Close" }, etsIcon("i-x"));
  const swEssential = etsEl("input", { type: "checkbox", checked: true, disabled: true, id: "ck-ess" });
  const swAnalytics = etsEl("input", { type: "checkbox", id: "ck-ana" });
  const row = (id, title, desc, input, locked) =>
    etsEl("div", { class: "ck-row" },
      etsEl("div", {}, etsEl("label", { for: id, text: title }), etsEl("p", { text: desc })),
      etsEl("span", { class: "switch" }, input, etsEl("i", { "aria-hidden": "true" }), locked ? etsEl("em", { text: "Always on" }) : null));
  const dSave = etsEl("button", { type: "button", class: "btn btn-gold", text: "Save preferences" });
  const dAll = etsEl("button", { type: "button", class: "btn btn-outline", text: "Accept all" });
  dlg.append(
    closeBtn,
    etsEl("h2", { id: "ck-title", text: "Cookie preferences" }),
    etsEl("p", { class: "muted", text: "Choose which optional features we may use. Essential storage cannot be turned off because the site needs it." }),
    row("ck-ess", "Essential", "Remembers this choice and helps protect the registration and contact forms from spam and repeat submissions. Stored only in your browser.", swEssential, true),
    row("ck-ana", "Analytics", "Helps us understand which pages are useful. We do not run analytics today. If we start, it will only run after you allow it here.", swAnalytics, false),
    etsEl("div", { class: "dlg-actions" }, dSave, dAll),
    (() => { const p = etsEl("p", { class: "muted small" }, "See our ", etsEl("a", { href: "cookies.html", text: "Cookie Policy" }), " and ", etsEl("a", { href: "privacy.html", text: "Privacy Policy" }), "."); return p; })()
  );
  document.body.append(banner, dlg);

  const hideBanner = () => { banner.classList.remove("show"); setTimeout(() => (banner.hidden = true), 300); };
  const showBanner = () => { banner.hidden = false; requestAnimationFrame(() => banner.classList.add("show")); };
  const choose = (analytics) => { save(analytics); hideBanner(); if (dlg.open) dlg.close(); };
  function openPrefs() {
    swAnalytics.checked = !!(read() || {}).analytics;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    swAnalytics.focus();
  }
  bAccept.addEventListener("click", () => choose(true));
  bReject.addEventListener("click", () => choose(false));
  bCustom.addEventListener("click", openPrefs);
  dAll.addEventListener("click", () => choose(true));
  dSave.addEventListener("click", () => choose(swAnalytics.checked));
  closeBtn.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $$("[data-cookie-settings]").forEach((b) => b.addEventListener("click", openPrefs));
  if (!read()) setTimeout(showBanner, 600);
});
