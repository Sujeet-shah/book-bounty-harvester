
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Book, books as allBooks } from '@/lib/data';
import { Helmet } from 'react-helmet-async';
import { createSlug } from '@/lib/seo';

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract all unique categories from books
    const allCategories = new Set<string>();
    allBooks.forEach(book => {
      book.genre.forEach(genre => {
        allCategories.add(genre);
      });
    });
    setCategories(Array.from(allCategories).sort());
    
    // Filter books by selected category or show all
    if (selectedCategory) {
      const filtered = allBooks.filter(book => 
        book.genre.includes(selectedCategory)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  }, [selectedCategory]);
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Book Categories | Book Summary App</title>
        <meta name="description" content="Explore book summaries by category. Find your favorite genres and discover new reads." />
        <meta name="keywords" content="book categories, book genres, book summaries, reading by genre" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Categories</h1>
          
          {/* Category Pills */}
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-foreground hover:bg-primary/10'
              }`}
            >
              All Categories
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary text-foreground hover:bg-primary/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Books Grid */}
          <div className="mt-8">
            {selectedCategory ? (
              <>
                <h2 className="text-2xl font-semibold mb-6">{selectedCategory} Books ({filteredBooks.length})</h2>
                {filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredBooks.map(book => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No books found in this category.</p>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map(category => {
                  const categoryBooks = allBooks.filter(book => book.genre.includes(category));
                  return (
                    <div key={category} className="book-card p-6">
                      <h3 className="text-xl font-semibold mb-3">{category}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{categoryBooks.length} books</p>
                      <div className="flex gap-2 mb-4">
                        {categoryBooks.slice(0, 3).map(book => (
                          <img 
                            key={book.id} 
                            src={book.coverUrl} 
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded-md shadow-sm" 
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setSelectedCategory(category)}
                        className="text-primary font-medium hover:underline"
                      >
                        View all
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;
