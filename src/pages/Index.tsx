
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import FeaturedBook from '@/components/FeaturedBook';
import BookCard from '@/components/BookCard';
import { Book, books as allBooks } from '@/lib/data';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>(allBooks);
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Find a featured book
    const featured = allBooks.find(book => book.isFeatured);
    setFeaturedBook(featured || null);
    
    // Find trending books (exclude featured)
    const trending = allBooks
      .filter(book => book.isTrending && (!featured || book.id !== featured.id))
      .slice(0, 4);
    setTrendingBooks(trending);
    
    // Filter books by search term
    if (searchTerm) {
      const filtered = allBooks.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const authorMatch = book.author.name.toLowerCase().includes(searchTerm.toLowerCase());
        const genreMatch = book.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
        return titleMatch || authorMatch || genreMatch;
      });
      setBooks(filtered);
    } else {
      setBooks(allBooks);
    }
  }, [searchTerm]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Book Summary App | Discover and Read Book Summaries</title>
        <meta name="description" content="Discover summaries of popular books across various genres. Get the key insights without reading the entire book." />
        <meta name="keywords" content="book summaries, book insights, reading, literature, non-fiction, self-help, business books" />
        <meta property="og:title" content="Book Summary App | Quick Book Insights" />
        <meta property="og:description" content="Get key takeaways from the world's best books in minutes, not hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://booksummary.app" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-8 max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
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
                    onClick={() => setSearchTerm('')}
                    className="btn-secondary"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
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
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* All Books */}
              <div>
                <h2 className="text-2xl font-bold mb-6">All Books</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
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
