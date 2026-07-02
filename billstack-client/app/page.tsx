import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProductPreview } from '@/components/landing/ProductPreview';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DeveloperSection } from '@/components/landing/DeveloperSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Billstack — Subscription Infrastructure for Nigerian SaaS',
  description: 'A composable API for recurring billing, intelligent dunning, and Nomba-powered multi-split routing. Go live in hours, not months.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white/10 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProductPreview />
      <WorkflowSection />
      <FeaturesSection />
      <DeveloperSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
