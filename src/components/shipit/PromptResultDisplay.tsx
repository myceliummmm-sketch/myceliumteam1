import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptResultDisplayProps {
  prompt: string;
  cardCount: number;
  tokenCount: number | null;
  onRegenerate: () => void;
  onClose: () => void;
}

export function PromptResultDisplay({
  prompt,
  cardCount,
  tokenCount,
  onRegenerate,
  onClose,
}: PromptResultDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Generated Prompt</h3>
          <p className="text-sm text-muted-foreground">
            Synthesized from {cardCount} cards
            {tokenCount && ` • ${tokenCount.toLocaleString()} tokens`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
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

      <div className="relative">
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[400px] whitespace-pre-wrap font-mono">
          {prompt}
        </pre>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy & Close'}
        </Button>
      </div>
    </div>
  );
}
