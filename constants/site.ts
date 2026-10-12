export const FALLBACK_SITE_ORIGIN = "https://ui.kromm.io" as const;

const getBaseUrl = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.SITE_URL ?? FALLBACK_SITE_ORIGIN;
};

const baseUrl = getBaseUrl();

export const REGISTRY_SCOPE = "@kromm" as const;

export const SITE = {
  AUTHOR: {
    NAME: "Kromm Solutions",
    TWITTER: "@kromm_solutions",
  },
  DESCRIPTION: {
    LONG: "A shadcn registry of UI primitives, components, hooks, and blocks across Radix, Base UI and React Aria, in 8 styles and 24 themes. Install with the shadcn CLI and own the code.",
    SHORT: "A shadcn registry by Kromm Solutions",
  },
  KEYWORDS: [
    "shadcn",
    "shadcn registry",
    "component registry",
    "shadcn components",
    "radix ui",
    "base ui",
    "react aria",
    "npx shadcn add",
  ] as const,
  NAME: "kromm",
  OG_IMAGE: `${baseUrl}/og`,
  REGISTRY: baseUrl,
  REGISTRY_SCOPE,
  REGISTRY_URL_PATTERN: `${baseUrl}/r/{name}.json`,
  URL: baseUrl,
};

export const META_THEME_COLORS = {
  dark: "#09090b",
  light: "#ffffff",
};

export const UTM_PARAMS = {
  utm_source: new URL(baseUrl).hostname,
};
