/**
 * AfriMatch Payment Routing
 *
 * Determines the default payment provider based on user country.
 * Users can always manually override this choice.
 *
 * Stripe countries:  UK, US, Canada, EU, Australia, UAE
 * Flutterwave countries: Nigeria, Ghana, Kenya, Uganda, South Africa,
 *   Ivory Coast, Senegal, Cameroon, Tanzania, Rwanda, Zambia,
 *   and all Francophone Africa
 */

import type { PaymentProvider } from "./plans";

// ISO 3166-1 alpha-2 country codes that default to Stripe
const STRIPE_COUNTRIES = new Set([
  // United Kingdom
  "GB",
  // United States
  "US",
  // Canada
  "CA",
  // European Union member states
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // Australia
  "AU",
  // New Zealand (grouped with AU)
  "NZ",
  // United Arab Emirates
  "AE",
  // Switzerland (not EU but Stripe-preferred)
  "CH",
  // Norway, Iceland (EEA)
  "NO", "IS",
  // Singapore, Japan, South Korea (Stripe-preferred)
  "SG", "JP", "KR",
]);

// ISO 3166-1 alpha-2 country codes that default to Flutterwave
const FLUTTERWAVE_COUNTRIES = new Set([
  // Core African markets
  "NG", // Nigeria
  "GH", // Ghana
  "KE", // Kenya
  "UG", // Uganda
  "ZA", // South Africa
  "CI", // Ivory Coast (Côte d'Ivoire)
  "SN", // Senegal
  "CM", // Cameroon
  "TZ", // Tanzania
  "RW", // Rwanda
  "ZM", // Zambia
  // Francophone Africa
  "ML", // Mali
  "BF", // Burkina Faso
  "NE", // Niger
  "TD", // Chad
  "MG", // Madagascar
  "BJ", // Benin
  "TG", // Togo
  "GN", // Guinea
  "GA", // Gabon
  "CG", // Congo
  "CD", // DR Congo
  "CF", // Central African Republic
  "DJ", // Djibouti
  "KM", // Comoros
  "MR", // Mauritania
  "SC", // Seychelles
  "MU", // Mauritius
  // Other African markets
  "ET", // Ethiopia
  "EG", // Egypt
  "MA", // Morocco
  "DZ", // Algeria
  "TN", // Tunisia
  "LY", // Libya
  "SD", // Sudan
  "AO", // Angola
  "MZ", // Mozambique
  "ZW", // Zimbabwe
  "BW", // Botswana
  "NA", // Namibia
  "MW", // Malawi
  "LS", // Lesotho
  "SZ", // Eswatini
  "SO", // Somalia
  "ER", // Eritrea
  "SS", // South Sudan
  "GM", // Gambia
  "GW", // Guinea-Bissau
  "SL", // Sierra Leone
  "LR", // Liberia
  "CV", // Cape Verde
  "ST", // São Tomé and Príncipe
  "GQ", // Equatorial Guinea
  "BI", // Burundi
]);

/**
 * Determine the default payment provider for a given country code.
 * Falls back to Stripe for unknown countries.
 */
export function getDefaultProvider(countryCode: string): PaymentProvider {
  const code = countryCode.toUpperCase();
  if (FLUTTERWAVE_COUNTRIES.has(code)) return "flutterwave";
  if (STRIPE_COUNTRIES.has(code)) return "stripe";
  // Default: Stripe for unknown/unlisted countries
  return "stripe";
}

/**
 * Determine the preferred currency for a given country code.
 * Used to display local pricing via Flutterwave.
 */
export function getPreferredCurrency(countryCode: string): string {
  const currencyMap: Record<string, string> = {
    NG: "NGN",
    GH: "GHS",
    KE: "KES",
    UG: "UGX",
    ZA: "ZAR",
    TZ: "TZS",
    RW: "RWF",
    ZM: "ZMW",
    CI: "XOF",
    SN: "XOF",
    CM: "XAF",
    ML: "XOF",
    BF: "XOF",
    NE: "XOF",
    BJ: "XOF",
    TG: "XOF",
    GA: "XAF",
    CG: "XAF",
    CD: "CDF",
    EG: "EGP",
    MA: "MAD",
    DZ: "DZD",
    TN: "TND",
    ET: "ETB",
    AO: "AOA",
    MZ: "MZN",
    GB: "GBP",
    EU: "EUR",
    AU: "AUD",
    CA: "CAD",
    AE: "AED",
    JP: "JPY",
    SG: "SGD",
  };
  return currencyMap[countryCode.toUpperCase()] ?? "USD";
}

/**
 * Get the Flutterwave payment amount for a plan in the user's local currency.
 */
export function getFlutterwaveAmount(
  planPriceUSD: number,
  currency: string
): { amount: number; currency: string } {
  // Exchange rates (approximate — in production, fetch from a live FX API)
  const rates: Record<string, number> = {
    NGN: 1500,
    GHS: 15,
    KES: 130,
    UGX: 3700,
    ZAR: 18.5,
    TZS: 2600,
    RWF: 1300,
    ZMW: 26,
    XOF: 620,
    XAF: 620,
    EGP: 49,
    MAD: 10,
    DZD: 135,
    TND: 3.1,
    ETB: 57,
    AOA: 850,
    MZN: 64,
    GBP: 0.79,
    EUR: 0.92,
    AUD: 1.53,
    CAD: 1.36,
    AED: 3.67,
    JPY: 150,
    SGD: 1.35,
    USD: 1,
  };
  const rate = rates[currency] ?? 1;
  return {
    amount: Math.round(planPriceUSD * rate * 100) / 100,
    currency: rates[currency] ? currency : "USD",
  };
}
