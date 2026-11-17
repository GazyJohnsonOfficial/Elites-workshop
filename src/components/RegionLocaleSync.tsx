"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  REGION_COUNTRY_COOKIE,
  REGION_CURRENCY_COOKIE,
  REGION_SOURCE_COOKIE,
  inferRegionFromBrowserLocale,
  normalizeCurrencyCode,
  readBrowserCookie,
} from "@/lib/geoCurrency";

export function RegionLocaleSync() {
  const router = useRouter();

  useEffect(() => {
    const existingSource = readBrowserCookie(REGION_SOURCE_COOKIE);
    // Trust verified CDN IP geo headers or explicit QA overrides without mutating
    if (existingSource === "geo" || existingSource === "override") {
      return;
    }

    const timeZone =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "";
    const language = typeof navigator !== "undefined" ? navigator.language : "";
    const inferred = inferRegionFromBrowserLocale(timeZone, language);
    const existingCurrency = normalizeCurrencyCode(
      readBrowserCookie(REGION_CURRENCY_COOKIE)
    );

    const maxAge = 60 * 60 * 24 * 30;
    const suffix = `; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `${REGION_CURRENCY_COOKIE}=${inferred.currency}${suffix}`;
    document.cookie = `${REGION_COUNTRY_COOKIE}=${inferred.countryCode}${suffix}`;
    document.cookie = `${REGION_SOURCE_COOKIE}=locale${suffix}`;

    window.dispatchEvent(
      new CustomEvent("ets-region-currency-changed", {
        detail: inferred,
      })
    );

    // Re-render current Server Components only if SSR rendered a different fallback currency
    if ((existingCurrency || "USD") !== inferred.currency) {
      router.refresh();
    }
  }, [router]);

  return null;
}
