import { HomeHashScroll } from "@/features/marketing/section-link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AccessRequestProvider } from "@/features/access-request/access-request-provider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessRequestProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <HomeHashScroll />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </AccessRequestProvider>
  );
}
