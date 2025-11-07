import { Artifact } from '@/types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

interface ArtifactModalProps {
  artifact: Artifact;
  onClose: () => void;
}

export function ArtifactModal({ artifact, onClose }: ArtifactModalProps) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(artifact.prompt.template);
    setCopied(true);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            {artifact.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
            <TabsTrigger value="prompt">AI Prompt</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                {artifact.phase} PHASE
              </Badge>
              <p className="text-lg font-medium mb-2">{artifact.description}</p>
              <p className="text-sm text-muted-foreground italic">
                "{artifact.lore}"
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Unlocked At</h4>
              <p className="text-sm text-muted-foreground">
                {artifact.unlockedAt ? new Date(artifact.unlockedAt).toLocaleDateString() : 'Not unlocked yet'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Passive Bonuses</h4>
              <div className="space-y-2">
                {artifact.passiveBonuses.xpMultiplier && (
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm">XP Gain</span>
                    <Badge variant="default">
                      +{((artifact.passiveBonuses.xpMultiplier - 1) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                )}
                {artifact.passiveBonuses.energyRegenBonus && (
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm">Max Energy</span>
                    <Badge variant="default">
                      +{artifact.passiveBonuses.energyRegenBonus}
                    </Badge>
                  </div>
                )}
                {artifact.passiveBonuses.sporeMultiplier && (
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm">Spore Gain</span>
                    <Badge variant="default">
                      +{((artifact.passiveBonuses.sporeMultiplier - 1) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Unlocked Features</h4>
              <div className="space-y-2">
                {artifact.unlocks.newAdvisor && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium">New Team Member</p>
                    <p className="text-xs text-muted-foreground">
                      {artifact.unlocks.newAdvisor} joins your team
                    </p>
                  </div>
                )}
                {artifact.unlocks.specialQuickReplies && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium">Special Quick Replies</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                      {artifact.unlocks.specialQuickReplies.map((reply, i) => (
                        <li key={i}>{reply}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artifact.unlocks.featureUnlock && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium">Feature Unlock</p>
                    <p className="text-xs text-muted-foreground">
                      {artifact.unlocks.featureUnlock}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{artifact.prompt.title}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPrompt}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                {artifact.prompt.template}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How to Use</h4>
              <p className="text-sm text-muted-foreground">
                {artifact.prompt.usageInstructions}
              </p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm">
                <strong>💡 Tip:</strong> Copy this prompt and use it with any AI assistant (ChatGPT, Claude, etc.) 
                to apply the framework to your real projects!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
