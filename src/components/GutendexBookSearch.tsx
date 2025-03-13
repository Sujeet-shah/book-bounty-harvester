
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Book, Author } from '@/lib/data';
import { searchBooks, GutendexBook, getCoverImageUrl, extractGenres } from '@/lib/gutendexApi';
import { BookOpen, Search, Plus, ArrowLeft, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GutendexBookSearchProps {
  onAddBook: (book: Book) => void;
  onCancel: () => void;
}

const GutendexBookSearch = ({ onAddBook, onCancel }: GutendexBookSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<GutendexBook | null>(null);
  const [customSummary, setCustomSummary] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['gutendexSearch', searchTerm, page],
    queryFn: () => searchBooks(searchTerm, page),
    enabled: false,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setPage(1); // Reset to page 1 when doing a new search
      refetch();
    }
  };
  
  const handleAddBook = () => {
    if (!selectedBook) return;
    
    const authorName = selectedBook.authors[0]?.name || 'Unknown Author';
    const author: Author = {
      id: `gutenberg-author-${selectedBook.id}`,
      name: authorName,
      bio: `${authorName} is the author of this book from Project Gutenberg.`
    };
    
    const newBook: Book = {
      id: `gutenberg-${selectedBook.id}`,
      title: selectedBook.title,
      author: author,
      coverUrl: getCoverImageUrl(selectedBook),
      summary: customSummary || `This is a book titled "${selectedBook.title}" by ${authorName} from Project Gutenberg.`,
      shortSummary: shortSummary || `A classic work by ${authorName}.`,
      genre: extractGenres(selectedBook),
      dateAdded: new Date().toISOString(),
      rating: 4.0,
      yearPublished: selectedBook.authors[0]?.birth_year ? selectedBook.authors[0].birth_year + 30 : null,
      likes: 0,
      isFeatured: false,
      isTrending: false,
      gutenbergId: selectedBook.id
    };
    
    onAddBook(newBook);
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Search Project Gutenberg Books</h2>
      
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Project Gutenberg contains books in the public domain (mostly published before 1927). Modern books like "The $100 Startup" won't be available.
        </AlertDescription>
      </Alert>
      
      {selectedBook ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setSelectedBook(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1 inline" /> Back to search
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <img 
                src={getCoverImageUrl(selectedBook)} 
                alt={selectedBook.title}
                className="w-full h-auto rounded-lg shadow-md object-cover aspect-[3/4]"
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-medium">{selectedBook.title}</h3>
              <p className="text-muted-foreground">
                By {selectedBook.authors.map(a => a.name).join(', ')}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {extractGenres(selectedBook).map((genre, i) => (
                  <span key={i} className="chip text-xs px-2 py-0.5">{genre}</span>
                ))}
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Custom Short Summary (optional)
                  </label>
                  <input
                    type="text"
                    value={shortSummary}
                    onChange={(e) => setShortSummary(e.target.value)}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Brief description (1-2 sentences)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Custom Full Summary (optional)
                  </label>
                  <textarea
                    value={customSummary}
                    onChange={(e) => setCustomSummary(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Enter a detailed description"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBook}
                    className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add to Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Search classic books by title or author..."
                />
              </div>
              <button 
                type="submit"
                className="px-4 py-2 bg-primary text-white font-medium rounded-r-lg hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">Searching Project Gutenberg...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 text-destructive">
              <p>Error: {(error as Error).message}</p>
              <button 
                onClick={() => refetch()}
                className="mt-2 underline hover:text-destructive/90"
              >
                Try again
              </button>
            </div>
          )}
          
          {data && data.results.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No books found</h3>
              <p className="text-muted-foreground mb-4">Try searching for classic literature titles or authors like:</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mb-4">
                {["Pride and Prejudice", "Mark Twain", "Sherlock Holmes", "Frankenstein", "The Great Gatsby", 
                  "Jane Austen", "Charles Dickens", "War and Peace"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setTimeout(() => refetch(), 0);
                    }}
                    className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Remember that Project Gutenberg only includes public domain books, mostly published before 1927.
              </p>
            </div>
          )}
          
          {data && data.results.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.results.map((book) => (
                  <div 
                    key={book.id}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="flex mb-4">
                      <img 
                        src={getCoverImageUrl(book)} 
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-md shadow-sm"
                      />
                      <div className="ml-4 overflow-hidden">
                        <h3 className="font-medium text-sm truncate">{book.title}</h3>
                        <p className="text-muted-foreground text-xs">
                          {book.authors[0]?.name || 'Unknown Author'}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {extractGenres(book).slice(0, 2).map((genre, i) => (
                            <span key={i} className="chip text-xs px-1.5 py-0.5 text-[10px]">{genre}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button 
                      className="text-xs w-full flex items-center justify-center py-1.5 border border-dashed rounded hover:bg-primary/10 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Select
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={!data.previous}
                  className="flex items-center px-3 py-1.5 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </button>
                
                <span className="text-sm text-muted-foreground">
                  Page {page}
                </span>
                
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={!data.next}
                  className="flex items-center px-3 py-1.5 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </>
          )}
          
          <div className="flex items-center justify-end mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GutendexBookSearch;
