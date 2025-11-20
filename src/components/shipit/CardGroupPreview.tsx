import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import { useState } from "react";
import { CardGroup } from "@/lib/cardGrouping";

interface CardGroupPreviewProps {
  group: CardGroup;
  selected: boolean;
  onToggle: (selected: boolean) => void;
  onPreview?: () => void;
}

export const CardGroupPreview = ({ group, selected, onToggle, onPreview }: CardGroupPreviewProps) => {
  const [expanded, setExpanded] = useState(false);

  const getGroupColor = () => {
    if (group.metadata?.color) return group.metadata.color;
    
    switch (group.groupType) {
      case 'phase': return 'hsl(var(--primary))';
      case 'character': return 'hsl(var(--accent))';
      case 'tag': return 'hsl(var(--secondary))';
      case 'event': return 'hsl(var(--muted))';
      case 'semantic': return 'hsl(var(--primary))';
      default: return 'hsl(var(--muted))';
    }
  };

  const coherenceColor = group.coherenceScore >= 0.9 ? 'text-green-600' :
                          group.coherenceScore >= 0.7 ? 'text-yellow-600' :
                          'text-orange-600';

  return (
    <Card 
      className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4"
      style={{ borderLeftColor: getGroupColor() }}
      onClick={() => onToggle(!selected)}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={selected}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-foreground">{group.title}</h4>
            <Badge variant="secondary" className="text-xs">
              {group.cards.length} cards
            </Badge>
            <Badge variant="outline" className={`text-xs ${coherenceColor}`}>
              {Math.round(group.coherenceScore * 100)}% coherent
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {group.description}
          </p>

          {/* Preview cards */}
          {expanded && (
            <div className="space-y-2 mt-3 pl-2 border-l-2 border-border">
              {group.cards.slice(0, 5).map((card) => (
                <div key={card.id} className="text-xs">
                  <span className="font-medium text-foreground">{card.title}</span>
                  <span className="text-muted-foreground"> • {card.card_type}</span>
                </div>
              ))}
              {group.cards.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{group.cards.length - 5} more cards
                </div>
              )}
            </div>
          )}

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {group.metadata?.phase && (
              <Badge variant="outline" className="text-xs">
                {group.metadata.phase}
              </Badge>
            )}
            {group.metadata?.character && (
              <Badge variant="outline" className="text-xs">
                {group.metadata.character}
              </Badge>
            )}
            {group.metadata?.tags && group.metadata.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
