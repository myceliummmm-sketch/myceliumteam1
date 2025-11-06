import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSegment } from '@/types/game';
import everGreenImg from '@/assets/advisor-ever-green.jpg';
import phoenixImg from '@/assets/advisor-phoenix.jpg';
import prismaImg from '@/assets/advisor-prisma.jpg';
import techPriestImg from '@/assets/advisor-tech-priest.jpg';
import toxicImg from '@/assets/advisor-toxic.jpg';
import virgilImg from '@/assets/advisor-virgil.jpg';
import zenImg from '@/assets/advisor-zen.jpg';

const avatarMap: Record<string, string> = {
  ever: everGreenImg,
  prisma: prismaImg,
  toxic: toxicImg,
  phoenix: phoenixImg,
  techpriest: techPriestImg,
  virgil: virgilImg,
  zen: zenImg,
};

interface MessageBubbleProps {
  segment: MessageSegment;
  showAvatar: boolean;
  animate?: boolean;
}

export function MessageBubble({ segment, showAvatar, animate = true }: MessageBubbleProps) {
  const bubbleContent = (
    <div className="flex gap-3 items-start">
      {showAvatar && segment.speaker ? (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarMap[segment.speaker]} alt={segment.speaker} />
          <AvatarFallback>{segment.speaker[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8" /> // Spacer to maintain alignment
      )}
      <div className={`rounded-lg p-3 ${
        segment.type === 'narration' 
          ? 'bg-muted/50 italic text-muted-foreground' 
          : 'bg-muted'
      }`}>
        {showAvatar && segment.speaker && (
          <p className="text-xs font-bold text-primary mb-1">
            {segment.speaker.toUpperCase()}
          </p>
        )}
        <p className={segment.type === 'narration' ? 'italic text-muted-foreground' : ''}>
          {segment.content}
        </p>
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {bubbleContent}
      </motion.div>
    );
  }

  return <div>{bubbleContent}</div>;
}
