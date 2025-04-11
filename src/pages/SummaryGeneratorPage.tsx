
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SummaryGeneratorService } from '@/services/summary-generator.service';

const SummaryGeneratorPage = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookContent, setBookContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = sessionStorage.getItem('ai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      SummaryGeneratorService.setApiKey(savedApiKey);
      setShowApiKeyInput(false);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      SummaryGeneratorService.setApiKey(apiKey.trim());
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

  const handleResetApiKey = () => {
    setApiKey('');
    sessionStorage.removeItem('ai_api_key');
    setShowApiKeyInput(true);
  };

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

    if (!SummaryGeneratorService.getApiKey()) {
      toast({
        title: "API Key required",
        description: "Please set your API key first",
        variant: "destructive",
      });
      setShowApiKeyInput(true);
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
        description: "There was an error generating the summary. Please check your API key.",
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
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
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
                  value={bookTitle} 
                  onChange={(e) => setBookTitle(e.target.value)} 
                  placeholder="Enter the book title" 
                  disabled={showApiKeyInput}
                />
              </div>
              
              <div>
                <Label htmlFor="authorName">Author Name</Label>
                <Input 
                  id="authorName" 
                  value={authorName} 
                  onChange={(e) => setAuthorName(e.target.value)} 
                  placeholder="Enter the author name" 
                  disabled={showApiKeyInput}
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
                  disabled={showApiKeyInput}
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
                    disabled={showApiKeyInput}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file')?.click()}
                    disabled={showApiKeyInput}
                  >
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
                disabled={isLoading || showApiKeyInput}
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
