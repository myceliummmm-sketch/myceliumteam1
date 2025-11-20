import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CardGroup } from "@/lib/cardGrouping";
import { CollectibleCard } from "./CollectibleCard";

interface GroupedCardViewProps {
  groups: CardGroup[];
  onCardClick: (card: any) => void;
}

export const GroupedCardView = ({ groups, onCardClick }: GroupedCardViewProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(groups.map(g => g.id))
  );
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const getGroupColor = (group: CardGroup) => {
    if (group.metadata?.color) return group.metadata.color;
    return 'hsl(var(--primary))';
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.id);
        const isSelected = selectedGroups.has(group.id);

        return (
          <div
            key={group.id}
            className="border rounded-lg overflow-hidden"
            style={{ borderLeftWidth: '4px', borderLeftColor: getGroupColor(group) }}
          >
            {/* Group Header */}
            <div className="bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleGroupSelection(group.id)}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleGroup(group.id)}
                  className="p-0 h-auto hover:bg-transparent"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </Button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{group.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {group.cards.length} cards
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(group.coherenceScore * 100)}% coherent
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </div>
            </div>

            {/* Group Cards */}
            {isExpanded && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.cards.map((card) => (
                    <CollectibleCard
                      key={card.id}
                      card={card}
                      onClick={() => onCardClick(card)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
