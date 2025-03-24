
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import FeaturedBook from '@/components/FeaturedBook';
import BookCard from '@/components/BookCard';
import { Book, books as defaultBooks } from '@/lib/data';
import { Helmet } from 'react-helmet-async';
import { generatePageMetaTags, generateWebsiteStructuredData } from '@/lib/seo';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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
    
    // Filter books by search term
    if (searchTerm) {
      const filtered = allBooks.filter((book: Book) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const titleMatch = book.title.toLowerCase().includes(lowerSearchTerm);
        const authorMatch = book.author.name.toLowerCase().includes(lowerSearchTerm);
        const genreMatch = book.genre.some(g => g.toLowerCase().includes(lowerSearchTerm));
        const summaryMatch = book.shortSummary?.toLowerCase().includes(lowerSearchTerm) || 
                             book.summary.toLowerCase().includes(lowerSearchTerm);
        return titleMatch || authorMatch || genreMatch || summaryMatch;
      });
      setBooks(filtered);
    } else {
      setBooks(allBooks);
    }
  }, [searchTerm]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
                Search Results {books.length > 0 ? `(${books.length})` : ''}
              </h2>
              
              {books.length === 0 ? (
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={() => handleBookClick(book.id)} />
                  ))}
                </div>
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
              
              {/* All Books */}
              <div>
                <h2 className="text-2xl font-bold mb-6">All Books</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {books.map((book) => (
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
