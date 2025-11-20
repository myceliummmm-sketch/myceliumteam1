import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DesktopPromptProps {
  onBack: () => void;
  onDismiss: () => void;
}

export function DesktopPrompt({ onBack, onDismiss }: DesktopPromptProps) {
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center space-y-2">
            <Monitor className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Switch to Desktop</h2>
            <p className="text-muted-foreground">
              For the best experience, open ShipIt on your laptop or desktop computer
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-4">Scan with your phone</p>
              <div className="bg-background p-4 rounded-lg inline-block">
                <QRCodeSVG value={currentUrl} size={200} />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-2">Or copy the link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
                />
                <Button onClick={handleCopyLink} size="sm">
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Why Desktop?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Larger screen for better visibility</li>
              <li>• Full keyboard for faster input</li>
              <li>• More screen space for all panels</li>
              <li>• Optimized UI and layout</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={onDismiss} variant="outline" className="flex-1">
              Continue on Mobile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
