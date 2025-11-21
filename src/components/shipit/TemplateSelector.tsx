import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VisionTemplate } from '@/lib/visionTemplates';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface TemplateSelectorProps {
  templates: VisionTemplate[];
  selectedTemplateId: string | null;
  onSelect: (template: VisionTemplate) => void;
}

export function TemplateSelector({ templates, selectedTemplateId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      {templates.map((template, idx) => {
        const isSelected = selectedTemplateId === template.id;
        
        return (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border hover:border-primary/50 hover:bg-accent/50'
              }`}
              onClick={() => onSelect(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    {template.label}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.templateText}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
