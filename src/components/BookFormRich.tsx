
import { useState, useEffect } from 'react';
import { Book, authors as allAuthors, ContentSection } from '@/lib/data';
import { SummaryGeneratorService } from '@/services/summary-generator.service';
import { Wand2, Loader2, Image, Quote, Bold, Italic, Underline } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import RichContentRenderer from './RichContentRenderer';

type SectionType = 'text' | 'image' | 'quote';

interface BookFormProps {
  book: Book | null;
  onCancel: () => void;
  onSave: (book: Book) => void;
}

const BookFormRich = ({ book, onCancel, onSave }: BookFormProps) => {
  const [title, setTitle] = useState(book?.title || '');
  const [authorName, setAuthorName] = useState(book?.author.name || '');
  const [coverUrl, setCoverUrl] = useState(book?.coverUrl || '');
  const [shortSummary, setShortSummary] = useState(book?.shortSummary || '');
  const [genre, setGenre] = useState<string[]>(book?.genre || []);
  const [rating, setRating] = useState(book?.rating || 4.5);
  const [pageCount, setPageCount] = useState(book?.pageCount || 0);
  const [yearPublished, setYearPublished] = useState(book?.yearPublished || new Date().getFullYear());
  const [audioSummaryUrl, setAudioSummaryUrl] = useState(book?.audioSummaryUrl || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [contentSections, setContentSections] = useState<ContentSection[]>(
    book?.contentSections || book?.richContent || [{ type: 'text', content: book?.summary || '' }]
  );
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [tempSectionContent, setTempSectionContent] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempCaption, setTempCaption] = useState('');
  
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
    
    // Extract summary from text sections if needed
    let fullSummary = '';
    const textSections = contentSections.filter(section => section.type === 'text');
    if (textSections.length > 0) {
      fullSummary = textSections.map(section => section.content).join('\n\n');
    }
    
    // Find or create a new author object based on the entered name
    const author = allAuthors.find(a => a.name.toLowerCase() === authorName.toLowerCase()) || {
      id: Date.now().toString(), // Generate a unique ID
      name: authorName
    };
    
    const updatedBook: Book = {
      id: book?.id || '',
      title,
      author,
      coverUrl,
      summary: fullSummary,
      shortSummary,
      genre,
      dateAdded: book?.dateAdded || new Date().toISOString(),
      rating,
      pageCount,
      yearPublished,
      likes: book?.likes || 0,
      isFeatured: book?.isFeatured || false,
      isTrending: book?.isTrending || false,
      audioSummaryUrl: audioSummaryUrl || undefined,
      contentSections: contentSections,
      richContent: contentSections
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
      
      const data = {
        title: title,
        author: authorName,
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
      
      // Create a new text section with the generated summary
      const newSections = [...contentSections];
      
      // If there's already a first text section, update it, otherwise add a new one
      const firstTextSectionIndex = newSections.findIndex(section => section.type === 'text');
      if (firstTextSectionIndex >= 0) {
        newSections[firstTextSectionIndex] = { ...newSections[firstTextSectionIndex], content: result };
      } else {
        newSections.unshift({ type: 'text', content: result });
      }
      
      setContentSections(newSections);
      
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

  const addSection = (type: SectionType) => {
    let newSection: ContentSection;
    
    switch (type) {
      case 'text':
        newSection = { type: 'text', content: '' };
        break;
      case 'image':
        newSection = { type: 'image', content: '', imageUrl: '', caption: '' };
        break;
      case 'quote':
        newSection = { type: 'quote', content: '', caption: '' };
        break;
      default:
        return;
    }
    
    setContentSections([...contentSections, newSection]);
    setActiveSection(contentSections.length);
    setTempSectionContent('');
    setTempImageUrl('');
    setTempCaption('');
  };
  
  const editSection = (index: number) => {
    const section = contentSections[index];
    setActiveSection(index);
    
    if (section.type === 'text' || section.type === 'quote') {
      setTempSectionContent(section.content);
    }
    
    if (section.type === 'image') {
      setTempImageUrl(section.imageUrl || '');
      setTempCaption(section.caption || '');
    } else if (section.type === 'quote') {
      setTempCaption(section.caption || '');
    }
  };
  
  const saveSection = () => {
    if (activeSection === null) return;
    
    const updatedSections = [...contentSections];
    const currentSection = updatedSections[activeSection];
    
    if (currentSection.type === 'text' || currentSection.type === 'quote') {
      updatedSections[activeSection] = {
        ...currentSection,
        content: tempSectionContent
      };
      
      if (currentSection.type === 'quote') {
        updatedSections[activeSection].caption = tempCaption;
      }
    } else if (currentSection.type === 'image') {
      updatedSections[activeSection] = {
        ...currentSection,
        imageUrl: tempImageUrl,
        caption: tempCaption
      };
    }
    
    setContentSections(updatedSections);
    setActiveSection(null);
  };
  
  const deleteSection = (index: number) => {
    const updatedSections = contentSections.filter((_, i) => i !== index);
    setContentSections(updatedSections);
    
    if (activeSection === index) {
      setActiveSection(null);
    } else if (activeSection !== null && activeSection > index) {
      setActiveSection(activeSection - 1);
    }
  };
  
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contentSections.length - 1)
    ) {
      return;
    }
    
    const updatedSections = [...contentSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSections[index], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[index]];
    
    setContentSections(updatedSections);
    
    if (activeSection === index) {
      setActiveSection(newIndex);
    } else if (activeSection === newIndex) {
      setActiveSection(index);
    }
  };
  
  const cancelEditSection = () => {
    setActiveSection(null);
    setTempSectionContent('');
    setTempImageUrl('');
    setTempCaption('');
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-8">
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
          <Input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            placeholder="Enter author name"
          />
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
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            Book Content
          </label>
          <div className="flex space-x-2">
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
        </div>
        
        {/* Content Sections */}
        <div className="space-y-4 mb-4">
          {contentSections.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No content sections yet. Add some using the buttons below.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {contentSections.map((section, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors",
                    activeSection === index && "bg-muted/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm flex items-center">
                      {section.type === 'text' && <Bold className="h-4 w-4 mr-1" />}
                      {section.type === 'image' && <Image className="h-4 w-4 mr-1" />}
                      {section.type === 'quote' && <Quote className="h-4 w-4 mr-1" />}
                      
                      {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="h-7 w-7 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === contentSections.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        ↓
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editSection(index)}
                        className="h-7"
                      >
                        Edit
                      </Button>
                      <Button 
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSection(index)}
                        className="h-7"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview of section */}
                  <div className="pl-2 border-l-2 border-muted py-1">
                    {section.type === 'text' && (
                      <div className="text-sm text-muted-foreground line-clamp-3">
                        {section.content}
                      </div>
                    )}
                    {section.type === 'image' && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="bg-muted p-1 rounded">Image</span>
                        <span className="truncate max-w-[300px]">{section.imageUrl}</span>
                      </div>
                    )}
                    {section.type === 'quote' && (
                      <div className="text-sm text-muted-foreground italic line-clamp-2">
                        "{section.content}"
                      </div>
                    )}
                  </div>
                  
                  {/* Edit Form */}
                  {activeSection === index && (
                    <div className="mt-4 pt-4 border-t">
                      {(section.type === 'text' || section.type === 'quote') && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1">
                            {section.type === 'text' ? 'Text Content' : 'Quote Content'}
                          </label>
                          <textarea
                            value={tempSectionContent}
                            onChange={(e) => setTempSectionContent(e.target.value)}
                            rows={section.type === 'text' ? 5 : 3}
                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder={section.type === 'text' ? "Enter text content..." : "Enter quote..."}
                          />
                        </div>
                      )}
                      
                      {section.type === 'image' && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1">
                            Image URL
                          </label>
                          <Input
                            type="url"
                            value={tempImageUrl}
                            onChange={(e) => setTempImageUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="mb-3 text-sm"
                          />
                        </div>
                      )}
                      
                      {(section.type === 'image' || section.type === 'quote') && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1">
                            Caption
                          </label>
                          <Input
                            type="text"
                            value={tempCaption}
                            onChange={(e) => setTempCaption(e.target.value)}
                            placeholder="Enter caption (optional)"
                            className="text-sm"
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={cancelEditSection}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button"
                          size="sm"
                          onClick={saveSection}
                        >
                          Save Section
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Content Tools */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSection('text')}
            className="flex items-center"
          >
            <Bold className="h-4 w-4 mr-2" />
            Add Text
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSection('image')}
            className="flex items-center"
          >
            <Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSection('quote')}
            className="flex items-center"
          >
            <Quote className="h-4 w-4 mr-2" />
            Add Quote
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Content Preview</h3>
        <div className="border rounded-lg p-6 bg-background/30">
          <RichContentRenderer sections={contentSections} />
        </div>
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

export default BookFormRich;
