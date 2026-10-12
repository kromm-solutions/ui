import { createMDX } from "fumadocs-mdx/next";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { LINK } = await jiti.import("./constants/links");
const { ROUTES } = await jiti.import("./constants/routes");

// Registry artifacts are static files under public/r. Consumers of the shadcn
// CLI fetch them directly, so we version the URLs by deployment id and serve
// versioned responses with year-long immutable cache headers (vendored from
// reui.io's registry serving strategy — zero serverless invocations, edge
// cache invalidated by query key on each deploy).
const registryDeploymentId =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  "local";

function versionedRegistryDestination(destination) {
  const separator = destination.includes("?") ? "&" : "?";
  return `${destination}${separator}v=${registryDeploymentId}`;
}

function createVersionedRegistryRedirects(source, destination) {
  return [
    {
      source,
      missing: [{ type: "query", key: "v" }],
      destination: versionedRegistryDestination(destination),
      permanent: false,
    },
    {
      source,
      has: [{ type: "query", key: "v", value: "(?<registryVersion>.*)" }],
      destination: `${destination}?v=:registryVersion`,
      permanent: true,
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.100.124", "172.31.255.28"],
  devIndicators: false,
  // Lets Next bust its own static-asset URLs per deployment on Vercel.
  deploymentId: registryDeploymentId === "local" ? undefined : registryDeploymentId,
  experimental: {
    viewTransition: true,
  },
  headers() {
    const link = [
      `<${ROUTES.API_CATALOG}>; rel="api-catalog"`,
      `<${ROUTES.OPENAPI}>; rel="service-desc"`,
      `<${ROUTES.DOCS}>; rel="service-doc"`,
      `<${LINK.SHADCN_MCP_DOCS}>; rel="service-doc"; title="shadcn MCP server"`,
      `<${ROUTES.AGENT_SKILLS_INDEX}>; rel="describedby"`,
    ].join(", ");

    // Only trustworthy immutably when the version query is present; the
    // redirects below guarantee the CLI always ends up on a versioned URL.
    const versionedRegistryHeaders = [
      {
        key: "Cache-Control",
        value:
          "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable",
      },
      {
        key: "CDN-Cache-Control",
        value:
          "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400",
      },
    ];

    return [
      {
        headers: versionedRegistryHeaders,
        has: [{ type: "query", key: "v" }],
        source: "/r/styles/:path*",
      },
      {
        headers: versionedRegistryHeaders,
        has: [{ type: "query", key: "v" }],
        source: "/r/themes/:path*",
      },
      {
        headers: versionedRegistryHeaders,
        has: [{ type: "query", key: "v" }],
        source: "/r/fonts/:path*",
      },
      { headers: [{ key: "Link", value: link }], source: ROUTES.HOME },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*", "./registry-kromm-ui/**/*"],
  },
  redirects() {
    return [
      {
        destination: `${ROUTES.DOCS}.md`,
        permanent: true,
        source: `${ROUTES.DOCS}.mdx`,
      },
      {
        destination: `${ROUTES.DOCS}/:path*.md`,
        permanent: true,
        source: `${ROUTES.DOCS}/:path*.mdx`,
      },
      // shadcn CLI aliases onto the default style (base-nova), versioned.
      ...createVersionedRegistryRedirects(
        "/r/styles/default/:path*",
        "/r/styles/base-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/default/:path*",
        "/r/styles/base-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/new-york/:path*",
        "/r/styles/base-nova/:path*"
      ),
      // Bare-name shorthand: /r/button.json → default style. The lookahead
      // keeps the real /r/registry.json manifest reachable (used by the
      // agent-discovery endpoints).
      ...createVersionedRegistryRedirects(
        "/r/:name((?!registry\\b)[^/]+).json",
        "/r/styles/base-nova/:name.json"
      ),
      // Namespaced CLI form /r/<style>/<name>.json → canonical
      // /r/styles/<style>/<name>.json; (?!styles/) prevents doubling.
      ...createVersionedRegistryRedirects(
        "/r/:style((?!styles/)[^/]+)/:name.json",
        "/r/styles/:style/:name.json"
      ),
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
