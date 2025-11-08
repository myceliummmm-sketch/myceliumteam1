interface Benefit {
  emoji: string;
  text: string;
}

interface BenefitsListProps {
  benefits: Benefit[];
}

export function BenefitsList({ benefits }: BenefitsListProps) {
  return (
    <div className="space-y-3">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="flex items-start gap-3 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="text-2xl flex-shrink-0">{benefit.emoji}</span>
          <p className="text-sm text-muted-foreground pt-1">{benefit.text}</p>
        </div>
      ))}
    </div>
  );
}
