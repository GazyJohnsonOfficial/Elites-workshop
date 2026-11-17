import { NextResponse, type NextRequest } from "next/server";
import type { CurrencyCode } from "./lib/academyStore";
import {
  GEO_COUNTRY_HEADERS,
  REGION_COUNTRY_COOKIE,
  REGION_CURRENCY_COOKIE,
  REGION_HEADER_COUNTRY,
  REGION_HEADER_CURRENCY,
  REGION_SOURCE_COOKIE,
  inferRegionFromAcceptLanguage,
  mapCountryCodeToCurrency,
  normalizeCurrencyCode,
  normalizeIsoCountryCode,
  type RegionSource,
} from "./lib/geoCurrency";

function setRegionCookies(
  response: NextResponse,
  currency: CurrencyCode,
  countryCode: string,
  source: RegionSource
) {
  const cookieOptions = {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax" as const,
  };
  response.cookies.set(REGION_CURRENCY_COOKIE, currency, cookieOptions);
  response.cookies.set(REGION_COUNTRY_COOKIE, countryCode, cookieOptions);
  response.cookies.set(REGION_SOURCE_COOKIE, source, cookieOptions);
}

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Optional QA/preview query parameter (?currency=GHS|GBP|USD or ?country=GH|GB|US)
  const queryCurrency = normalizeCurrencyCode(searchParams.get("currency"));
  const queryCountry = normalizeIsoCountryCode(searchParams.get("country"));

  let resolvedCurrency: CurrencyCode | null = null;
  let resolvedCountry: string | null = null;
  let source: RegionSource | null = null;

  if (queryCurrency || queryCountry) {
    resolvedCountry =
      queryCountry || (queryCurrency === "GHS" ? "GH" : queryCurrency === "GBP" ? "GB" : "US");
    resolvedCurrency = queryCurrency || mapCountryCodeToCurrency(resolvedCountry);
    source = "override";
  } else {
    // 1. Check standard edge/proxy IP geolocation headers
    for (const headerName of GEO_COUNTRY_HEADERS) {
      const code = normalizeIsoCountryCode(request.headers.get(headerName));
      if (code) {
        resolvedCountry = code;
        resolvedCurrency = mapCountryCodeToCurrency(code);
        source = "geo";
        break;
      }
    }

    // 2. Fall back to existing region cookie (set earlier by CDN geo, locale, or override)
    if (!resolvedCurrency) {
      const cookieCurrency = normalizeCurrencyCode(
        request.cookies.get(REGION_CURRENCY_COOKIE)?.value
      );
      const cookieCountry = normalizeIsoCountryCode(
        request.cookies.get(REGION_COUNTRY_COOKIE)?.value
      );
      if (cookieCurrency) {
        resolvedCurrency = cookieCurrency;
        resolvedCountry =
          cookieCountry ||
          (cookieCurrency === "GHS" ? "GH" : cookieCurrency === "GBP" ? "GB" : "US");
        const rawSource = request.cookies.get(REGION_SOURCE_COOKIE)?.value;
        source =
          rawSource === "geo" || rawSource === "locale" || rawSource === "override"
            ? rawSource
            : "locale";
      }
    }

    // 3. First-visit Accept-Language hint when neither proxy geo nor cookie is present
    if (!resolvedCurrency) {
      const langHint = inferRegionFromAcceptLanguage(
        request.headers.get("accept-language")
      );
      if (langHint) {
        resolvedCurrency = langHint.currency;
        resolvedCountry = langHint.countryCode;
        source = "locale";
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  if (resolvedCurrency) {
    requestHeaders.set(REGION_HEADER_CURRENCY, resolvedCurrency);
  }
  if (resolvedCountry) {
    requestHeaders.set(REGION_HEADER_COUNTRY, resolvedCountry);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (resolvedCurrency && resolvedCountry && source) {
    setRegionCookies(response, resolvedCurrency, resolvedCountry, source);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
