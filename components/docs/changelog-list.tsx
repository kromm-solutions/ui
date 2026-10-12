import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChangelogPage } from "@/lib/changelog";
import { getChangelogPages } from "@/lib/changelog";

const formatDate = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ChangelogGrid = ({ pages }: { pages: ChangelogPage[] }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
    {pages.map((page) => (
      <Link
        href={page.url}
        key={page.url}
        transitionTypes={["nav-forward"]}

      >
        <Card >
          <CardHeader >
            {/* <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {page.data.version && (
                  <span className="font-mono text-[11px] font-medium tracking-wide rounded-md border border-primary/15 bg-primary/10 px-2 py-1 text-primary tabular-nums">
                    {page.data.version}
                  </span>
                )}
                <time
                  dateTime={page.date?.toISOString()}
                  className="text-xs text-muted-foreground tabular-nums"
                >
                  {formatDate(page.date)}
                </time>
              </div>
              {page.data.tags?.length ? (
                <div className="flex flex-wrap items-start justify-end gap-1.5">
                  {page.data.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] font-medium uppercase tracking-wide"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
             </div> */}

            <CardTitle >
              {page.data.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {page.data.description ? (
              <p className="text-sm leading-[1.6] text-muted-foreground line-clamp-2">
                {page.data.description}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);

export const ChangelogList = () => {
  const pages = getChangelogPages();

  if (pages.length === 0) {
    return null;
  }

  return <ChangelogGrid pages={pages} />;
};
