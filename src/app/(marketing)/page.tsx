import { Hero } from "@/features/marketing/hero";
import { ProductionSection } from "@/features/marketing/production-section";
import { SolutionsSection } from "@/features/marketing/solutions-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SolutionsSection />
      <ProductionSection />
    </>
  );
}
