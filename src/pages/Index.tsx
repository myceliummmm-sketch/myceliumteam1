import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofTicker from "@/components/SocialProofTicker";
import ComparisonSection from "@/components/ComparisonSection";
import AdvisorsGrid from "@/components/AdvisorsGrid";
import JourneyTimeline from "@/components/JourneyTimeline";
import SuccessStories from "@/components/SuccessStories";
import PricingSection from "@/components/PricingSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

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
      <Navbar />
      <Hero />
      <SocialProofTicker />
      <ComparisonSection />
      <AdvisorsGrid />
      <JourneyTimeline />
      <SuccessStories />
      <PricingSection />
      <FAQ />
      <Footer />
      
      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-purple to-transparent z-40">
        <button 
          onClick={() => navigate('/register')}
          className="w-full bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold py-4 rounded-xl neon-glow-pink"
        >
          Join Cohort #3 →
        </button>
      </div>
    </div>
  );
};

export default Index;
