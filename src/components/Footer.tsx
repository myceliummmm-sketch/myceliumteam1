import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
<footer className="bg-dark-purple border-t border-neon-pink/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍄</span>
              <span className="font-black text-lg neon-text-pink">Zero to Hero</span>
            </div>
            <p className="text-sm text-purple-300 mb-4">
              Ship together. Grow forever.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="font-bold text-neon-cyan mb-4">Product</div>
            <ul className="space-y-2 text-sm text-purple-300">
              <li><a href="#how-it-works" className="hover:text-neon-cyan transition-colors">How it Works</a></li>
              <li><a href="#squad" className="hover:text-neon-cyan transition-colors">The Squad</a></li>
              <li><a href="#pricing" className="hover:text-neon-cyan transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-neon-cyan transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-bold text-neon-pink mb-4">Company</div>
            <ul className="space-y-2 text-sm text-purple-300">
              <li><a href="#" className="hover:text-neon-pink transition-colors">About</a></li>
              <li><a href="#" className="hover:text-neon-pink transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-neon-pink transition-colors">Network</a></li>
              <li><a href="#" className="hover:text-neon-pink transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-bold text-neon-cyan mb-4">Legal</div>
            <ul className="space-y-2 text-sm text-purple-300">
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neon-pink/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-purple-400">
            <div>
              © 2025 From Zero to Hero. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <span className="text-neon-pink">♥</span>
              <span>by developers, for developers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </footer>
  );
};

export default Footer;
