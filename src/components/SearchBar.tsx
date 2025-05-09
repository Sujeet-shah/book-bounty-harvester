
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const SearchBar = ({ 
  onSearch = () => {}, 
  placeholder = "Search for books, authors, or topics...",
  className,
  initialValue = '', 
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If search term is cleared, also trigger the onSearch with empty string
    if (newValue === '') {
      onSearch('');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        "relative flex items-center w-full transition-all duration-300",
        isFocused ? "scale-[1.02]" : "scale-100",
        className
      )}
      role="search"
      aria-label="Search for books"
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full py-2 pl-10 pr-12 rounded-full border bg-white/80 backdrop-blur focus:bg-white",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
            "placeholder:text-muted-foreground/70 text-foreground"
          )}
          placeholder={placeholder}
          aria-label="Search query"
          autoComplete="off"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-12 flex items-center text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        className="absolute right-2 rounded-full bg-primary text-primary-foreground p-1.5 hover:bg-primary/90 transition-colors"
        disabled={!searchTerm}
        aria-label="Submit search"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
};

export default SearchBar;
