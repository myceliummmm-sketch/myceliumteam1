import { useState } from 'react';
import { Prompt } from '@/types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Copy, MessageSquare, Edit, GitFork, Trash2, Star } from 'lucide-react';
import { TEAM_MEMBERS } from '@/lib/characterData';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  open: boolean;
  onClose: () => void;
  onCopy: (prompt: Prompt) => void;
  onInsertToChat: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onFork: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
  onToggleFavorite: (prompt: Prompt) => void;
  onRate: (prompt: Prompt, rating: number) => void;
}

const categoryColors: Record<string, string> = {
  product: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  technical: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  research: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  marketing: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  design: 'bg-green-500/10 text-green-500 border-green-500/20',
  general: 'bg-muted text-muted-foreground border-border',
};

export function PromptDetailModal({
  prompt,
  open,
  onClose,
  onCopy,
  onInsertToChat,
  onEdit,
  onFork,
  onDelete,
  onToggleFavorite,
  onRate,
}: PromptDetailModalProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  if (!prompt) return null;

  const creator = TEAM_MEMBERS.find((m) => m.id === prompt.created_by_character);
  const contributors = prompt.contributing_characters
    ?.map((id) => TEAM_MEMBERS.find((m) => m.id === id))
    .filter(Boolean);

  const displayRating = hoveredStar ?? prompt.effectiveness_rating ?? 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{prompt.title}</DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={categoryColors[prompt.category]}>
                  {prompt.category}
                </Badge>
                {prompt.phase && <Badge variant="outline">{prompt.phase}</Badge>}
                {prompt.is_template && <Badge variant="secondary">Template</Badge>}
                <Badge variant="outline">v{prompt.version}</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={prompt.is_favorite ? 'text-yellow-500' : 'text-muted-foreground'}
              onClick={() => onToggleFavorite(prompt)}
            >
              <Star className={`h-5 w-5 ${prompt.is_favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {prompt.description && (
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{prompt.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Prompt Text</h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {prompt.prompt_text.split(/(\{\{[^}]+\}\})/).map((part, i) => {
                  if (part.match(/\{\{[^}]+\}\}/)) {
                    return (
                      <span key={i} className="bg-primary/20 text-primary px-1 rounded">
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </div>
            </div>

            {prompt.prompt_variables && prompt.prompt_variables.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Variables</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.prompt_variables.map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Created by</p>
                {creator && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback>{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{creator.name}</span>
                  </div>
                )}
              </div>

              {contributors && contributors.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Contributors</p>
                  <div className="flex -space-x-2">
                    {contributors.map((contributor: any) => (
                      <Avatar key={contributor.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={contributor.avatar} alt={contributor.name} />
                        <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-muted-foreground mb-1">Times Used</p>
                <p className="font-medium">{prompt.times_used}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Your Rating</p>
                <div 
                  className="flex gap-1"
                  onMouseLeave={() => setHoveredStar(null)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onRate(prompt, star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      className="text-yellow-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-4 w-4 ${star <= displayRating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={() => onCopy(prompt)} className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button onClick={() => onInsertToChat(prompt)} variant="secondary" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Insert to Chat
          </Button>
          <Button onClick={() => onEdit(prompt)} variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
          <Button onClick={() => onFork(prompt)} variant="outline">
            <GitFork className="h-4 w-4" />
          </Button>
          {!prompt.is_template && (
            <Button onClick={() => onDelete(prompt)} variant="outline">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
