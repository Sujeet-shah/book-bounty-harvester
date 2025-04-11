import { useState, useEffect } from 'react';
import { Book, authors as allAuthors } from '@/lib/data';
import { SummaryGeneratorService } from '@/services/summary-generator.service';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();
  
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

  const handleGenerateSummary = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a book title to generate a summary",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingSummary(true);
      
      // Get the author's name from the selected author ID
      const author = allAuthors.find(a => a.id === authorId);
      
      const data = {
        title: title,
        author: author?.name,
        genres: genre.length > 0 ? genre : undefined,
      };
      
      // Check if API key is available
      if (!SummaryGeneratorService.getApiKey()) {
        toast({
          title: "API Key Required",
          description: "Please set your API key in the Summaries tab of the Admin Panel first.",
          variant: "destructive",
        });
        setIsGeneratingSummary(false);
        return;
      }
      
      const result = await SummaryGeneratorService.generateSummary(data);
      setSummary(result);
      
      // Set a shortened version for the short summary if it's empty
      if (!shortSummary.trim()) {
        setShortSummary(result.substring(0, 150) + '...');
      }
      
      toast({
        title: "Summary generated",
        description: "Book summary has been generated successfully",
      });
    } catch (error) {
      console.error('Summary generation failed:', error);
      toast({
        title: "Summary generation failed",
        description: error instanceof Error ? error.message : "There was an error generating the summary.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">{book ? 'Edit Book' : 'Add New Book'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Book Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter book title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Author
          </label>
          <Select value={authorId} onValueChange={(value) => setAuthorId(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent>
              {allAuthors.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Cover Image URL
          </label>
          <Input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            required
            placeholder="Enter image URL"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Audio Summary URL
          </label>
          <Input
            type="url"
            value={audioSummaryUrl}
            onChange={(e) => setAudioSummaryUrl(e.target.value)}
            placeholder="Enter audio file URL (optional)"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Page Count
            </label>
            <Input
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Year Published
            </label>
            <Input
              type="number"
              value={yearPublished}
              onChange={(e) => setYearPublished(Number(e.target.value))}
              min="1000"
              max={new Date().getFullYear()}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Rating (0-5)
          </label>
          <Input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            step="0.1"
            min="0"
            max="5"
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
        <Input
          type="text"
          value={shortSummary}
          onChange={(e) => setShortSummary(e.target.value)}
          required
          placeholder="Brief description (1-2 sentences)"
        />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Full Summary
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="text-xs"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-3 w-3" />
                Auto Generate
              </>
            )}
          </Button>
        </div>
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
