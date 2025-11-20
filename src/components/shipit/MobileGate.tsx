import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Gamepad2, X } from 'lucide-react';
import { DesktopPrompt } from './DesktopPrompt';
import { DestroyOfficeGame } from './DestroyOfficeGame';

export function MobileGate() {
  const [mode, setMode] = useState<'gate' | 'desktop' | 'game' | null>('gate');

  useEffect(() => {
    const dismissed = localStorage.getItem('mobile_gate_dismissed');
    if (dismissed === 'true') {
      setMode(null);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('mobile_gate_dismissed', 'true');
    setMode(null);
  };

  if (mode === null) return null;

  if (mode === 'desktop') {
    return <DesktopPrompt onBack={() => setMode('gate')} onDismiss={handleDismiss} />;
  }

  if (mode === 'game') {
    return <DestroyOfficeGame onBack={() => setMode('gate')} onDismiss={handleDismiss} />;
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome to ShipIt!</h1>
          <p className="text-muted-foreground">
            This game works best on desktop. Choose how you'd like to proceed:
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setMode('desktop')}
            className="w-full h-auto py-4 flex flex-col items-center gap-2"
            variant="default"
          >
            <Monitor className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Switch to Desktop</div>
              <div className="text-xs opacity-80">Get QR code & transfer link</div>
            </div>
          </Button>

          <Button
            onClick={() => setMode('game')}
            className="w-full h-auto py-4 flex flex-col items-center gap-2"
            variant="secondary"
          >
            <Gamepad2 className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Play Destroy the Office</div>
              <div className="text-xs opacity-80">Mini-game while you wait</div>
            </div>
          </Button>

          <Button
            onClick={handleDismiss}
            className="w-full"
            variant="outline"
          >
            <X className="w-4 h-4 mr-2" />
            Continue on Mobile Anyway
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          You can change this preference later in settings
        </p>
      </div>
    </div>
  );
}
