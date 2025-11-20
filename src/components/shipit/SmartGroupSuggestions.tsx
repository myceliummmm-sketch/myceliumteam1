import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, Sparkles } from "lucide-react";
import { CardGroup, getRecommendedGroups } from "@/lib/cardGrouping";

interface SmartGroupSuggestionsProps {
  allGroups: CardGroup[];
  selectedGroups: string[];
  targetAudience: string;
  detailLevel: string;
  onApplyRecommendations: (groupIds: string[]) => void;
}

export const SmartGroupSuggestions = ({
  allGroups,
  selectedGroups,
  targetAudience,
  detailLevel,
  onApplyRecommendations
}: SmartGroupSuggestionsProps) => {
  const recommended = getRecommendedGroups(allGroups, targetAudience, detailLevel);
  const newRecommendations = recommended.filter(g => !selectedGroups.includes(g.id));

  if (newRecommendations.length === 0) {
    return null;
  }

  const totalCards = newRecommendations.reduce((sum, g) => sum + g.cards.length, 0);
  const uniqueCards = new Set(newRecommendations.flatMap(g => g.cards.map(c => c.id)));

  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary mt-0.5" />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-foreground">Smart Suggestions</h4>
            <Badge variant="secondary" className="text-xs">
              {newRecommendations.length} groups
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Based on your target audience ({targetAudience}) and detail level ({detailLevel}),
            we recommend adding these {newRecommendations.length} groups ({uniqueCards.size} unique cards):
          </p>

          <div className="space-y-2 mb-3">
            {newRecommendations.map((group) => (
              <div key={group.id} className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-3 w-3 text-primary" />
                <span className="font-medium text-foreground">{group.title}</span>
                <Badge variant="outline" className="text-xs">
                  {group.cards.length} cards
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {group.description}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => onApplyRecommendations(newRecommendations.map(g => g.id))}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Apply Recommendations
          </Button>
        </div>
      </div>
    </Card>
  );
};
