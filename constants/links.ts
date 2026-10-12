export const GITHUB = {
  branch: "main",
  org: "kromm-solutions",
  repo: "ui",
  user: "kromm-solutions",
} as const;

const githubUrl = `https://github.com/${GITHUB.org}/${GITHUB.repo}`;

export const LINK = {
  DISCORD: `${githubUrl}/discussions`,
  GITHUB: githubUrl,
  LICENSE: `${githubUrl}/blob/${GITHUB.branch}/LICENSE`,
  PORTFOLIO: "https://ui.kromm.io",
  SHADCN_MCP_DOCS: "https://ui.shadcn.com/docs/mcp",
  SPONSOR: `https://github.com/sponsors/${GITHUB.user}`,
  X: "https://x.com/kromm_solutions",
  X_SHADCN_LABS: "https://x.com/kromm_solutions",
} as const;
