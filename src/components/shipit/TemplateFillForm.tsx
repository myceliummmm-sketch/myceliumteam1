import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VisionTemplate } from '@/lib/visionTemplates';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import { getSuggestionsForField } from '@/lib/suggestionLibrary';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TemplateFillFormProps {
  template: VisionTemplate;
  availableTemplates: VisionTemplate[];
  onTemplateChange: (template: VisionTemplate) => void;
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  isSubmitting: boolean;
}

export function TemplateFillForm({ 
  template, 
  availableTemplates,
  onTemplateChange,
  initialValues = {}, 
  onSubmit, 
  isSubmitting 
}: TemplateFillFormProps) {
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

  const isFieldComplete = (key: string): boolean => {
    const value = values[key]?.trim() || '';
    return value.length >= 10;
  };

  const filledCount = template.variables.filter(v => values[v.key]?.trim()).length;
  const totalCount = template.variables.length;
  const allFieldsFilled = template.variables.every(v => !v.required || values[v.key]?.trim().length > 0);

  return (
    <Card className="p-8 bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
      <div className="space-y-8">
        {/* Header with Template Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{template.label}</h2>
            <div className="text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary">
              {filledCount}/{totalCount} заполнено
            </div>
          </div>

          {/* Horizontal Template Switcher */}
          <div className="flex flex-wrap gap-2">
            {availableTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => onTemplateChange(t)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  template.id === t.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:scale-102"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Заполните все поля — они станут вашей карточкой ✨
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {template.variables.map((variable, index) => {
            const isFilled = isFieldComplete(variable.key);
            const charCount = values[variable.key]?.length || 0;
            const suggestions = getSuggestionsForField(variable.key);
            
            return (
              <motion.div
                key={variable.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor={variable.key} className="text-base font-semibold flex items-center gap-2">
                    {variable.label}
                    {variable.required && <span className="text-destructive">*</span>}
                  </Label>
                  {isFilled && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-chart-1"
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>

                <div className="relative">
                  {variable.type === 'textarea' ? (
                    <Textarea
                      id={variable.key}
                      value={values[variable.key] || ''}
                      onChange={(e) => handleChange(variable.key, e.target.value)}
                      placeholder={variable.placeholder}
                      className={cn(
                        "min-h-[120px] text-base resize-none",
                        "bg-white/10 backdrop-blur-sm border-2 border-primary/20 rounded-xl",
                        "transition-all duration-200",
                        "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                        "focus:shadow-lg focus:shadow-primary/10",
                        errors[variable.key] && "border-destructive",
                        isFilled && "border-chart-1/50"
                      )}
                      maxLength={variable.maxLength}
                    />
                  ) : (
                    <Input
                      id={variable.key}
                      type={variable.type}
                      value={values[variable.key] || ''}
                      onChange={(e) => handleChange(variable.key, e.target.value)}
                      placeholder={variable.placeholder}
                      className={cn(
                        "text-base h-12",
                        "bg-white/10 backdrop-blur-sm border-2 border-primary/20 rounded-xl",
                        "transition-all duration-200",
                        "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                        "focus:shadow-lg focus:shadow-primary/10",
                        errors[variable.key] && "border-destructive",
                        isFilled && "border-chart-1/50"
                      )}
                      maxLength={variable.maxLength}
                    />
                  )}
                  
                  {/* Character Counter */}
                  {variable.maxLength && (
                    <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                      {charCount}/{variable.maxLength}
                    </div>
                  )}
                </div>

                {errors[variable.key] && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors[variable.key]}
                  </p>
                )}

                {/* Suggestion Chips - Below field */}
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      💡 Подсказки:
                    </span>
                    {suggestions.slice(0, 4).map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChipClick(variable.key, suggestion.value)}
                        className="px-3 py-1.5 text-xs rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground border border-border transition-all hover:scale-105 flex items-center gap-1.5"
                      >
                        {suggestion.icon && <span>{suggestion.icon}</span>}
                        <span className="max-w-[200px] truncate">{suggestion.value}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !allFieldsFilled}
          className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
              Генерируем карточку...
            </>
          ) : !allFieldsFilled ? (
            <>
              Заполните все поля ({filledCount}/{totalCount})
            </>
          ) : (
            <>
              Создать карточку
              <Sparkles className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}