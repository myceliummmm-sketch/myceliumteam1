import { useState, useMemo } from 'react';
import { Prompt, PromptCategory } from '@/types/game';
import { usePromptLibrary } from '@/hooks/usePromptLibrary';
import { useGameStore } from '@/stores/gameStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Star, User, BookTemplate, Search } from 'lucide-react';
import { PromptCard } from './PromptCard';
import { PromptDetailModal } from './PromptDetailModal';
import { PromptVariableForm } from './PromptVariableForm';
import { useToast } from '@/hooks/use-toast';

export function PromptLibrary() {
  const showPromptLibrary = useGameStore((state) => state.showPromptLibrary);
  const setShowPromptLibrary = useGameStore((state) => state.setShowPromptLibrary);
  const setConversationMode = useGameStore((state) => state.setConversationMode);
  
  const { prompts, loading, toggleFavorite, ratePrompt, forkPrompt, createNewVersion, deletePrompt, trackUsage } = usePromptLibrary();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'mine' | 'templates'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | PromptCategory>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'used' | 'rated'>('recent');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [variableAction, setVariableAction] = useState<'copy' | 'insert'>('copy');

  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    // Filter by type
    if (filterType === 'favorites') {
      filtered = filtered.filter((p) => p.is_favorite);
    } else if (filterType === 'mine') {
      filtered = filtered.filter((p) => !p.is_template);
    } else if (filterType === 'templates') {
      filtered = filtered.filter((p) => p.is_template);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.prompt_text.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'used') {
      filtered.sort((a, b) => b.times_used - a.times_used);
    } else if (sortBy === 'rated') {
      filtered.sort((a, b) => (b.effectiveness_rating || 0) - (a.effectiveness_rating || 0));
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [prompts, filterType, categoryFilter, searchQuery, sortBy]);

  const handleCopy = (prompt: Prompt) => {
    if (prompt.prompt_variables && prompt.prompt_variables.length > 0) {
      setSelectedPrompt(prompt);
      setVariableAction('copy');
      setShowVariableForm(true);
    } else {
      navigator.clipboard.writeText(prompt.prompt_text);
      trackUsage(prompt.id, 'copied');
      toast({
        title: '📋 Copied to clipboard!',
        description: `"${prompt.title}" is ready to use`,
      });
    }
  };

  const handleInsertToChat = (prompt: Prompt) => {
    if (prompt.prompt_variables && prompt.prompt_variables.length > 0) {
      setSelectedPrompt(prompt);
      setVariableAction('insert');
      setShowVariableForm(true);
    } else {
      insertTextToChat(prompt.prompt_text);
      trackUsage(prompt.id, 'inserted to chat');
      toast({
        title: '💬 Inserted to chat!',
        description: `"${prompt.title}" added to your message`,
      });
    }
  };

  const insertTextToChat = (text: string) => {
    // This will be handled by the InputBar component
    const event = new CustomEvent('insertPromptToChat', { detail: { text } });
    window.dispatchEvent(event);
    setShowPromptLibrary(false);
  };

  const handleVariableSubmit = (filledPrompt: string) => {
    if (variableAction === 'copy') {
      navigator.clipboard.writeText(filledPrompt);
      toast({
        title: '📋 Copied to clipboard!',
        description: `"${selectedPrompt?.title}" is ready to use`,
      });
    } else {
      insertTextToChat(filledPrompt);
      toast({
        title: '💬 Inserted to chat!',
        description: `"${selectedPrompt?.title}" added to your message`,
      });
    }
    if (selectedPrompt) {
      trackUsage(selectedPrompt.id, variableAction === 'copy' ? 'copied' : 'inserted to chat');
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setConversationMode('prompt-prep');
    insertTextToChat(prompt.prompt_text);
    toast({
      title: '✍️ Edit mode activated',
      description: 'Switched to Prompt Prep mode. Make your changes and save as a new version.',
    });
  };

  const handleFork = async (prompt: Prompt) => {
    await forkPrompt(prompt);
  };

  const handleDelete = async (prompt: Prompt) => {
    if (confirm(`Delete "${prompt.title}"? This cannot be undone.`)) {
      await deletePrompt(prompt.id);
    }
  };

  const handleToggleFavorite = async (prompt: Prompt) => {
    await toggleFavorite(prompt.id, prompt.is_favorite);
  };

  const handleRate = async (prompt: Prompt, rating: number) => {
    await ratePrompt(prompt.id, rating);
  };

  return (
    <>
      <Dialog open={showPromptLibrary} onOpenChange={setShowPromptLibrary}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl">📚 Prompt Library</DialogTitle>
          </DialogHeader>

          <div className="px-6 space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="used">Most Used</SelectItem>
                  <SelectItem value="rated">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'favorites' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('favorites')}
              >
                <Star className="h-3 w-3 mr-1" />
                Favorites
              </Button>
              <Button
                variant={filterType === 'mine' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('mine')}
              >
                <User className="h-3 w-3 mr-1" />
                My Prompts
              </Button>
              <Button
                variant={filterType === 'templates' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('templates')}
              >
                <BookTemplate className="h-3 w-3 mr-1" />
                Templates
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={categoryFilter} onValueChange={(v: any) => setCategoryFilter(v)} className="px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Prompts Grid */}
          <ScrollArea className="h-[50vh] px-6 pb-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'No prompts found matching your search'
                    : filterType === 'favorites'
                    ? 'No favorite prompts yet'
                    : filterType === 'mine'
                    ? 'No custom prompts yet'
                    : 'No prompts available'}
                </p>
                {!searchQuery && filterType === 'mine' && (
                  <Button onClick={() => {
                    setShowPromptLibrary(false);
                    setConversationMode('prompt-prep');
                  }}>
                    Create Your First Prompt
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCopy={handleCopy}
                    onInsertToChat={handleInsertToChat}
                    onEdit={handleEdit}
                    onFork={handleFork}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={(p) => {
                      setSelectedPrompt(p);
                      setShowDetailModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <PromptDetailModal
        prompt={selectedPrompt}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onCopy={handleCopy}
        onInsertToChat={handleInsertToChat}
        onEdit={handleEdit}
        onFork={handleFork}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onRate={handleRate}
      />

      <PromptVariableForm
        open={showVariableForm}
        onClose={() => setShowVariableForm(false)}
        variables={selectedPrompt?.prompt_variables || []}
        promptText={selectedPrompt?.prompt_text || ''}
        onSubmit={handleVariableSubmit}
      />
    </>
  );
}
