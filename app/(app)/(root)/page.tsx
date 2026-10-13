import { Announcement } from "@/components/home/announcement";
import { HomeCtas } from "@/components/home/home-ctas";
import { PageTransition } from "@/components/layout/page-transition";
import { ROUTES } from "@/constants/routes";
import { YourComponent } from "@/registry-kromm-ui/bases/radix/kromm-ui/your-component";
import { BreadcrumbJsonLd } from "@/seo/json-ld";

export const dynamic = "force-static";
export const revalidate = false;

export default function IndexPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: ROUTES.HOME }]} />
      <PageTransition>
        <section className="container-wrapper relative">
          <div className="container flex flex-col items-center gap-4 py-16 text-center md:py-20 lg:py-24">
            <Announcement />
            <h1 className="max-w-7xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent">
              kromm ui
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Headless UI components for Base UI, Radix and React Aria with a
              shared visual contract — eight styles compiled at build time — and
              a registry designed for AI agents. Install it with the shadcn CLI.
            </p>

            <HomeCtas className="mt-4" />
          </div>
        </section>

        <section className="container-wrapper pb-8 lg:pb-12">
          <div className="container flex flex-col items-center gap-6">
            <YourComponent className="w-full max-w-md" />
          </div>
        </section>
      </PageTransition>
    </>
  );
}
