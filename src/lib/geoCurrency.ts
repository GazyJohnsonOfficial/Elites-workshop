import type { CurrencyCode } from "./academyStore";

export const REGION_CURRENCY_COOKIE = "ets_region_currency";
export const REGION_COUNTRY_COOKIE = "ets_region_country";
export const REGION_SOURCE_COOKIE = "ets_region_source";

export const REGION_HEADER_CURRENCY = "x-ets-region-currency";
export const REGION_HEADER_COUNTRY = "x-ets-region-country";

export type RegionSource = "geo" | "locale" | "override" | "default";

export type DefaultRegionCountry = "Ghana" | "United Kingdom" | "United States";

export const GEO_COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-geo-country",
] as const;

export function normalizeCurrencyCode(raw?: string | null): CurrencyCode | null {
  if (!raw) return null;
  const upper = raw.trim().toUpperCase();
  if (upper === "USD" || upper === "GHS" || upper === "GBP") {
    return upper;
  }
  return null;
}

export function normalizeIsoCountryCode(raw?: string | null): string | null {
  if (!raw) return null;
  const upper = raw.trim().toUpperCase();
  // Exclude CDN unknown/Tor placeholders
  if (!/^[A-Z]{2}$/.test(upper) || upper === "XX" || upper === "T1") {
    return null;
  }
  return upper;
}

export function mapCountryCodeToCurrency(countryCode?: string | null): CurrencyCode {
  const normalized = normalizeIsoCountryCode(countryCode);
  if (normalized === "GH") return "GHS";
  if (normalized === "GB" || normalized === "UK") return "GBP";
  return "USD";
}

export function mapCountryNameToCurrency(countryName?: string | null): CurrencyCode {
  if (!countryName) return "USD";
  const lower = countryName.trim().toLowerCase();
  if (
    lower === "gh" ||
    lower.includes("ghana") ||
    lower.includes("accra") ||
    lower.includes("takoradi")
  ) {
    return "GHS";
  }
  if (
    lower === "gb" ||
    lower === "uk" ||
    lower.includes("united kingdom") ||
    lower.includes("great britain") ||
    lower.includes("britain") ||
    lower.includes("england") ||
    lower.includes("scotland") ||
    lower.includes("wales") ||
    lower.includes("london")
  ) {
    return "GBP";
  }
  return "USD";
}

export function mapCurrencyToDefaultCountry(currency: CurrencyCode): DefaultRegionCountry {
  if (currency === "GHS") return "Ghana";
  if (currency === "GBP") return "United Kingdom";
  return "United States";
}

export function inferRegionFromAcceptLanguage(
  acceptLang?: string | null
): { currency: CurrencyCode; countryCode: string } | null {
  if (!acceptLang) return null;
  const primary = acceptLang.split(",")[0]?.split(";")[0]?.trim().toLowerCase() || "";
  if (primary.endsWith("-gh") || primary === "ak" || primary === "ee" || primary === "tw") {
    return { currency: "GHS", countryCode: "GH" };
  }
  if (primary === "en-gb" || primary.endsWith("-gb")) {
    return { currency: "GBP", countryCode: "GB" };
  }
  return null;
}

export function inferRegionFromBrowserLocale(
  timeZone?: string,
  language?: string
): { currency: CurrencyCode; countryCode: string } {
  const tz = (timeZone || "").trim();
  const lang = (language || "").trim().toLowerCase();

  if (tz === "Africa/Accra" || lang.endsWith("-gh")) {
    return { currency: "GHS", countryCode: "GH" };
  }
  if (tz === "Europe/London" || lang === "en-gb" || lang.endsWith("-gb")) {
    return { currency: "GBP", countryCode: "GB" };
  }
  return { currency: "USD", countryCode: "US" };
}

export function readBrowserCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = decodeURIComponent(part.slice(0, idx));
    if (key === name) {
      return decodeURIComponent(part.slice(idx + 1));
    }
  }
  return null;
}

export function getClientDetectedRegion(): {
  currency: CurrencyCode;
  countryCode: string;
  defaultCountry: DefaultRegionCountry;
} {
  const cookieCurrency = normalizeCurrencyCode(
    readBrowserCookie(REGION_CURRENCY_COOKIE)
  );
  const cookieCountry = normalizeIsoCountryCode(
    readBrowserCookie(REGION_COUNTRY_COOKIE)
  );
  if (cookieCurrency) {
    return {
      currency: cookieCurrency,
      countryCode:
        cookieCountry ||
        (cookieCurrency === "GHS" ? "GH" : cookieCurrency === "GBP" ? "GB" : "US"),
      defaultCountry: mapCurrencyToDefaultCountry(cookieCurrency),
    };
  }
  const timeZone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "";
  const language = typeof navigator !== "undefined" ? navigator.language : "";
  const inferred = inferRegionFromBrowserLocale(timeZone, language);
  return {
    ...inferred,
    defaultCountry: mapCurrencyToDefaultCountry(inferred.currency),
  };
}
