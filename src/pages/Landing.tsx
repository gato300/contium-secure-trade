import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { Footer } from '@/components/landing/Footer';

export default function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <Footer />
    </main>
  );
}
