import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-purple/90 backdrop-blur-xl border-b border-neon-cyan/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">🍄</div>
            <span className="text-xl font-bold neon-text-pink">
              From Zero to Hero
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('squad')}
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              Squad
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/register')}
            className="hidden md:block bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-pink/90 hover:to-neon-purple/90 text-white font-bold px-6 py-3 rounded-lg neon-glow-pink transition-all"
          >
            Join Cohort →
          </Button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neon-cyan"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block text-neon-cyan hover:text-neon-cyan/80 w-full text-left"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('squad')}
              className="block text-neon-cyan hover:text-neon-cyan/80 w-full text-left"
            >
              Squad
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block text-neon-cyan hover:text-neon-cyan/80 w-full text-left"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block text-neon-cyan hover:text-neon-cyan/80 w-full text-left"
            >
              FAQ
            </button>
            <Button
              onClick={() => navigate('/register')}
              className="w-full bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold px-6 py-3 rounded-lg"
            >
              Join Cohort →
            </Button>
          </div>
        )}
      </div>

      {/* Scroll Progress Bar */}
      <div
        className="h-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
    </nav>
  );
};

export default Navbar;
