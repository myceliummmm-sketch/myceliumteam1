import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CharacterData } from '@/lib/characterData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Sparkles, Target, Brain } from 'lucide-react';

interface TeamMemberModalProps {
  member: CharacterData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorGradients = {
  cyan: 'from-cyan-500/20 via-background to-background',
  pink: 'from-pink-500/20 via-background to-background',
  green: 'from-green-500/20 via-background to-background',
  purple: 'from-purple-500/20 via-background to-background',
};

const colorAccents = {
  cyan: 'text-cyan-400 border-cyan-400/30',
  pink: 'text-pink-400 border-pink-400/30',
  green: 'text-green-400 border-green-400/30',
  purple: 'text-purple-400 border-purple-400/30',
};

export function TeamMemberModal({ member, open, onOpenChange }: TeamMemberModalProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b ${colorGradients[member.color]}`}>
        <DialogHeader>
          <DialogTitle className="sr-only">{member.name} Profile</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header with Avatar */}
          <div className="flex flex-col items-center text-center space-y-4 pt-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Avatar className="h-32 w-32 border-4 border-border">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            </motion.div>

            <div>
              <h2 className="text-3xl font-bold mb-2">{member.name}</h2>
              <Badge variant="outline" className={`${colorAccents[member.color]} text-sm`}>
                {member.role}
              </Badge>
            </div>

            <p className="text-lg italic text-muted-foreground max-w-md">
              "{member.tagline}"
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 px-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
              <Target className={`h-5 w-5 mt-0.5 ${colorAccents[member.color]}`} />
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-1">CURRENT STATUS</p>
                <p className="text-sm">{member.status}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
              <Sparkles className={`h-5 w-5 mt-0.5 ${colorAccents[member.color]}`} />
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-1">TRACK RECORD</p>
                <p className="text-sm">{member.stat}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="px-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className={`h-5 w-5 ${colorAccents[member.color]}`} />
                <h3 className="text-sm font-mono text-muted-foreground">BACKSTORY</h3>
              </div>
              <div className="p-4 rounded-lg bg-card/30 border border-border/30">
                <p className="text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          )}

          {/* Specialties */}
          {member.specialties && member.specialties.length > 0 && (
            <div className="px-4">
              <h3 className="text-sm font-mono text-muted-foreground mb-3">EXPERTISE</h3>
              <div className="flex flex-wrap gap-2">
                {member.specialties.map((specialty, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="text-xs"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Personality */}
          {member.personality && (
            <div className="px-4 pb-4">
              <h3 className="text-sm font-mono text-muted-foreground mb-2">PERSONALITY</h3>
              <p className="text-sm text-muted-foreground italic">
                {member.personality}
              </p>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
