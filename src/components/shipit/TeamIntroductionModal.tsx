import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_MEMBERS } from '@/lib/characterData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, Sparkles } from 'lucide-react';

interface TeamIntroductionModalProps {
  open: boolean;
  onComplete: (takeAssessment: boolean) => void;
}

export function TeamIntroductionModal({ open, onComplete }: TeamIntroductionModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = TEAM_MEMBERS.length + 1; // 7 team members + 1 choice screen

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleChoice = (takeAssessment: boolean) => {
    onComplete(takeAssessment);
  };

  const currentMember = currentSlide < TEAM_MEMBERS.length ? TEAM_MEMBERS[currentSlide] : null;
  const isChoiceScreen = currentSlide === totalSlides - 1;

  return (
    <Dialog open={open} modal>
      <DialogContent 
        className="max-w-3xl p-0 gap-0 overflow-hidden [&>button]:hidden"
      >
        <AnimatePresence mode="wait">
          {!isChoiceScreen && currentMember ? (
            // Team Member Introduction Slide
            <motion.div
              key={`member-${currentSlide}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="p-8 min-h-[500px] flex flex-col"
            >
              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {TEAM_MEMBERS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'w-8 bg-primary' 
                        : idx < currentSlide 
                        ? 'w-1.5 bg-primary/50' 
                        : 'w-1.5 bg-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Member Card */}
              <div className="flex flex-col md:flex-row gap-8 items-center flex-1">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <Avatar className="h-40 w-40 border-4 border-primary/20">
                      <AvatarImage src={currentMember.avatar} alt={currentMember.name} />
                      <AvatarFallback className="text-4xl">
                        {currentMember.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold" style={{ color: currentMember.color }}>
                      {currentMember.name}
                    </h2>
                    <p className="text-lg text-muted-foreground">{currentMember.role}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <p className="text-xl font-semibold text-foreground/90">
                      "{currentMember.tagline}"
                    </p>
                    {currentMember.bio && (
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {currentMember.bio}
                      </p>
                    )}
                  </motion.div>

                  {/* Voice Sample / Greeting */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      {currentMember.name} says:
                    </p>
                    <p className="italic text-foreground/80">
                      {getGreeting(currentMember.id)}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-6">
                <Button onClick={handleNext} size="lg" className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            // Choice Screen
            <motion.div
              key="choice-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 min-h-[500px] flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="space-y-4 max-w-xl">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    <Sparkles className="relative h-16 w-16 text-primary" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold">
                  Now that you've met the team...
                </h2>
                
                <p className="text-lg text-muted-foreground">
                  We work best when we understand <span className="font-semibold text-foreground">YOU</span>.
                </p>

                <p className="text-base text-muted-foreground">
                  Take a quick personality assessment so we can personalize our guidance 
                  and build a unique "Authenticity Card" for your collection.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button
                  onClick={() => handleChoice(true)}
                  size="lg"
                  className="flex-1 gap-2 relative group overflow-hidden"
                >
                  <span className="relative z-10">Know Yourself</span>
                  <Sparkles className="relative z-10 h-4 w-4" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <Button
                  onClick={() => handleChoice(false)}
                  size="lg"
                  variant="outline"
                  className="flex-1"
                >
                  Start Journey Without Assessment
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                You can always take the assessment later from the menu
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get personalized greetings
function getGreeting(memberId: string): string {
  const greetings: Record<string, string> = {
    'ever': "Hi! I believe in the power of your idea. This team is here to help you go from vision to launch—let's turn your idea into a €2M raise!",
    'prisma': "I'll keep us focused on what matters. Ship faster, overthink less. Done beats perfect every single time.",
    'toxic': "I'll hack your app before the bad guys do. Security isn't optional—it's the foundation of trust with your users.",
    'phoenix': "I resurrect failed launches and turn them into growth machines. Let's get you past 10K users and keep scaling.",
    'techpriest': "Boring infrastructure is reliable infrastructure. I'll make sure you have 99.9% uptime and save you €40K on cloud costs.",
    'virgil': "Every pixel tells a story. Let's make yours premium—374 brands elevated to the top tier, yours is next.",
    'zen': "Burn bright, not out. I've saved 89 founders from burnout. Marathons require pacing—let's ship sustainably."
  };
  
  return greetings[memberId] || "Welcome to the team! I'm excited to work with you.";
}
