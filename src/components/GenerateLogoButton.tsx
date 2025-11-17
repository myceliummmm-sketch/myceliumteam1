import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';

export const GenerateLogoButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const generateLogo = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-logo');
      
      if (error) throw error;
      
      if (data.success && data.imageUrl) {
        setLogoUrl(data.imageUrl);
        toast.success('Logo generated! Right-click to save the image below.');
      } else {
        throw new Error(data.error || 'Failed to generate logo');
      }
    } catch (error: any) {
      console.error('Error generating logo:', error);
      toast.error(`Failed to generate logo: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLogo = () => {
    if (!logoUrl) return;
    
    const link = document.createElement('a');
    link.href = logoUrl;
    link.download = 'mycelium-logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Logo downloaded!');
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg bg-card">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Generate Mycelium Logo</h3>
        <p className="text-sm text-muted-foreground">
          Generate a custom logo for the Mycelium brand using AI.
        </p>
      </div>
      
      <Button 
        onClick={generateLogo} 
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Logo'
        )}
      </Button>

      {logoUrl && (
        <div className="space-y-3">
          <div className="border rounded-lg p-4 bg-background flex items-center justify-center">
            <img 
              src={logoUrl} 
              alt="Generated Mycelium Logo" 
              className="max-w-full h-auto max-h-64"
            />
          </div>
          <Button 
            onClick={downloadLogo}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Logo
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Save this logo to public/mycelium-logo.png and update the email template
          </p>
        </div>
      )}
    </div>
  );
};
