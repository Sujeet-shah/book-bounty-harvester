
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SummaryGeneratorService } from '@/services/summary-generator.service';

const SummaryGeneratorPage = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookContent, setBookContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Read the file content for text files
      if (selectedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setBookContent(content);
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleGenerateSummary = async () => {
    if (!bookTitle.trim()) {
      toast({
        title: "Book title required",
        description: "Please enter a book title to generate a summary",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data for summary generation
      const data = {
        title: bookTitle,
        author: authorName,
        content: bookContent,
      };
      
      // Call the summary generation service
      const result = await SummaryGeneratorService.generateSummary(data);
      setSummary(result);
      
      toast({
        title: "Summary generated",
        description: "Your book summary has been generated successfully",
      });
    } catch (error) {
      console.error('Summary generation failed:', error);
      toast({
        title: "Summary generation failed",
        description: "There was an error generating the summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Generate Book Summary | Book Summary App</title>
        <meta name="description" content="Generate AI-powered summaries for your books" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Generate Book Summary</h1>
          
          <div className="glass-panel p-6 shadow-elegant rounded-lg animate-fade-in mb-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bookTitle">Book Title</Label>
                <Input 
                  id="bookTitle" 
                  value={bookTitle} 
                  onChange={(e) => setBookTitle(e.target.value)} 
                  placeholder="Enter the book title" 
                />
              </div>
              
              <div>
                <Label htmlFor="authorName">Author Name</Label>
                <Input 
                  id="authorName" 
                  value={authorName} 
                  onChange={(e) => setAuthorName(e.target.value)} 
                  placeholder="Enter the author name" 
                />
              </div>
              
              <div>
                <Label htmlFor="bookContent">Book Content (Optional)</Label>
                <Textarea 
                  id="bookContent" 
                  value={bookContent} 
                  onChange={(e) => setBookContent(e.target.value)} 
                  placeholder="Paste book content or upload a file" 
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="file">Upload Text File (Optional)</Label>
                <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/30">
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Upload a text file (.txt)</p>
                  <input 
                    id="file" 
                    type="file" 
                    accept=".txt" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <Button variant="outline" onClick={() => document.getElementById('file')?.click()}>
                    Select File
                  </Button>
                  {file && (
                    <p className="text-sm mt-2">Selected: {file.name}</p>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerateSummary}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
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
          
          {summary && (
            <div className="glass-panel p-6 shadow-elegant rounded-lg animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Generated Summary</h2>
              <div className="bg-muted/30 p-4 rounded-md">
                {summary.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(summary)}>
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SummaryGeneratorPage;
