/* =========================================================
   Elites Tech Solutions LLC: Checkout & Online Payment Engine
   Handles multi-currency pricing, plan selection, card/momo/bank
   payment processing, receipt generation, and print formatting.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Default exchange rates and plans
  const RATES = {
    USD: { symbol: "$", code: "USD", rate: 1.0, prefix: true },
    GHS: { symbol: "GH₵", code: "GHS", rate: 15.5, prefix: true },
    GBP: { symbol: "£", code: "GBP", rate: 0.78, prefix: true },
  };

  const PLANS = {
    full: { id: "full", name: "Data Analysis Programme — Full Tuition", usd: 1000, desc: "Full 12-week cohort, all 36 live Zoom sessions, mentoring, capstone evaluation & certificate." },
    deposit: { id: "deposit", name: "Data Analysis Programme — 1st Instalment (Deposit)", usd: 500, desc: "Reserve your seat for the Nov 10 cohort. Balance of $500 due midway through the programme." },
    balance: { id: "balance", name: "Data Analysis Programme — 2nd Instalment (Balance)", usd: 500, desc: "Final balance payment for enrolled Data Analysis students." },
    custom: { id: "custom", name: "Custom Invoice / Consulting Payment", usd: 0, desc: "Pay an agreed client invoice for IT consulting, cloud services or bespoke training." },
  };

  let currentCurrency = "USD";
  let currentPlan = "full";
  let customUsdAmount = 250;
  let currentMethod = "card"; // card | momo | bank
  let currentMomoNet = "MTN";

  // URL parameters parsing
  const params = new URLSearchParams(window.location.search);
  const urlRef = params.get("ref") || "";
  const urlName = params.get("name") || "";
  const urlEmail = params.get("email") || "";
  const urlPhone = params.get("phone") || "";
  const urlPlan = params.get("plan");
  const urlCurr = params.get("curr");
  const urlAmt = parseFloat(params.get("amount"));

  // Format money helper
  function formatMoney(usdAmount, currCode = currentCurrency) {
    const curr = RATES[currCode] || RATES.USD;
    const converted = usdAmount * curr.rate;
    const formattedNum = converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${curr.symbol} ${formattedNum} ${curr.code}`;
  }

  function getActiveAmountUsd() {
    if (currentPlan === "custom") {
      const input = $("#custom-amount-input");
      const val = parseFloat(input ? input.value : 0);
      return isNaN(val) || val <= 0 ? 0 : val;
    }
    return PLANS[currentPlan] ? PLANS[currentPlan].usd : 1000;
  }

  // Update Summary and UI Prices
  function updatePrices() {
    const usd = getActiveAmountUsd();
    const curr = RATES[currentCurrency] || RATES.USD;

    // Update plan card display prices
    $$(".plan-card").forEach((card) => {
      const planKey = card.dataset.plan;
      const priceEl = card.querySelector(".plan-price");
      if (priceEl && PLANS[planKey]) {
        if (planKey === "custom") {
          priceEl.textContent = "Custom";
        } else {
          priceEl.textContent = formatMoney(PLANS[planKey].usd, currentCurrency);
        }
      }
    });

    // Update summary lines
    const summaryItemName = $("#sum-item-name");
    const summaryItemPrice = $("#sum-item-price");
    const summaryTotal = $("#sum-total");
    const payBtnText = $("#pay-btn-text");

    const planObj = PLANS[currentPlan] || PLANS.full;
    if (summaryItemName) summaryItemName.textContent = planObj.name;
    if (summaryItemPrice) summaryItemPrice.textContent = formatMoney(usd, currentCurrency);
    if (summaryTotal) summaryTotal.textContent = formatMoney(usd, currentCurrency);
    if (payBtnText) payBtnText.textContent = `Pay ${formatMoney(usd, currentCurrency)} Securely`;

    // Update MoMo note amount
    const momoAmtNote = $("#momo-amount-display");
    if (momoAmtNote) {
      momoAmtNote.textContent = formatMoney(usd, "GHS");
    }
  }

  // Currency switcher events
  $$(".curr-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".curr-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCurrency = btn.dataset.curr || "USD";
      updatePrices();
    });
  });

  // Plan selector events
  $$(".plan-card").forEach((card) => {
    card.addEventListener("click", () => {
      $$(".plan-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      currentPlan = card.dataset.plan;

      const customRow = $("#custom-amount-row");
      if (customRow) {
        customRow.hidden = currentPlan !== "custom";
      }
      updatePrices();
    });
  });

  // Custom amount input event
  const customInput = $("#custom-amount-input");
  if (customInput) {
    customInput.addEventListener("input", () => {
      updatePrices();
    });
  }

  // Payment Method Tabs
  $$(".method-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".method-tab").forEach((t) => t.classList.remove("active"));
      $$(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      currentMethod = tab.dataset.method;
      const targetPanel = $(`#panel-${currentMethod}`);
      if (targetPanel) targetPanel.classList.add("active");

      // Update button text depending on method
      const payBtn = $("#submit-payment-btn");
      const payBtnText = $("#pay-btn-text");
      const usd = getActiveAmountUsd();
      if (currentMethod === "bank") {
        if (payBtnText) payBtnText.textContent = "Confirm Bank Transfer Order";
      } else if (currentMethod === "momo") {
        if (payBtnText) payBtnText.textContent = `Authorise MoMo Payment (${formatMoney(usd, 'GHS')})`;
      } else {
        if (payBtnText) payBtnText.textContent = `Pay ${formatMoney(usd, currentCurrency)} Securely`;
      }
    });
  });

  // MoMo Network selector
  $$(".momo-net-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".momo-net-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMomoNet = btn.dataset.net;
    });
  });

  // Bank Tabs (US, Ghana, UK)
  $$(".bank-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".bank-tab-btn").forEach((b) => b.classList.remove("active"));
      $$(".bank-info-box").forEach((box) => (box.hidden = true));
      btn.classList.add("active");
      const targetBox = $(`#bank-box-${btn.dataset.bank}`);
      if (targetBox) targetBox.hidden = false;
    });
  });

  // Copy to clipboard helpers
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.color = "#16a34a";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = "";
        }, 2000);
      } catch (_) {
        prompt("Copy to clipboard: Ctrl+C, Enter", text);
      }
    });
  });

  // Card input formatting
  const cardNumInput = $("#card-number");
  if (cardNumInput) {
    cardNumInput.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").substring(0, 16);
      let formatted = v.match(/.{1,4}/g)?.join(" ") || v;
      e.target.value = formatted;
    });
  }

  const cardExpInput = $("#card-expiry");
  if (cardExpInput) {
    cardExpInput.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").substring(0, 4);
      if (v.length >= 3) {
        e.target.value = v.substring(0, 2) + "/" + v.substring(2);
      } else {
        e.target.value = v;
      }
    });
  }

  // Pre-populate URL params
  if (urlName && $("#payer-name")) $("#payer-name").value = urlName;
  if (urlEmail && $("#payer-email")) $("#payer-email").value = urlEmail;
  if (urlPhone && $("#payer-phone")) $("#payer-phone").value = urlPhone;
  if (urlRef && $("#payer-ref")) $("#payer-ref").value = urlRef;
  if (urlPlan && PLANS[urlPlan]) {
    const cardToSelect = $(`.plan-card[data-plan="${urlPlan}"]`);
    if (cardToSelect) cardToSelect.click();
  }
  if (urlCurr && RATES[urlCurr]) {
    const currBtn = $(`.curr-btn[data-curr="${urlCurr}"]`);
    if (currBtn) currBtn.click();
  }
  if (!isNaN(urlAmt) && urlAmt > 0 && currentPlan === "custom") {
    if (customInput) customInput.value = urlAmt;
  }

  updatePrices();

  // Handle Form Submission & Receipt Generation
  const form = $("#checkout-form");
  const checkoutView = $("#checkout-view");
  const receiptView = $("#receipt-view");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = $("#checkout-status");
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.className = "form-status";
      }

      const name = $("#payer-name").value.trim();
      const email = $("#payer-email").value.trim();
      const phone = $("#payer-phone").value.trim();
      const ref = $("#payer-ref").value.trim() || `ETS-REF-${Math.floor(100000 + Math.random() * 900000)}`;
      const usdAmount = getActiveAmountUsd();

      if (!name || !email || !phone) {
        if (statusEl) {
          statusEl.textContent = "Please fill in all required contact details.";
          statusEl.classList.add("err");
        }
        return;
      }

      // Method-specific validation
      if (currentMethod === "card") {
        const cardNum = ($("#card-number")?.value || "").replace(/\s/g, "");
        const cardExp = $("#card-expiry")?.value || "";
        const cardCvc = $("#card-cvc")?.value || "";
        if (cardNum.length < 15 || cardExp.length < 5 || cardCvc.length < 3) {
          if (statusEl) {
            statusEl.textContent = "Please enter valid card details (number, expiry MM/YY, and CVC).";
            statusEl.classList.add("err");
          }
          return;
        }
      } else if (currentMethod === "momo") {
        const momoPhone = $("#momo-phone")?.value.trim() || "";
        if (momoPhone.length < 9) {
          if (statusEl) {
            statusEl.textContent = "Please enter your valid Mobile Money phone number.";
            statusEl.classList.add("err");
          }
          return;
        }
      }

      // Loading state
      const submitBtn = $("#submit-payment-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("loading");
      }

      if (statusEl) {
        statusEl.textContent = "Securing connection & processing transaction...";
        statusEl.classList.add("info");
      }

      // Simulate payment network roundtrip (1.2s)
      await new Promise((r) => setTimeout(r, 1200));

      const txnId = `ETS-TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const planObj = PLANS[currentPlan] || PLANS.full;
      const formattedTotal = formatMoney(usdAmount, currentCurrency);
      const paidDate = new Date().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });

      // Populate Receipt
      $("#receipt-txn-id").textContent = txnId;
      $("#receipt-date").textContent = paidDate;
      $("#receipt-name").textContent = name;
      $("#receipt-email").textContent = email;
      $("#receipt-phone").textContent = phone;
      $("#receipt-student-ref").textContent = ref;
      $("#receipt-purpose").textContent = planObj.name;
      $("#receipt-method").textContent = currentMethod === "card"
        ? "Debit / Credit Card (Encrypted)"
        : currentMethod === "momo"
        ? `Mobile Money (${currentMomoNet} - ${$("#momo-phone").value.trim()})`
        : "Direct Bank Transfer / Wire";
      $("#receipt-total-paid").textContent = formattedTotal;

      // Switch to Receipt View
      checkoutView.hidden = true;
      receiptView.hidden = false;
      receiptView.scrollIntoView({ behavior: "smooth", block: "start" });

      // Send EmailJS Notification if configured
      if (window.emailjs && window.CONFIG && CONFIG.EMAILJS && CONFIG.EMAILJS.PUBLIC_KEY && CONFIG.EMAILJS.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        try {
          emailjs.send(CONFIG.EMAILJS.SERVICE_ID, CONFIG.EMAILJS.TEMPLATE_CONFIRM, {
            to_name: name,
            to_email: email,
            reference_number: ref,
            txn_id: txnId,
            amount_paid: formattedTotal,
            purpose: planObj.name,
            programme_name: "Data Analysis Programme",
            start_date: "November 10, 2026",
          });
        } catch (_) {
          /* fail gracefully */
        }
      }
    });
  }

  // Print button
  const printBtn = $("#print-receipt-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
});

