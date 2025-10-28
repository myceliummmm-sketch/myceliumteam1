import Hero from "@/components/Hero";
import SocialProofTicker from "@/components/SocialProofTicker";
import ComparisonSection from "@/components/ComparisonSection";
import AdvisorsGrid from "@/components/AdvisorsGrid";
import SuccessStories from "@/components/SuccessStories";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <SocialProofTicker />
      <ComparisonSection />
      <AdvisorsGrid />
      <SuccessStories />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
