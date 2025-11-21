import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VisionTemplate } from '@/lib/visionTemplates';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface TemplateFillFormProps {
  template: VisionTemplate;
  initialValues?: Record<string, string>;
  onBack: () => void;
  onSubmit: (values: Record<string, string>) => void;
  isSubmitting: boolean;
}

export function TemplateFillForm({ template, initialValues = {}, onBack, onSubmit, isSubmitting }: TemplateFillFormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    template.variables.forEach(variable => {
      if (variable.required && !values[variable.key]?.trim()) {
        newErrors[variable.key] = 'Это поле обязательно';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(values);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h3 className="font-bold text-lg">{template.label}</h3>
      </div>

      <div className="space-y-4">
        {template.variables.map(variable => (
          <div key={variable.key} className="space-y-2">
            <Label htmlFor={variable.key}>
              {variable.label}
              {variable.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            {variable.type === 'textarea' ? (
              <Textarea
                id={variable.key}
                placeholder={variable.placeholder}
                value={values[variable.key] || ''}
                onChange={e => handleChange(variable.key, e.target.value)}
                rows={3}
                disabled={isSubmitting}
                className={errors[variable.key] ? 'border-destructive' : ''}
              />
            ) : (
              <Input
                id={variable.key}
                type={variable.type}
                placeholder={variable.placeholder}
                value={values[variable.key] || ''}
                onChange={e => handleChange(variable.key, e.target.value)}
                maxLength={variable.maxLength}
                disabled={isSubmitting}
                className={errors[variable.key] ? 'border-destructive' : ''}
              />
            )}
            
            {errors[variable.key] && (
              <p className="text-sm text-destructive">{errors[variable.key]}</p>
            )}
            {variable.helpText && (
              <p className="text-xs text-muted-foreground">{variable.helpText}</p>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full gap-2"
        size="lg"
      >
        {isSubmitting ? (
          <>Генерируем карточку...</>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Создать карточку
          </>
        )}
      </Button>
    </Card>
  );
}
