import { useState, useEffect } from 'react';
import { Book, books as defaultBooks } from '@/lib/data';
import { Search, Edit, Trash2, Plus, Book as BookIcon, Users, BarChart3, Download, ChevronDown, Star, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import BookForm from './BookFormAudio';
import GutendexBookSearch from './GutendexBookSearch';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchModernBooks, convertToAppBook } from '@/lib/modernBooksApi';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { SummaryGeneratorService } from '@/services/summary-generator.service';

const AdminPanel = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'users' | 'analytics' | 'summaries'>('books');
  const [showSource, setShowSource] = useState<'all' | 'local' | 'gutenberg' | 'modern'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [summaryApiKey, setSummaryApiKey] = useState('');
  const [summaryBookTitle, setSummaryBookTitle] = useState('');
  const [summaryAuthorName, setSummaryAuthorName] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const { toast } = useToast();

  const { data: modernBooksData } = useQuery({
    queryKey: ['adminModernBooks'],
    queryFn: () => fetchModernBooks(1, 50),
    staleTime: 10 * 60 * 1000
  });

  useEffect(() => {
    const storedBooks = localStorage.getItem('bookSummaryBooks');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(defaultBooks);
      localStorage.setItem('bookSummaryBooks', JSON.stringify(defaultBooks));
    }
  }, []);

  useEffect(() => {
    let combined = [...books];
    
    if (modernBooksData?.books) {
      const modernBooks = modernBooksData.books.map(book => convertToAppBook(book));
      combined = [...combined, ...modernBooks];
    }
    
    setAllBooks(combined);
  }, [books, modernBooksData]);

  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem('bookSummaryBooks', JSON.stringify(books));
    }
  }, [books]);

  useEffect(() => {
    const savedApiKey = sessionStorage.getItem('ai_api_key');
    if (savedApiKey) {
      setSummaryApiKey(savedApiKey);
      SummaryGeneratorService.setApiKey(savedApiKey);
      setShowApiKeyInput(false);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (summaryApiKey.trim()) {
      SummaryGeneratorService.setApiKey(summaryApiKey.trim());
      setShowApiKeyInput(false);
      toast({
        title: "API Key saved",
        description: "Your API key has been saved for this session",
      });
    } else {
      toast({
        title: "API Key required",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
    }
  };

  const handleGenerateSummary = async () => {
    if (!summaryBookTitle.trim()) {
      toast({
        title: "Book title required",
        description: "Please enter a book title to generate a summary",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingSummary(true);
      
      const data = {
        title: summaryBookTitle,
        author: summaryAuthorName,
      };
      
      const result = await SummaryGeneratorService.generateSummary(data);
      setGeneratedSummary(result);
      
      toast({
        title: "Summary generated",
        description: "Book summary has been generated successfully",
      });
    } catch (error) {
      console.error('Summary generation failed:', error);
      toast({
        title: "Summary generation failed",
        description: "There was an error generating the summary. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleResetApiKey = () => {
    setSummaryApiKey('');
    sessionStorage.removeItem('ai_api_key');
    setShowApiKeyInput(true);
  };

  const filteredBooks = allBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesSource = true;
    if (showSource === 'local') {
      matchesSource = !book.id.startsWith('gutenberg-') && !book.id.startsWith('modern-');
    } else if (showSource === 'gutenberg') {
      matchesSource = book.id.startsWith('gutenberg-');
    } else if (showSource === 'modern') {
      matchesSource = book.id.startsWith('modern-');
    }
    
    return matchesSearch && matchesSource;
  });

  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setIsEditing(true);
    setIsAdding(false);
    setIsImporting(false);
  };

  const handleDelete = (id: string) => {
    if (!id.startsWith('gutenberg-') && !id.startsWith('modern-')) {
      setBooks(books.filter(book => book.id !== id));
      toast({
        title: "Book deleted",
        description: "The book has been removed from your collection.",
      });
    } else {
      toast({
        title: "Cannot delete external book",
        description: "External books cannot be permanently deleted.",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setCurrentBook(null);
    setIsAdding(true);
    setIsEditing(false);
    setIsImporting(false);
  };
  
  const handleImport = () => {
    setCurrentBook(null);
    setIsImporting(true);
    setIsAdding(false);
    setIsEditing(false);
  };
  
  const handleAddGutendexBook = (book: Book) => {
    setBooks([book, ...books]);
    setIsImporting(false);
    toast({
      title: "Book imported",
      description: "The book has been added to your collection.",
    });
  };

  const handleFilterChange = (source: 'all' | 'local' | 'gutenberg' | 'modern') => {
    setShowSource(source);
  };

  return (
    <div className="glass-panel p-6 w-full max-w-7xl mx-auto shadow-elegant animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 rounded-lg border w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </button>
            
            <button 
              onClick={handleImport}
              className="flex items-center px-4 py-2 rounded-lg border bg-background text-foreground font-medium hover:bg-muted/50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Import
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-border mb-6">
        <AdminTab
          isActive={activeTab === 'books'}
          onClick={() => setActiveTab('books')}
          icon={<BookIcon className="h-4 w-4 mr-2" />}
          label="Books"
        />
        <AdminTab
          isActive={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
          icon={<Users className="h-4 w-4 mr-2" />}
          label="Users"
        />
        <AdminTab
          isActive={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
          icon={<BarChart3 className="h-4 w-4 mr-2" />}
          label="Analytics"
        />
        <AdminTab
          isActive={activeTab === 'summaries'}
          onClick={() => setActiveTab('summaries')}
          icon={<BookOpen className="h-4 w-4 mr-2" />}
          label="Generate Summaries"
        />
      </div>
      
      {activeTab === 'books' && (
        <>
          {isImporting ? (
            <GutendexBookSearch 
              onAddBook={handleAddGutendexBook}
              onCancel={() => setIsImporting(false)}
            />
          ) : isAdding || isEditing ? (
            <BookForm 
              book={currentBook} 
              onCancel={() => {
                setIsAdding(false);
                setIsEditing(false);
              }}
              onSave={(book) => {
                if (isAdding) {
                  const newBook: Book = {
                    ...book,
                    id: `book-${Date.now()}`,
                    dateAdded: new Date().toISOString(),
                    likes: 0,
                    isFeatured: false,
                    isTrending: false
                  };
                  setBooks([newBook, ...books]);
                  toast({
                    title: "Book added",
                    description: "The new book has been added to your collection.",
                  });
                } else {
                  if (book.id.startsWith('modern-') || book.id.startsWith('gutenberg-')) {
                    toast({
                      title: "Book updated",
                      description: "External book details have been temporarily updated.",
                    });
                  } else {
                    setBooks(books.map(b => b.id === book.id ? book : b));
                    toast({
                      title: "Book updated",
                      description: "The book details have been updated.",
                    });
                  }
                }
                setIsAdding(false);
                setIsEditing(false);
              }}
            />
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <SourceFilter 
                  active={showSource === 'all'} 
                  onClick={() => handleFilterChange('all')}
                  label="All Books"
                />
                <SourceFilter 
                  active={showSource === 'local'} 
                  onClick={() => handleFilterChange('local')}
                  label="Local Books"
                />
                <SourceFilter 
                  active={showSource === 'gutenberg'} 
                  onClick={() => handleFilterChange('gutenberg')}
                  label="Gutenberg Books"
                />
                <SourceFilter 
                  active={showSource === 'modern'} 
                  onClick={() => handleFilterChange('modern')}
                  label="Modern Books"
                />
              </div>
            
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cover</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Author</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rating</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Genre</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Audio</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-12 h-16 rounded overflow-hidden">
                            <img 
                              src={book.coverUrl} 
                              alt={book.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{book.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">{book.author.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span>{book.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {book.genre.slice(0, 2).map((g) => (
                              <span key={g} className="chip text-xs px-2 py-0.5">{g}</span>
                            ))}
                            {book.genre.length > 2 && (
                              <span className="chip text-xs px-2 py-0.5">+{book.genre.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {book.audioSummaryUrl ? (
                            <span className="text-green-500 text-xs font-medium">Available</span>
                          ) : (
                            <span className="text-red-500 text-xs font-medium">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {book.id.startsWith('gutenberg-') ? (
                            <span className="text-blue-500 text-xs font-medium">Gutenberg</span>
                          ) : book.id.startsWith('modern-') ? (
                            <span className="text-purple-500 text-xs font-medium">Modern</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Custom</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEdit(book)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(book.id)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              disabled={book.id.startsWith('gutenberg-') || book.id.startsWith('modern-')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredBooks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No books found matching your search.
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
      
      {activeTab === 'users' && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">User Management</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            This feature will be available in the next update. Here you'll be able to manage user accounts, permissions, and interactions.
          </p>
          <button className="btn-secondary">
            Get Notified When Ready
          </button>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Analytics & Insights</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            This feature will be available in the next update. Here you'll be able to view user engagement, popular books, and site statistics.
          </p>
          <button className="btn-secondary">
            Get Notified When Ready
          </button>
        </div>
      )}
      
      {activeTab === 'summaries' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              AI Summary Generator
            </h2>
            
            {showApiKeyInput ? (
              <div className="space-y-4 mb-6">
                <div className="bg-muted/30 p-4 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">API Key Required</p>
                    <p className="text-sm text-muted-foreground">
                      Enter your Gemini API key to use the AI summary generator. 
                      The key will be stored in your browser for this session only.
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="apiKey">Gemini API Key</Label>
                  <div className="flex mt-1">
                    <Input 
                      id="apiKey"
                      type="password"
                      value={summaryApiKey}
                      onChange={(e) => setSummaryApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="flex-1"
                    />
                    <Button 
                      className="ml-2"
                      onClick={handleSaveApiKey}
                    >
                      Save Key
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get an API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center mb-4 bg-muted/30 p-3 rounded-md">
                <p className="text-sm">API Key: ••••••••••••••••</p>
                <Button variant="outline" size="sm" onClick={handleResetApiKey}>
                  Reset Key
                </Button>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="bookTitle">Book Title</Label>
                <Input 
                  id="bookTitle"
                  value={summaryBookTitle}
                  onChange={(e) => setSummaryBookTitle(e.target.value)}
                  placeholder="Enter book title"
                  disabled={showApiKeyInput}
                />
              </div>
              
              <div>
                <Label htmlFor="authorName">Author Name (Optional)</Label>
                <Input 
                  id="authorName"
                  value={summaryAuthorName}
                  onChange={(e) => setSummaryAuthorName(e.target.value)}
                  placeholder="Enter author name"
                  disabled={showApiKeyInput}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerateSummary}
                disabled={showApiKeyInput || isGeneratingSummary}
              >
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {generatedSummary && (
            <div className="glass-panel p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Generated Summary:</h3>
              
              <Textarea
                value={generatedSummary}
                readOnly
                className="min-h-[200px] mb-4"
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigator.clipboard.writeText(generatedSummary)}
                >
                  Copy to Clipboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedSummary('')}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminTab = ({ 
  isActive, 
  onClick, 
  icon, 
  label 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center px-4 py-3 font-medium transition-colors border-b-2 -mb-px",
      isActive 
        ? "border-primary text-primary" 
        : "border-transparent text-muted-foreground hover:text-foreground"
    )}
  >
    {icon}
    {label}
  </button>
);

const SourceFilter = ({
  active,
  onClick,
  label
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 text-sm rounded-md transition-colors",
      active
        ? "bg-primary/10 text-primary font-medium"
        : "bg-transparent text-muted-foreground hover:bg-muted"
    )}
  >
    {label}
  </button>
);

export default AdminPanel;
