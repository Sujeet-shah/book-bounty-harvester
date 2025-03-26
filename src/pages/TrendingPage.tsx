import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Book, books as allBooks } from '@/lib/data';
import { Helmet } from 'react-helmet-async';
import { Star, TrendingUp, ThumbsUp } from 'lucide-react';
import { generatePageMetaTags } from '@/lib/seo';

const TrendingPage = () => {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [topRatedBooks, setTopRatedBooks] = useState<Book[]>([]);
  const [mostLikedBooks, setMostLikedBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    const trending = allBooks
      .filter(book => book.isTrending)
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    setTrendingBooks(trending);
    
    const topRated = [...allBooks]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    setTopRatedBooks(topRated);
    
    const mostLiked = [...allBooks]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
    setMostLikedBooks(mostLiked);
  }, []);
  
  const metaTags = generatePageMetaTags(
    'Trending Books | Book Summary App',
    'Discover trending, top-rated, and most popular book summaries that readers are loving right now. Find the best books across multiple genres.',
    [
      'trending books', 
      'popular books', 
      'top-rated books', 
      'book summaries', 
      'bestsellers',
      'most liked books',
      'recommended reading',
      'book recommendations',
      'popular classics',
      'current favorites'
    ]
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        <meta property="og:title" content={metaTags.openGraph.title} />
        <meta property="og:description" content={metaTags.openGraph.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://book-bounty-harvester.lovable.app/trending" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.openGraph.title} />
        <meta name="twitter:description" content={metaTags.openGraph.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://book-bounty-harvester.lovable.app/trending" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Trending Books",
            "description": metaTags.description,
            "url": "https://book-bounty-harvester.lovable.app/trending",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": trendingBooks.map((book, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Book",
                  "name": book.title,
                  "author": {
                    "@type": "Person",
                    "name": book.author.name
                  },
                  "url": `https://book-bounty-harvester.lovable.app/book/${book.id}`
                }
              }))
            }
          })}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Trending Books</h1>
          <p className="text-muted-foreground mb-10">Discover what others are reading right now</p>
          
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
