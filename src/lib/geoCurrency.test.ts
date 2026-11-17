import test from "node:test";
import assert from "node:assert/strict";
import {
  inferRegionFromAcceptLanguage,
  inferRegionFromBrowserLocale,
  mapCountryCodeToCurrency,
  mapCountryNameToCurrency,
  mapCurrencyToDefaultCountry,
  normalizeCurrencyCode,
  normalizeIsoCountryCode,
} from "./geoCurrency";

test("mapCountryCodeToCurrency resolves Ghana, UK, US, and global fallbacks", () => {
  assert.equal(mapCountryCodeToCurrency("GH"), "GHS");
  assert.equal(mapCountryCodeToCurrency("gh"), "GHS");
  assert.equal(mapCountryCodeToCurrency("GB"), "GBP");
  assert.equal(mapCountryCodeToCurrency("UK"), "GBP");
  assert.equal(mapCountryCodeToCurrency("US"), "USD");
  assert.equal(mapCountryCodeToCurrency("NG"), "USD");
  assert.equal(mapCountryCodeToCurrency("CA"), "USD");
  assert.equal(mapCountryCodeToCurrency("XX"), "USD");
  assert.equal(mapCountryCodeToCurrency(undefined), "USD");
});

test("mapCountryNameToCurrency resolves checkout hub selections cleanly", () => {
  assert.equal(mapCountryNameToCurrency("Ghana"), "GHS");
  assert.equal(mapCountryNameToCurrency("United Kingdom"), "GBP");
  assert.equal(mapCountryNameToCurrency("United States"), "USD");
  assert.equal(mapCountryNameToCurrency("Nigeria"), "USD");
  assert.equal(mapCountryNameToCurrency("EMEA Multi-Region"), "USD");
});

test("mapCurrencyToDefaultCountry maps regional currencies back to primary hubs", () => {
  assert.equal(mapCurrencyToDefaultCountry("GHS"), "Ghana");
  assert.equal(mapCurrencyToDefaultCountry("GBP"), "United Kingdom");
  assert.equal(mapCurrencyToDefaultCountry("USD"), "United States");
});

test("normalizeCurrencyCode & normalizeIsoCountryCode filter invalid or placeholder inputs", () => {
  assert.equal(normalizeCurrencyCode(" ghs "), "GHS");
  assert.equal(normalizeCurrencyCode("gbp"), "GBP");
  assert.equal(normalizeCurrencyCode("EUR"), null);
  assert.equal(normalizeIsoCountryCode("gh"), "GH");
  assert.equal(normalizeIsoCountryCode("XX"), null);
  assert.equal(normalizeIsoCountryCode("T1"), null);
  assert.equal(normalizeIsoCountryCode("USA"), null);
});

test("inferRegionFromAcceptLanguage and inferRegionFromBrowserLocale map GH and GB accurately", () => {
  assert.deepEqual(inferRegionFromAcceptLanguage("en-GB,en;q=0.9"), {
    currency: "GBP",
    countryCode: "GB",
  });
  assert.deepEqual(inferRegionFromAcceptLanguage("en-GH,en;q=0.9"), {
    currency: "GHS",
    countryCode: "GH",
  });
  assert.equal(inferRegionFromAcceptLanguage("en-US,en;q=0.9"), null);

  assert.deepEqual(inferRegionFromBrowserLocale("Africa/Accra", "en-US"), {
    currency: "GHS",
    countryCode: "GH",
  });
  assert.deepEqual(inferRegionFromBrowserLocale("Europe/London", "en-US"), {
    currency: "GBP",
    countryCode: "GB",
  });
  assert.deepEqual(inferRegionFromBrowserLocale("America/New_York", "en-US"), {
    currency: "USD",
    countryCode: "US",
  });
});
