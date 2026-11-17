import { cookies, headers } from "next/headers";
import type { CurrencyCode } from "./academyStore";
import {
  GEO_COUNTRY_HEADERS,
  REGION_CURRENCY_COOKIE,
  REGION_HEADER_CURRENCY,
  REGION_SOURCE_COOKIE,
  inferRegionFromAcceptLanguage,
  mapCountryCodeToCurrency,
  mapCurrencyToDefaultCountry,
  normalizeCurrencyCode,
  normalizeIsoCountryCode,
  type DefaultRegionCountry,
  type RegionSource,
} from "./geoCurrency";

export interface ServerRegionContext {
  currency: CurrencyCode;
  defaultCountry: DefaultRegionCountry;
  source: RegionSource;
}

export async function getServerRegionContext(): Promise<ServerRegionContext> {
  const hdrs = await headers();
  const cookieStore = await cookies();

  // 1. Live IP geolocation headers from edge/CDN proxy (always highest trust)
  for (const name of GEO_COUNTRY_HEADERS) {
    const code = normalizeIsoCountryCode(hdrs.get(name));
    if (code) {
      const currency = mapCountryCodeToCurrency(code);
      return {
        currency,
        defaultCountry: mapCurrencyToDefaultCountry(currency),
        source: "geo",
      };
    }
  }

  // 2. Request header injected by middleware (covers first request with ?currency/?country)
  const headerCurrency = normalizeCurrencyCode(hdrs.get(REGION_HEADER_CURRENCY));
  const rawSource = cookieStore.get(REGION_SOURCE_COOKIE)?.value;
  const cookieSource: RegionSource =
    rawSource === "geo" || rawSource === "locale" || rawSource === "override"
      ? rawSource
      : "default";

  if (headerCurrency) {
    return {
      currency: headerCurrency,
      defaultCountry: mapCurrencyToDefaultCountry(headerCurrency),
      source: cookieSource === "default" ? "locale" : cookieSource,
    };
  }

  // 3. Previously resolved region cookie (CDN geo, browser locale sync, or QA override)
  const cookieCurrency = normalizeCurrencyCode(
    cookieStore.get(REGION_CURRENCY_COOKIE)?.value
  );
  if (cookieCurrency) {
    return {
      currency: cookieCurrency,
      defaultCountry: mapCurrencyToDefaultCountry(cookieCurrency),
      source: cookieSource,
    };
  }

  // 4. First-visit Accept-Language country hint (e.g. en-GB -> GBP)
  const acceptMatch = inferRegionFromAcceptLanguage(hdrs.get("accept-language"));
  if (acceptMatch) {
    return {
      currency: acceptMatch.currency,
      defaultCountry: mapCurrencyToDefaultCountry(acceptMatch.currency),
      source: "locale",
    };
  }

  return {
    currency: "USD",
    defaultCountry: "United States",
    source: "default",
  };
}
