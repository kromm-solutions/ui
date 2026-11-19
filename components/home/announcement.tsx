import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

type GitHubCommit = { sha: string };
type GitHubFile = { filename: string; status: string };
type GitHubCommitDetails = { files?: GitHubFile[] };

const fallback = { name: "Paper", href: "/docs/components/base/paper" };

async function getLatestComponent() {
  try {
    const headers = { Accept: "application/vnd.github+json" };
    const response = await fetch(
      "https://api.github.com/repos/kromm-solutions/ui/commits?path=content/docs/components&per_page=30",
      { headers, next: { revalidate: 600 } }
    );
    if (!response.ok) return fallback;

    const commits = (await response.json()) as GitHubCommit[];
    for (const commit of commits) {
      const detailResponse = await fetch(
        `https://api.github.com/repos/kromm-solutions/ui/commits/${commit.sha}`,
        { headers, next: { revalidate: 600 } }
      );
      if (!detailResponse.ok) break;

      const details = (await detailResponse.json()) as GitHubCommitDetails;
      const added = details.files?.find(
        (file) =>
          file.status === "added" &&
          /^content\/docs\/components\/(base|radix|aria)\/[^/]+\.mdx$/.test(file.filename) &&
          !file.filename.endsWith("/your-component.mdx")
      );
      if (!added) continue;

      const parts = added.filename.split("/");
      const base = parts[3];
      const slug = parts[4].replace(/\.mdx$/, "");
      const name = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { name, href: `/docs/components/${base}/${slug}` };
    }
  } catch {
    // Keep the announcement usable when GitHub is unavailable.
  }
  return fallback;
}

export const Announcement = async () => {
  const component = await getLatestComponent();

  return (
    <Badge asChild variant="secondary">
      <Link href={component.href}>
        <span className="flex size-2 rounded-full bg-blue-500" title="New" />
        New {component.name} component <ArrowRightIcon />
      </Link>
    </Badge>
  );
};
