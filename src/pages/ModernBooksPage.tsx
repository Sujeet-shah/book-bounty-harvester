
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Book } from '@/lib/data';
import { fetchModernBooks, convertToAppBook } from '@/lib/modernBooksApi';
import { Helmet } from 'react-helmet-async';
import { generatePageMetaTags } from '@/lib/seo';
import { ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const ModernBooksPage = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // SEO meta tags
  const metaTags = generatePageMetaTags(
    'Modern Books | Book Summary App', 
    'Discover summaries of popular modern books across various genres.',
    ['modern books', 'contemporary literature', 'book summaries', 'reading']
  );
  
  // Use React Query for data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['modernBooks', page],
    queryFn: () => fetchModernBooks(page, 20),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true
  });
  
  // Handle error
  useEffect(() => {
    if (error) {
      console.error('Error loading modern books:', error);
      toast({
        title: "Error",
        description: "Failed to load books. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Update total pages when data is loaded
  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.total / 20));
    }
  }, [data]);
  
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };
  
  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo(0, 0);
  };
  
  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  // Convert API books to our Book format
  const books: Book[] = data?.books.map(book => convertToAppBook(book)) || [];
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        <meta property="og:title" content={metaTags.openGraph.title} />
        <meta property="og:description" content={metaTags.openGraph.description} />
        <meta property="og:type" content={metaTags.openGraph.type} />
        <meta property="og:url" content={metaTags.openGraph.url} />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Modern Books</h1>
          
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No books found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} onBookClick={() => handleBookClick(book.id)} />
                ))}
              </div>
              
              {/* Pagination controls */}
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                <span className="px-4 py-2 text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModernBooksPage;
