
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Book, books as allBooks } from '@/lib/data';
import { Helmet } from 'react-helmet-async';
import { Star, TrendingUp, ThumbsUp } from 'lucide-react';

const TrendingPage = () => {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [topRatedBooks, setTopRatedBooks] = useState<Book[]>([]);
  const [mostLikedBooks, setMostLikedBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    // Get trending books
    const trending = allBooks
      .filter(book => book.isTrending)
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    setTrendingBooks(trending);
    
    // Get top rated books
    const topRated = [...allBooks]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    setTopRatedBooks(topRated);
    
    // Get most liked books
    const mostLiked = [...allBooks]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
    setMostLikedBooks(mostLiked);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Trending Books | Book Summary App</title>
        <meta name="description" content="Discover trending, top-rated, and most popular book summaries that readers are loving right now." />
        <meta name="keywords" content="trending books, popular books, top-rated books, book summaries, bestsellers" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Trending Books</h1>
          <p className="text-muted-foreground mb-10">Discover what others are reading right now</p>
          
          {/* Trending Now Section */}
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Trending Now</h2>
            </div>
            
            {trendingBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trendingBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No trending books at the moment.</p>
            )}
          </section>
          
          {/* Top Rated Section */}
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-semibold">Top Rated</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {topRatedBooks.map((book, index) => (
                <div 
                  key={book.id} 
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
                    #{index + 1}
                  </div>
                  <div className="w-16 h-24 flex-shrink-0">
                    <img 
                      src={book.coverUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover rounded-md shadow-sm" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">by {book.author.name}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < Math.floor(book.rating) 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">{book.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Most Liked Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Most Liked</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mostLikedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TrendingPage;
