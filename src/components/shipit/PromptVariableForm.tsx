import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PromptVariableFormProps {
  open: boolean;
  onClose: () => void;
  variables: string[];
  promptText: string;
  onSubmit: (filledPrompt: string, values: Record<string, string>) => void;
}

export function PromptVariableForm({ open, onClose, variables, promptText, onSubmit }: PromptVariableFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let filledPrompt = promptText;
    for (const variable of variables) {
      const value = values[variable] || '';
      filledPrompt = filledPrompt.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    }
    
    onSubmit(filledPrompt, values);
    setValues({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fill in Variables</DialogTitle>
          <DialogDescription>
            This prompt has {variables.length} variable{variables.length !== 1 ? 's' : ''} to fill in
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {variables.map((variable) => (
                <div key={variable} className="space-y-2">
                  <Label htmlFor={variable} className="text-sm font-medium">
                    {variable.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={variable}
                    value={values[variable] || ''}
                    onChange={(e) => setValues({ ...values, [variable]: e.target.value })}
                    placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
