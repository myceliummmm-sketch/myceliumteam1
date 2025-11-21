import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VisionTemplate } from '@/lib/visionTemplates';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Star } from 'lucide-react';

interface TemplateSelectorProps {
  templates: VisionTemplate[];
  selectedTemplateId: string | null;
  onSelect: (template: VisionTemplate) => void;
}

export function TemplateSelector({ templates, selectedTemplateId, onSelect }: TemplateSelectorProps) {
  const getDifficulty = (idx: number) => {
    if (idx === 0) return { label: 'Лёгкий', color: 'text-chart-1' };
    if (idx === templates.length - 1) return { label: 'Продвинутый', color: 'text-chart-3' };
    return { label: 'Средний', color: 'text-chart-2' };
  };

  const getEstimatedTime = (idx: number) => {
    return idx === 0 ? '5 мин' : idx === templates.length - 1 ? '15 мин' : '10 мин';
  };

  return (
    <div className="space-y-3">
      {templates.map((template, idx) => {
        const isSelected = selectedTemplateId === template.id;
        const difficulty = getDifficulty(idx);
        const estimatedTime = getEstimatedTime(idx);
        
        return (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              className={`p-5 cursor-pointer transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20'
                  : 'border hover:border-primary/50 hover:bg-accent/30 hover:shadow-md'
              }`}
              onClick={() => onSelect(template)}
            >
              {/* Background gradient on hover */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1 flex items-center gap-2">
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </motion.span>
                        )}
                        {template.label}
                        {idx === 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-chart-1/20 text-chart-1 font-normal">
                            Популярный
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {template.templateText.slice(0, 100)}...
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className={`h-3 w-3 ${difficulty.color}`} />
                      <span className={difficulty.color}>{difficulty.label}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-primary text-4xl"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
