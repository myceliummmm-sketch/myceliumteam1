import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LovableLaunchButtonProps {
  prompt: string;
  images?: string[];
  disabled?: boolean;
}

const MAX_PROMPT_LENGTH = 50000;
const MAX_IMAGES = 10;

export function LovableLaunchButton({ 
  prompt, 
  images = [], 
  disabled = false 
}: LovableLaunchButtonProps) {
  const [isLaunching, setIsLaunching] = useState(false);

  const validateAndLaunch = () => {
    // Validate prompt length
    if (prompt.length > MAX_PROMPT_LENGTH) {
      toast.error('Prompt too long', {
        description: `Prompt is ${prompt.length.toLocaleString()} characters. Maximum is ${MAX_PROMPT_LENGTH.toLocaleString()}.`
      });
      return;
    }

    // Filter and validate images
    const validImages = images
      .filter(url => url.startsWith('https://'))
      .filter(url => {
        const ext = url.split('.').pop()?.toLowerCase();
        return ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
      })
      .slice(0, MAX_IMAGES);

    setIsLaunching(true);

    try {
      // Encode prompt and images
      const encodedPrompt = encodeURIComponent(prompt);
      let lovableUrl = `https://lovable.dev/?autosubmit=true#prompt=${encodedPrompt}`;

      // Add images as repeated parameters
      if (validImages.length > 0) {
        validImages.forEach(imgUrl => {
          lovableUrl += `&images=${encodeURIComponent(imgUrl)}`;
        });
      }

      // Open in new tab
      window.open(lovableUrl, '_blank', 'noopener,noreferrer');

      toast.success('Opening Lovable...', {
        description: validImages.length > 0 
          ? `Launching with ${validImages.length} image${validImages.length > 1 ? 's' : ''}`
          : 'Creating your project'
      });
    } catch (error) {
      toast.error('Failed to launch', {
        description: 'Could not open Lovable. Please try copying the prompt instead.'
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const isPromptTooLong = prompt.length > MAX_PROMPT_LENGTH;

  return (
    <div className="space-y-2">
      {isPromptTooLong && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Prompt exceeds {MAX_PROMPT_LENGTH.toLocaleString()} character limit 
            ({prompt.length.toLocaleString()} chars). Please shorten it or use the copy button.
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={validateAndLaunch}
        disabled={disabled || isPromptTooLong || isLaunching}
        className="w-full"
        size="lg"
      >
        <Rocket className="w-4 h-4 mr-2" />
        {isLaunching ? 'Launching...' : '🚀 Create Landing in Lovable'}
      </Button>
    </div>
  );
}
