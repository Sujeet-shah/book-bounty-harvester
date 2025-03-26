
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { Book, books as allBooks } from '@/lib/data';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  searchBooksByCategory, 
  getBooksByCategories, 
  GutendexBook, 
  getCoverImageUrl, 
  extractGenres, 
  extractShortDescription 
} from '@/lib/gutendexApi';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Filter, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch categories and books by category with improved settings
  const { data: categoryBooks, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['booksByCategories'],
    queryFn: getBooksByCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });
  
  // Fetch books for a specific category when selected - faster loading
  const { data: selectedCategoryBooks, isLoading: isSelectedCategoryLoading } = useQuery({
    queryKey: ['categoryBooks', selectedCategory],
    queryFn: () => searchBooksByCategory(selectedCategory || ''),
    enabled: !!selectedCategory,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    meta: {
      onError: (error: Error) => {
        toast({
          title: `Error loading ${selectedCategory} books`,
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });
  
  useEffect(() => {
    // Extract all unique categories from books
    const allCategories = new Set<string>([
      'Fiction', 'Mystery', 'Science Fiction', 'Romance', 'Adventure', 
      'Fantasy', 'Classics', 'Biography', 'History', 'Children',
      'Poetry', 'Drama', 'Philosophy', 'Science', 'Art'
    ]);
    
    // Add categories from local books
    allBooks.forEach(book => {
      book.genre.forEach(genre => {
        allCategories.add(genre);
      });
    });
    
    setCategories(Array.from(allCategories).sort());
    
    // Filter local books by selected category or show all
    if (selectedCategory) {
      const filtered = allBooks.filter(book => 
        book.genre.includes(selectedCategory)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  }, [selectedCategory]);
  
  // Convert Gutendex book to our Book format
  const convertToBook = (gutendexBook: GutendexBook): Book => {
    const authorName = gutendexBook.authors[0]?.name || 'Unknown Author';
    return {
      id: `gutenberg-${gutendexBook.id}`,
      title: gutendexBook.title,
      author: {
        id: `author-${gutendexBook.id}`,
        name: authorName,
        bio: `${authorName} is an author of this book from Project Gutenberg.`
      },
      coverUrl: getCoverImageUrl(gutendexBook),
      summary: `This is a book titled "${gutendexBook.title}" by ${authorName} from Project Gutenberg. ${gutendexBook.subjects.join(', ')}`,
      shortSummary: extractShortDescription(gutendexBook),
      genre: extractGenres(gutendexBook),
      dateAdded: new Date().toISOString(),
      rating: 4.0,
      yearPublished: gutendexBook.authors[0]?.birth_year ? gutendexBook.authors[0].birth_year + 30 : 1900,
      likes: 0,
      isFeatured: false,
      isTrending: false,
      gutenbergId: gutendexBook.id
    };
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };
  
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Categories</h1>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Filter by genre</span>
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="mb-8">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="mt-6">
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
                    onClick={() => handleCategoryClick(category)}
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
                    <h2 className="text-2xl font-semibold mb-6">{selectedCategory} Books</h2>
                    
                    {isSelectedCategoryLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading {selectedCategory} books...</p>
                      </div>
                    ) : (
                      <>
                        {/* Combine local and API books */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {filteredBooks.map(book => (
                            <BookCard 
                              key={book.id} 
                              book={book} 
                              onBookClick={() => handleBookClick(book.id)}
                            />
                          ))}
                          
                          {selectedCategoryBooks?.results.map(book => (
                            <BookCard 
                              key={`gutenberg-${book.id}`} 
                              book={convertToBook(book)}
                              onBookClick={() => handleBookClick(`gutenberg-${book.id}`)}
                            />
                          ))}
                        </div>
                        
                        {filteredBooks.length === 0 && (!selectedCategoryBooks || selectedCategoryBooks.results.length === 0) && (
                          <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No books found in this category.</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {isCategoriesLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading categories...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map(category => {
                          // Get local books for this category
                          const localCategoryBooks = allBooks.filter(book => book.genre.includes(category));
                          
                          // Get API books for this category
                          const apiCategoryBooks = categoryBooks?.[category] || [];
                          
                          // Count of all books
                          const totalCount = localCategoryBooks.length + apiCategoryBooks.length;
                          
                          return (
                            <div key={category} className="book-card p-6 border rounded-lg hover:shadow-md transition-shadow">
                              <h3 className="text-xl font-semibold mb-3">{category}</h3>
                              <p className="text-sm text-muted-foreground mb-4">{totalCount} books</p>
                              <div className="flex gap-2 mb-4 overflow-hidden">
                                {/* Show covers from both local and API books */}
                                {localCategoryBooks.slice(0, 2).map(book => (
                                  <img 
                                    key={book.id} 
                                    src={book.coverUrl} 
                                    alt={book.title}
                                    className="w-12 h-16 object-cover rounded-md shadow-sm" 
                                  />
                                ))}
                                
                                {apiCategoryBooks.slice(0, 3 - localCategoryBooks.slice(0, 2).length).map(book => (
                                  <img 
                                    key={`gutenberg-${book.id}`} 
                                    src={getCoverImageUrl(book)} 
                                    alt={book.title}
                                    className="w-12 h-16 object-cover rounded-md shadow-sm" 
                                  />
                                ))}
                              </div>
                              <button 
                                onClick={() => handleCategoryClick(category)}
                                className="text-primary font-medium hover:underline"
                              >
                                View all
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-6">
              <div className="space-y-6">
                {categories.map(category => {
                  // Get local books for this category
                  const localCategoryBooks = allBooks.filter(book => book.genre.includes(category));
                  
                  return (
                    <div key={category} className="border-b pb-6 last:border-0">
                      <h3 className="text-xl font-semibold mb-4">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {localCategoryBooks.slice(0, 6).map(book => (
                          <div 
                            key={book.id} 
                            className="cursor-pointer"
                            onClick={() => handleBookClick(book.id)}
                          >
                            <img 
                              src={book.coverUrl} 
                              alt={book.title}
                              className="w-full aspect-[2/3] object-cover rounded-md shadow-sm mb-2" 
                            />
                            <p className="text-xs font-medium line-clamp-1">{book.title}</p>
                          </div>
                        ))}
                      </div>
                      
                      {localCategoryBooks.length > 0 && (
                        <button 
                          onClick={() => handleCategoryClick(category)}
                          className="text-primary text-sm font-medium hover:underline mt-3 inline-block"
                        >
                          View all {category} books
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;
