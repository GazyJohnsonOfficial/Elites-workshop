export interface Region {
  NAME: string;
  SHORT: string;
  PHONE_DISPLAY: string;
  PHONE_E164: string;
  EMAIL: string;
  ADDRESS: string;
  HOURS: string;
  MOCK: boolean;
}

export interface ProgrammeConfig {
  NAME: string;
  START_DATE_TEXT: string;
  START_DATE_ISO: string;
  START_DATE_ICS: string;
  DURATION: string;
  SCHEDULE: string;
  FORMAT: string;
  TUITION: string;
  TUITION_URL: string;
}

export interface CurrencyConfig {
  SYMBOL: string;
  CODE: string;
  RATE: number;
  NAME: string;
}

export interface BankConfig {
  NAME: string;
  BANK: string;
  ACCOUNT_NAME: string;
  MOMO_MERCHANT?: string;
  LOCATION: string;
}

export interface SiteConfig {
  COMPANY: string;
  TAGLINE: string;
  REGIONS: Record<string, Region>;
  PROGRAMME: ProgrammeConfig;
  CONTACT: {
    EMAIL: string;
    EMAIL_GENERAL: string;
    EMAIL_ACADEMY: string;
    PHONE_DISPLAY: string;
    PHONE_E164: string;
    WHATSAPP_NUMBER: string;
    WEBSITE_DISPLAY: string;
    WEBSITE_URL: string;
    CALENDAR_BOOKING_URL: string;
  };
  PAYMENT: {
    CHECKOUT_URL: string;
    TUITION_FULL_USD: number;
    TUITION_DEPOSIT_USD: number;
    CURRENCIES: Record<string, CurrencyConfig>;
    BANKS: Record<string, BankConfig>;
  };
  SOCIALS: {
    facebook: string;
    instagram: string;
    linkedin: string;
    x: string;
    youtube: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  COMPANY: "Elites Tech Solutions LLC",
  TAGLINE: "Technology that works as hard as your organization.",

  REGIONS: {
    us: {
      NAME: "United States",
      SHORT: "US",
      PHONE_DISPLAY: "+1 (609) 304-7571",
      PHONE_E164: "+16093047571",
      EMAIL: "hello@elitestechsolutions.com",
      ADDRESS: "Medford, NJ, USA",
      HOURS: "Mon to Fri, 9:00 to 17:00 ET",
      MOCK: false,
    },
    gh: {
      NAME: "Ghana",
      SHORT: "GH",
      PHONE_DISPLAY: "+233 53 353 4687",
      PHONE_E164: "+233533534687",
      EMAIL: "ghana@elitestechsolutions.com",
      ADDRESS: "Poolside Ave, Takoradi, Ghana",
      HOURS: "Mon to Fri, 8:00 to 17:00 GMT",
      MOCK: false,
    },
    uk: {
      NAME: "United Kingdom",
      SHORT: "UK",
      PHONE_DISPLAY: "+1 (609) 304-7571",
      PHONE_E164: "+16093047571",
      EMAIL: "uk@elitestechsolutions.com",
      ADDRESS: "Rugby, UK",
      HOURS: "Mon to Fri, 9:00 to 17:00 GMT",
      MOCK: false,
    },
  },

  PROGRAMME: {
    NAME: "Data Analysis Program",
    START_DATE_TEXT: "November 10, 2026",
    START_DATE_ISO: "2026-11-10T00:00:00Z",
    START_DATE_ICS: "20261110",
    DURATION: "3 months (12 weeks)",
    SCHEDULE: "3 live sessions per week, 1 hour each (36 sessions in total)",
    FORMAT: "Online, live on Zoom",
    TUITION: "USD 1,000",
    TUITION_URL: "/tuition",
  },

  CONTACT: {
    EMAIL: "hello@elitestechsolutions.com",
    EMAIL_GENERAL: "contact@elitestechsolutions.com",
    EMAIL_ACADEMY: "training@elitestechsolutions.com",
    PHONE_DISPLAY: "+1 (609) 304-7571",
    PHONE_E164: "+16093047571",
    WHATSAPP_NUMBER: "16093047571",
    WEBSITE_DISPLAY: "www.elitestechsolutions.com",
    WEBSITE_URL: "https://www.elitestechsolutions.com",
    CALENDAR_BOOKING_URL: "",
  },

  PAYMENT: {
    CHECKOUT_URL: "/tuition",
    TUITION_FULL_USD: 1000,
    TUITION_DEPOSIT_USD: 500,
    CURRENCIES: {
      USD: { SYMBOL: "$", CODE: "USD", RATE: 1.0, NAME: "US Dollar" },
      GHS: { SYMBOL: "GH₵", CODE: "GHS", RATE: 15.5, NAME: "Ghana Cedi" },
      GBP: { SYMBOL: "£", CODE: "GBP", RATE: 0.78, NAME: "British Pound" },
    },
    BANKS: {
      us: {
        NAME: "United States",
        BANK: "Mercury / JPMorgan Chase Bank",
        ACCOUNT_NAME: "Elites Tech Solutions LLC",
        LOCATION: "Medford, NJ, USA",
      },
      gh: {
        NAME: "Ghana",
        BANK: "Ecobank Ghana / Stanbic Bank",
        ACCOUNT_NAME: "Elites Tech Solutions LLC",
        MOMO_MERCHANT: "+233 53 353 4687",
        LOCATION: "Poolside Ave, Takoradi, Ghana",
      },
      uk: {
        NAME: "United Kingdom",
        BANK: "Barclays Bank UK / Wise",
        ACCOUNT_NAME: "Elites Tech Solutions LLC",
        LOCATION: "Rugby, UK",
      },
    },
  },

  SOCIALS: {
    facebook: "",
    instagram: "",
    linkedin: "https://www.linkedin.com/company/elites-tech-solutions",
    x: "",
    youtube: "",
  },
};
