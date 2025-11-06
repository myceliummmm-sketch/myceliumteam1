import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative py-24 px-6 bg-gradient-to-b from-background to-darker-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Main CTA */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-8 leading-tight">
            We're letting in <span className="text-primary">50 founders</span> this week. 
            <br />
            Most will overthink it. 
            <br />
            <span className="text-muted-foreground">You?</span>
          </h2>
          
          <Button 
            onClick={() => window.location.href = '/shipit'}
            size="lg" 
            className="text-xl px-12 py-8 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-mono shadow-[0_0_60px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_80px_hsl(var(--primary)/0.6)] transition-all duration-300 animate-pulse"
          >
            Apply Now
          </Button>
        </div>

        {/* Micro Copy */}
        <div className="space-y-4 text-center text-sm text-muted-foreground font-mono mb-12">
          <p>• backed by real founders you've actually heard of</p>
          <p>• no, we won't spam your inbox</p>
          <p>• yes, you can expense this to your company</p>
        </div>

        {/* Branding */}
        <div className="text-center border-t border-primary/10 pt-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <span className="text-xs font-mono font-bold">M</span>
            </div>
            <span className="text-xl font-mono font-bold">Mycelium</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Building the Digital State for the AI Generation
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>

        <div className="text-center mt-8 text-xs text-muted-foreground/50 font-mono">
          © 2025 Mycelium Ecosystem. All rights reserved.
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </footer>
  );
};

export default Footer;
