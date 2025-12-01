import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LovableLaunchButton } from './LovableLaunchButton';

interface PromptResultDisplayProps {
  prompt: string;
  cardCount: number;
  tokenCount: number | null;
  images?: string[];
  onRegenerate: () => void;
  onClose: () => void;
}

export function PromptResultDisplay({
  prompt,
  cardCount,
  tokenCount,
  images = [],
  onRegenerate,
  onClose,
}: PromptResultDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: 'Copied to clipboard!',
        description: 'Prompt is ready to paste into Lovable',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lovable-prompt-${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded!',
      description: 'Prompt saved as Markdown file',
    });
  };

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Prompt Ready</h3>
          <p className="text-sm text-muted-foreground">
            {prompt.length.toLocaleString()} characters • {cardCount} cards
            {tokenCount && ` • ${tokenCount.toLocaleString()} tokens`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Collapsible Preview */}
      <Collapsible open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="text-sm">
              {isPreviewOpen ? 'Hide prompt preview' : 'Show prompt preview'}
            </span>
            {isPreviewOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="relative mt-2">
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[400px] whitespace-pre-wrap font-mono">
              {prompt}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Lovable Launch Button */}
      <LovableLaunchButton prompt={prompt} images={images} />

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="outline" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
      </div>
    </div>
  );
}
