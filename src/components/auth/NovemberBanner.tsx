import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function NovemberBanner() {
  return (
    <div className="flex justify-center mb-8 animate-fade-in">
      <Badge 
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-2 text-sm font-semibold animate-pulse shadow-lg"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        NOVEMBER EARLY ACCESS
      </Badge>
    </div>
  );
}
