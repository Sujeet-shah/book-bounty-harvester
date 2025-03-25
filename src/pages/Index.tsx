
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import FeaturedBook from '@/components/FeaturedBook';
import BookCard from '@/components/BookCard';
import { Book, books as defaultBooks } from '@/lib/data';
import { Helmet } from 'react-helmet-async';
import { generatePageMetaTags, generateWebsiteStructuredData } from '@/lib/seo';
import { useQuery } from '@tanstack/react-query';
import { searchBooks, getCoverImageUrl, extractGenres, extractShortDescription, getPageFromUrl } from '@/lib/gutendexApi';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // SEO meta tags
  const metaTags = generatePageMetaTags(
    'Book Summary App', 
    'Discover summaries of popular books across various genres. Get the key insights without reading the entire book.',
    ['book summaries', 'book insights', 'reading', 'literature', 'non-fiction', 'self-help', 'business books']
  );
  
  useEffect(() => {
    // Extract search term from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || '';
    setSearchTerm(searchQuery);
  }, [location.search]);

  // Fetch books from Gutendex API
  const { 
    data: gutendexData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['gutendexBooks', searchTerm, page],
    queryFn: () => searchBooks(searchTerm, page),
    onSuccess: (data) => {
      const totalItems = data.count;
      const itemsPerPage = 32; // Typical items per page from Gutendex
      const calculatedPages = Math.ceil(totalItems / itemsPerPage);
      setTotalPages(calculatedPages);
    },
    onError: (error) => {
      toast({
        title: "Error loading books",
        description: (error as Error).message,
        variant: "destructive"
      });
    },
    enabled: true, // Always fetch on component mount
  });
  
  useEffect(() => {
    // Get books from localStorage if available, otherwise use default books
    const storedBooks = localStorage.getItem('bookSummaryBooks');
    const allBooks = storedBooks ? JSON.parse(storedBooks) : defaultBooks;
    
    // Find a featured book
    const featured = allBooks.find((book: Book) => book.isFeatured);
    setFeaturedBook(featured || null);
    
    // Find trending books (exclude featured)
    const trending = allBooks
      .filter((book: Book) => book.isTrending && (!featured || book.id !== featured.id))
      .slice(0, 4);
    setTrendingBooks(trending);
    
    // Set local books in state
    setLocalBooks(allBooks);
  }, []);

  // Convert Gutendex books to our Book format
  const convertGutendexBooks = () => {
    if (!gutendexData) return [];
    
    return gutendexData.results.map(book => {
      const authorName = book.authors[0]?.name || 'Unknown Author';
      return {
        id: `gutenberg-${book.id}`,
        title: book.title,
        author: {
          id: `author-${book.id}`,
          name: authorName,
          bio: `${authorName} is an author of this book from Project Gutenberg.`
        },
        coverUrl: getCoverImageUrl(book),
        summary: `This is a book titled "${book.title}" by ${authorName} from Project Gutenberg. ${book.subjects.join(', ')}`,
        shortSummary: extractShortDescription(book),
        genre: extractGenres(book),
        dateAdded: new Date().toISOString(),
        rating: 4.0,
        yearPublished: book.authors[0]?.birth_year ? book.authors[0].birth_year + 30 : 1900,
        likes: 0,
        isFeatured: false,
        isTrending: false,
        gutenbergId: book.id
      };
    });
  };
  
  const gutendexBooks = convertGutendexBooks();
  
  // Combine local books with Gutendex books based on search
  const displayBooks = searchTerm ? gutendexBooks : [...localBooks, ...gutendexBooks];
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset page when searching
    // Update the URL with the search term
    if (term) {
      navigate(`/?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/');
    }
  };
  
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
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
        <script type="application/ld+json">
          {generateWebsiteStructuredData()}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-8 max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          </div>
          
          {searchTerm ? (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Search Results {gutendexData ? `(${gutendexData.count})` : ''}
              </h2>
              
              {isLoading && !gutendexBooks.length ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Searching for books...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">Error loading books: {(error as Error).message}</p>
                  <button 
                    onClick={() => refetch()}
                    className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : displayBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No books found matching "{searchTerm}"</p>
                  <button 
                    onClick={() => handleSearch('')}
                    className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {displayBooks.map((book) => (
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
                      Page {page} of {totalPages || '?'}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages || !gutendexData?.next}
                      className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Featured Book */}
              {featuredBook && (
                <div className="mb-16">
                  <FeaturedBook book={featuredBook} />
                </div>
              )}
              
              {/* Trending Books */}
              {trendingBooks.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {trendingBooks.map((book) => (
                      <BookCard key={book.id} book={book} onBookClick={() => handleBookClick(book.id)} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Project Gutenberg Books */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Discover Classic Books</h2>
                {isLoading && !gutendexBooks.length ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading classic books...</p>
                  </div>
                ) : isError ? (
                  <Card className="bg-muted/30">
                    <CardContent className="text-center py-12">
                      <p className="text-destructive mb-4">Failed to load classic books</p>
                      <button 
                        onClick={() => refetch()}
                        className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Try Again
                      </button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {gutendexBooks.map((book) => (
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
                        Page {page} of {totalPages || '?'}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={page >= totalPages || !gutendexData?.next}
                        className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* All Books */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Collection</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {localBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={() => handleBookClick(book.id)} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
