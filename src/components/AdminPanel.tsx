
import { useState, useEffect } from 'react';
import { Book, books as defaultBooks } from '@/lib/data';
import { Search, Edit, Trash2, Plus, Book as BookIcon, Users, BarChart3, Download, ChevronDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import BookForm from './BookFormAudio';
import GutendexBookSearch from './GutendexBookSearch';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchModernBooks, convertToAppBook } from '@/lib/modernBooksApi';

const AdminPanel = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'users' | 'analytics'>('books');
  const [showSource, setShowSource] = useState<'all' | 'local' | 'gutenberg' | 'modern'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const { toast } = useToast();

  // Fetch modern books for admin
  const { data: modernBooksData } = useQuery({
    queryKey: ['adminModernBooks'],
    queryFn: () => fetchModernBooks(1, 50), // Fetch first 50 modern books for admin
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  // Load local books
  useEffect(() => {
    const storedBooks = localStorage.getItem('bookSummaryBooks');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(defaultBooks);
      localStorage.setItem('bookSummaryBooks', JSON.stringify(defaultBooks));
    }
  }, []);

  // Combine all book sources
  useEffect(() => {
    let combined = [...books];
    
    // Add modern books
    if (modernBooksData?.books) {
      const modernBooks = modernBooksData.books.map(book => convertToAppBook(book));
      combined = [...combined, ...modernBooks];
    }
    
    setAllBooks(combined);
  }, [books, modernBooksData]);

  // Save books to localStorage when they change
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem('bookSummaryBooks', JSON.stringify(books));
    }
  }, [books]);

  const filteredBooks = allBooks.filter(book => {
    // Filter by search term
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by source
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
    // Only delete books from local storage
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
                  // Handle editing of different book types
                  if (book.id.startsWith('modern-') || book.id.startsWith('gutenberg-')) {
                    // For external books, just show a message
                    toast({
                      title: "Book updated",
                      description: "External book details have been temporarily updated.",
                    });
                  } else {
                    // For local books, update in storage
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
