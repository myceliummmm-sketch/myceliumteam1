import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  icon: LucideIcon;
  text: string;
  variant?: 'success' | 'urgent' | 'info';
  delay?: number;
}

export function TrustBadge({ icon: Icon, text, variant = 'success', delay = 0 }: TrustBadgeProps) {
  const variantStyles = {
    success: 'text-green-600 dark:text-green-400',
    urgent: 'text-amber-600 dark:text-amber-400',
    info: 'text-primary'
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-sm animate-fade-in",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">{text}</span>
    </div>
  );
}
