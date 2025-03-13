
import { useState, useEffect } from 'react';
import { Book, books as allBooks, authors as allAuthors } from '@/lib/data';
import { Search, Edit, Trash2, Plus, Book as BookIcon, Users, BarChart3, Download, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminPanel = () => {
  const [books, setBooks] = useState<Book[]>(allBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'users' | 'analytics'>('books');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    setBooks(books.filter(book => book.id !== id));
  };

  const handleAddNew = () => {
    setCurrentBook(null);
    setIsAdding(true);
    setIsEditing(false);
  };

  return (
    <div className="glass-panel p-6 w-full max-w-7xl mx-auto shadow-elegant animate-fade-in">
      {/* Admin Header */}
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
          
          <button 
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </button>
        </div>
      </div>
      
      {/* Admin Tabs */}
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
      
      {/* Books Tab Content */}
      {activeTab === 'books' && (
        <>
          {isAdding || isEditing ? (
            <BookForm 
              book={currentBook} 
              onCancel={() => {
                setIsAdding(false);
                setIsEditing(false);
              }}
              onSave={(book) => {
                if (isAdding) {
                  // In a real app, this would be an API call to create
                  const newBook: Book = {
                    ...book,
                    id: `book-${Date.now()}`,
                    dateAdded: new Date().toISOString(),
                    likes: 0,
                    isFeatured: false,
                    isTrending: false
                  };
                  setBooks([newBook, ...books]);
                } else {
                  // In a real app, this would be an API call to update
                  setBooks(books.map(b => b.id === book.id ? book : b));
                }
                setIsAdding(false);
                setIsEditing(false);
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cover</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Author</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rating</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Genre</th>
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
          )}
        </>
      )}
      
      {/* Users Tab Content */}
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
      
      {/* Analytics Tab Content */}
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

// Admin Tab Component
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

// Book Form Component for Adding/Editing Books
const BookForm = ({ 
  book, 
  onCancel, 
  onSave 
}: { 
  book: Book | null;
  onCancel: () => void;
  onSave: (book: Book) => void;
}) => {
  const [title, setTitle] = useState(book?.title || '');
  const [authorId, setAuthorId] = useState(book?.author.id || allAuthors[0].id);
  const [coverUrl, setCoverUrl] = useState(book?.coverUrl || '');
  const [summary, setSummary] = useState(book?.summary || '');
  const [shortSummary, setShortSummary] = useState(book?.shortSummary || '');
  const [genre, setGenre] = useState<string[]>(book?.genre || []);
  const [rating, setRating] = useState(book?.rating || 4.5);
  const [pageCount, setPageCount] = useState(book?.pageCount || 0);
  const [yearPublished, setYearPublished] = useState(book?.yearPublished || new Date().getFullYear());
  
  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setGenre([...genre, value]);
    } else {
      setGenre(genre.filter(g => g !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const author = allAuthors.find(a => a.id === authorId) || allAuthors[0];
    
    const updatedBook: Book = {
      id: book?.id || '',
      title,
      author,
      coverUrl,
      summary,
      shortSummary,
      genre,
      dateAdded: book?.dateAdded || new Date().toISOString(),
      rating,
      pageCount,
      yearPublished,
      likes: book?.likes || 0,
      isFeatured: book?.isFeatured || false,
      isTrending: book?.isTrending || false
    };
    
    onSave(updatedBook);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">{book ? 'Edit Book' : 'Add New Book'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Book Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Enter book title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Author
          </label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {allAuthors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Enter image URL"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Page Count
            </label>
            <input
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              min="0"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Year Published
            </label>
            <input
              type="number"
              value={yearPublished}
              onChange={(e) => setYearPublished(Number(e.target.value))}
              min="1000"
              max={new Date().getFullYear()}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Rating (0-5)
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            step="0.1"
            min="0"
            max="5"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Genres
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Self-Help', 'Business', 'Psychology', 'Philosophy', 'History', 'Science', 'Fiction'].map((g) => (
              <label key={g} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={g}
                  checked={genre.includes(g)}
                  onChange={handleGenreChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{g}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Short Summary
        </label>
        <input
          type="text"
          value={shortSummary}
          onChange={(e) => setShortSummary(e.target.value)}
          required
          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Brief description (1-2 sentences)"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Full Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={6}
          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Enter detailed book summary"
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
          type="submit"
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          {book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default AdminPanel;
