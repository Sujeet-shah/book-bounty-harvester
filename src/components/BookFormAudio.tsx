
import { useState } from 'react';
import { Book, authors as allAuthors } from '@/lib/data';

// Book Form Component for Adding/Editing Books with Audio Summary support
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
  const [audioSummaryUrl, setAudioSummaryUrl] = useState(book?.audioSummaryUrl || '');
  
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
      isTrending: book?.isTrending || false,
      audioSummaryUrl: audioSummaryUrl || undefined
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
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Audio Summary URL
          </label>
          <input
            type="url"
            value={audioSummaryUrl}
            onChange={(e) => setAudioSummaryUrl(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Enter audio file URL (optional)"
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

export default BookForm;
