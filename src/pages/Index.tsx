import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Hero from "@/components/Hero";
import SocialProofTicker from "@/components/SocialProofTicker";
import ComparisonSection from "@/components/ComparisonSection";
import AdvisorsGrid from "@/components/AdvisorsGrid";
import SuccessStories from "@/components/SuccessStories";
import NetworkJourney from "@/components/NetworkJourney";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import VersionSwitcher from "@/components/VersionSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/shipit');
    }
  }, [user, loading, navigate]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50">
        <VersionSwitcher currentVersion="1.0" variant="compact" />
      </div>
      <Hero />
      <SocialProofTicker />
      <ComparisonSection />
      <AdvisorsGrid />
      <SuccessStories />
      <NetworkJourney />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
