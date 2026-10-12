import { WebMcpTools } from "@/components/agent/web-mcp-tools";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AGENT_DOCS_DIRECTIVE_TEXT } from "@/lib/agent-discovery/directive";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-svh flex-col">
      <blockquote className="sr-only">{AGENT_DOCS_DIRECTIVE_TEXT}</blockquote>
      <WebMcpTools />
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
