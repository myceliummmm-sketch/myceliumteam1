import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Prompt } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

export function usePromptLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrompts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('prompt_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPrompts(data as any[]);
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast({
        title: 'Error loading prompts',
        description: 'Failed to load your prompt library',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, [user]);

  const createPrompt = async (promptData: Partial<Prompt>) => {
    if (!user) return null;

    try {
      const { data, error } = await (supabase as any)
        .from('prompt_library')
        .insert({
          player_id: user.id,
          ...promptData,
        })
        .select()
        .single();

      if (error) throw error;

      await loadPrompts();
      toast({
        title: '✅ Prompt saved!',
        description: `"${promptData.title}" added to your library`,
      });

      return data as any;
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast({
        title: 'Error saving prompt',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updatePrompt = async (promptId: string, updates: Partial<Prompt>) => {
    try {
      const { error } = await (supabase as any)
        .from('prompt_library')
        .update(updates)
        .eq('id', promptId);

      if (error) throw error;

      await loadPrompts();
      toast({
        title: '✅ Prompt updated',
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast({
        title: 'Error updating prompt',
        variant: 'destructive',
      });
    }
  };

  const deletePrompt = async (promptId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('prompt_library')
        .delete()
        .eq('id', promptId);

      if (error) throw error;

      await loadPrompts();
      toast({
        title: 'Prompt deleted',
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        title: 'Error deleting prompt',
        variant: 'destructive',
      });
    }
  };

  const forkPrompt = async (originalPrompt: Prompt) => {
    if (!user) return null;

    const { id, player_id, version, parent_prompt_id, created_at, updated_at, ...promptData } = originalPrompt;

    return createPrompt({
      ...promptData,
      title: `${originalPrompt.title} (Copy)`,
      version: 1,
      parent_prompt_id: undefined,
    });
  };

  const createNewVersion = async (originalPrompt: Prompt, newText: string) => {
    if (!user) return null;

    return createPrompt({
      title: originalPrompt.title,
      description: originalPrompt.description,
      category: originalPrompt.category,
      phase: originalPrompt.phase,
      version: originalPrompt.version + 1,
      parent_prompt_id: originalPrompt.id,
      prompt_text: newText,
      prompt_variables: originalPrompt.prompt_variables,
      created_by_character: originalPrompt.created_by_character,
      contributing_characters: originalPrompt.contributing_characters,
      is_template: false,
    });
  };

  const toggleFavorite = async (promptId: string, currentState: boolean) => {
    await updatePrompt(promptId, { is_favorite: !currentState });
  };

  const ratePrompt = async (promptId: string, rating: number) => {
    await updatePrompt(promptId, { effectiveness_rating: rating });
  };

  const trackUsage = async (promptId: string, context?: string) => {
    if (!user) return;

    try {
      await (supabase as any).from('prompt_usage_history').insert({
        prompt_id: promptId,
        player_id: user.id,
        context,
      });

      await (supabase as any)
        .from('prompt_library')
        .update({
          times_used: prompts.find(p => p.id === promptId)!.times_used + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('id', promptId);

      await loadPrompts();
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  return {
    prompts,
    loading,
    createPrompt,
    updatePrompt,
    deletePrompt,
    forkPrompt,
    createNewVersion,
    toggleFavorite,
    ratePrompt,
    trackUsage,
    reload: loadPrompts,
  };
}
