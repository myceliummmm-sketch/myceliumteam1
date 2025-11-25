import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SemanticSearchBarProps {
  onSearch: (query: string) => void;
  onSemanticSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SemanticSearchBar({ onSearch, onSemanticSearch, isLoading }: SemanticSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSemanticMode, setIsSemanticMode] = useState(true);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    if (isSemanticMode) {
      onSemanticSearch(query);
    } else {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isSemanticMode 
            ? "Ask: 'cards about authentication security'"
            : "Search cards by keyword..."}
          className="pl-9 font-mono text-sm"
          disabled={isLoading}
        />
      </div>
      <Button
        variant={isSemanticMode ? 'default' : 'outline'}
        onClick={() => setIsSemanticMode(!isSemanticMode)}
        disabled={isLoading}
        size="sm"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isSemanticMode ? 'AI Search' : 'Keyword'}
      </Button>
      <Button
        onClick={handleSearch}
        disabled={isLoading || !query.trim()}
        size="sm"
      >
        Search
      </Button>
    </div>
  );
}
