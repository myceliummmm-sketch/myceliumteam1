import { Prompt } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Copy, MessageSquare, Edit, GitFork, Trash2, Star } from 'lucide-react';
import { TEAM_MEMBERS } from '@/lib/characterData';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
  onInsertToChat: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onFork: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
  onToggleFavorite: (prompt: Prompt) => void;
  onClick: (prompt: Prompt) => void;
}

const categoryColors: Record<string, string> = {
  product: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  technical: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  research: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  marketing: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  design: 'bg-green-500/10 text-green-500 border-green-500/20',
  general: 'bg-muted text-muted-foreground border-border',
};

export function PromptCard({
  prompt,
  onCopy,
  onInsertToChat,
  onEdit,
  onFork,
  onDelete,
  onToggleFavorite,
  onClick,
}: PromptCardProps) {
  const creator = TEAM_MEMBERS.find((m) => m.id === prompt.created_by_character);

  return (
    <Card 
      className="group hover:shadow-lg transition-all cursor-pointer relative"
      onClick={() => onClick(prompt)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-2 mb-2">{prompt.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={categoryColors[prompt.category]}>
                {prompt.category}
              </Badge>
              {prompt.phase && (
                <Badge variant="outline">{prompt.phase}</Badge>
              )}
              {prompt.is_template && (
                <Badge variant="secondary">Template</Badge>
              )}
              <Badge variant="outline">v{prompt.version}</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${prompt.is_favorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt);
            }}
          >
            <Star className={`h-4 w-4 ${prompt.is_favorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {prompt.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {creator && (
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>{creator.name[0]}</AvatarFallback>
                </Avatar>
                <span>{creator.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {prompt.times_used > 0 && (
              <span>Used {prompt.times_used}x</span>
            )}
            {prompt.effectiveness_rating && (
              <span>{'⭐'.repeat(prompt.effectiveness_rating)}</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(prompt);
            }}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onInsertToChat(prompt);
            }}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Insert
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onFork(prompt);
            }}
          >
            <GitFork className="h-3 w-3" />
          </Button>
          {!prompt.is_template && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(prompt);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
