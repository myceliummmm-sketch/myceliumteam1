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
    const value = values[key]?.trim() || '';
    if (!value || value.length === 0) return 0;
    if (value.length < 15) return 1;
    if (value.length < 40) return 2;
    if (value.length < 70) return 3;
    if (value.length < 120) return 4;
    return 5;
  };

  const filledCount = template.variables.filter(v => values[v.key]?.trim()).length;
  const totalCount = template.variables.length;
  const allFieldsFilled = template.variables.every(v => !v.required || values[v.key]?.trim().length > 0);

  return (
    <Card className="p-6 space-y-6 bg-background/50 backdrop-blur-sm border-2 border-primary/20">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <div className="text-sm font-medium text-muted-foreground">
          Заполнено {filledCount}/{totalCount}
        </div>
      </div>

      <div className="space-y-6">
        {template.variables.map((variable, idx) => {
          const suggestions = getSuggestionsForField(variable.key);
          const quality = getFieldQuality(variable.key);
          const isFilled = !!values[variable.key]?.trim();
          const charCount = values[variable.key]?.length || 0;

          return (
            <motion.div
              key={variable.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-xl border-2 bg-background/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <Label 
                  htmlFor={variable.key}
                  className="text-base font-semibold flex items-center gap-2"
                >
                  {variable.label}
                  {variable.required && <span className="text-destructive">*</span>}
                </Label>
                {isFilled && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="h-5 w-5 text-green-500" />
                  </motion.div>
                )}
              </div>

              {variable.type === 'textarea' ? (
                <div className="relative">
                  <Textarea
                    id={variable.key}
                    placeholder={variable.placeholder}
                    value={values[variable.key] || ''}
                    onChange={e => handleChange(variable.key, e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                    className={`w-full bg-background border-2 resize-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      errors[variable.key] ? 'border-destructive' : ''
                    }`}
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                    {charCount}
                  </span>
                </div>
              ) : (
                <Input
                  id={variable.key}
                  type={variable.type}
                  placeholder={variable.placeholder}
                  value={values[variable.key] || ''}
                  onChange={e => handleChange(variable.key, e.target.value)}
                  maxLength={variable.maxLength}
                  disabled={isSubmitting}
                  className={`w-full bg-background border-2 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors[variable.key] ? 'border-destructive' : ''
                  }`}
                />
              )}

              {errors[variable.key] && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive mt-2"
                >
                  {errors[variable.key]}
                </motion.p>
              )}

              {/* Quality Stars - Only show when typing */}
              {isFilled && quality > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-3"
                >
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-sm ${i < quality ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Suggestion Chips - Show below stars */}
              {suggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted-foreground">💡 Подсказки:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 4).map((chip, chipIdx) => (
                      <motion.button
                        key={chipIdx}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChipClick(variable.key, chip.value)}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all disabled:opacity-50 flex items-center gap-1"
                      >
                        {chip.icon && <span>{chip.icon}</span>}
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
        disabled={isSubmitting || !allFieldsFilled}
        className="w-full py-6 text-lg font-semibold"
        size="lg"
      >
        {isSubmitting ? (
          <>Генерируем карточку...</>
        ) : !allFieldsFilled ? (
          <>Заполните все поля ({filledCount}/{totalCount})</>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Создать карточку
          </>
        )}
      </Button>
    </Card>
  );
}
