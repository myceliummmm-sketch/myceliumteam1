import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VisionTemplate } from '@/lib/visionTemplates';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import { getSuggestionsForField } from '@/lib/suggestionLibrary';
import { motion } from 'framer-motion';

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

  const handleChipClick = (key: string, chipValue: string) => {
    const currentValue = values[key] || '';
    const newValue = currentValue ? `${currentValue}, ${chipValue}` : chipValue;
    handleChange(key, newValue);
  };

  const getFieldQuality = (key: string): number => {
    const value = values[key] || '';
    if (!value) return 0;
    if (value.length < 10) return 1;
    if (value.length < 30) return 3;
    if (value.length < 50) return 4;
    return 5;
  };

  const filledCount = template.variables.filter(v => values[v.key]?.trim()).length;
  const totalCount = template.variables.length;

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-background to-accent/5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
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
        <div className="text-sm text-muted-foreground">
          {filledCount}/{totalCount} заполнено
        </div>
      </div>

      <div className="space-y-6">{template.variables.map((variable, idx) => {
          const suggestions = getSuggestionsForField(variable.key);
          const quality = getFieldQuality(variable.key);
          const isFilled = !!values[variable.key]?.trim();

          return (
            <motion.div 
              key={variable.key} 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Label htmlFor={variable.key} className="flex items-center gap-2">
                {variable.label}
                {variable.required && <span className="text-destructive">*</span>}
                {isFilled && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-chart-1"
                  >
                    <Check className="h-4 w-4" />
                  </motion.span>
                )}
              </Label>
              
              {variable.type === 'textarea' ? (
                <Textarea
                  id={variable.key}
                  placeholder={variable.placeholder}
                  value={values[variable.key] || ''}
                  onChange={e => handleChange(variable.key, e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                  className={`transition-all ${
                    errors[variable.key] 
                      ? 'border-destructive' 
                      : isFilled 
                        ? 'border-chart-1/50 bg-chart-1/5' 
                        : 'focus:border-primary/50'
                  }`}
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
                  className={`transition-all ${
                    errors[variable.key] 
                      ? 'border-destructive' 
                      : isFilled 
                        ? 'border-chart-1/50 bg-chart-1/5' 
                        : 'focus:border-primary/50'
                  }`}
                />
              )}
              
              {errors[variable.key] && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive"
                >
                  {errors[variable.key]}
                </motion.p>
              )}

              {variable.helpText && (
                <p className="text-xs text-muted-foreground">{variable.helpText}</p>
              )}

              {/* Quality indicator */}
              {isFilled && quality > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1"
                >
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-xs ${i < quality ? 'text-chart-1' : 'text-muted'}`}
                    >
                      ⭐
                    </span>
                  ))}
                  {quality >= 4 && (
                    <span className="text-xs text-chart-1 ml-2">Отлично!</span>
                  )}
                </motion.div>
              )}

              {/* Suggestion chips */}
              {suggestions.length > 0 && !isFilled && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">💡 Подсказки:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((chip, chipIdx) => (
                      <motion.button
                        key={chipIdx}
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * chipIdx }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChipClick(variable.key, chip.value)}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all disabled:opacity-50"
                      >
                        {chip.icon && <span className="mr-1">{chip.icon}</span>}
                        {chip.value}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
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
