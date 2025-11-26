import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, LayoutGrid, Search } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";

interface ChatOnboardingProps {
  open: boolean;
  onClose: () => void;
  onStartResearch: () => void;
  onViewCollection: () => void;
}

export const ChatOnboarding = ({ 
  open, 
  onClose, 
  onStartResearch, 
  onViewCollection 
}: ChatOnboardingProps) => {
  const { setHasSeenChatOnboarding } = useGameStore();

  const handleExploreChat = () => {
    setHasSeenChatOnboarding(true);
    onClose();
  };

  const handleStartResearch = () => {
    setHasSeenChatOnboarding(true);
    onStartResearch();
  };

  const handleViewCollection = () => {
    setHasSeenChatOnboarding(true);
    onViewCollection();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6 py-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Your Project Chat!</h2>
            <p className="text-muted-foreground">
              You've completed the ideation stage. Now you can explore deeper.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4"
          >
            <div className="p-4 bg-card border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Generate Cards by Chatting</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with your AI advisory team to generate insights, strategies, and ideas. 
                    Each valuable conversation creates collectible cards.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Deep Research Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Ready to dive deeper? Start a structured research session to validate your ideas 
                    with market insights and team perspectives.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <LayoutGrid className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Card Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    All your insights are saved as cards. Build decks, flip cards to see details, 
                    and prepare for the marketplace.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4"
          >
            <Button
              onClick={handleStartResearch}
              size="lg"
              className="h-auto py-4 flex flex-col gap-2"
            >
              <Search className="w-6 h-6" />
              <div>
                <div className="font-bold">Start Research</div>
                <div className="text-xs opacity-80">Guided flow</div>
              </div>
            </Button>

            <Button
              onClick={handleExploreChat}
              variant="outline"
              size="lg"
              className="h-auto py-4 flex flex-col gap-2"
            >
              <MessageSquare className="w-6 h-6" />
              <div>
                <div className="font-bold">Explore Chat</div>
                <div className="text-xs opacity-80">Free conversation</div>
              </div>
            </Button>

            <Button
              onClick={handleViewCollection}
              variant="outline"
              size="lg"
              className="h-auto py-4 flex flex-col gap-2"
            >
              <LayoutGrid className="w-6 h-6" />
              <div>
                <div className="font-bold">View Collection</div>
                <div className="text-xs opacity-80">See your cards</div>
              </div>
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
