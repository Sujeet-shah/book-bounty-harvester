
import { useState, useEffect } from 'react';
import { Book, books as allBooks } from '@/lib/data';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import FeaturedBook from '@/components/FeaturedBook';
import SearchBar from '@/components/SearchBar';
import { BookOpen, TrendingUp, Bookmark, BookText, ChevronRight } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setBooks(allBooks);
      setFeaturedBooks(allBooks.filter(book => book.isFeatured));
      setTrendingBooks(allBooks.filter(book => book.isTrending));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="layout-section bg-gradient-to-b from-muted/50 to-transparent">
          <div className="layout-page">
            <div className="flex flex-col items-center text-center mb-12 animate-slide-up">
              <div className="chip bg-primary/10 text-primary mb-4">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>Book Summaries</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 max-w-3xl">
                Discover the essence of great books
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Unlock the wisdom of bestselling books with concise summaries that capture their core ideas and insights.
              </p>
              
              <div className="w-full max-w-2xl">
                <SearchBar
                  onSearch={(term) => console.log('Searching for:', term)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBooks.slice(0, 3).map((book) => (
                  <FeaturedBook key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Popular Categories */}
        <section className="layout-section">
          <div className="layout-page">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Popular Categories</h2>
              <Link to="/categories" className="flex items-center text-primary hover:underline">
                <span className="mr-1">View All</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <CategoryCard 
                name="Self-Help" 
                icon={BookText} 
                count={24} 
                color="bg-blue-50 text-blue-600" 
              />
              <CategoryCard 
                name="Business" 
                icon={TrendingUp} 
                count={18} 
                color="bg-emerald-50 text-emerald-600" 
              />
              <CategoryCard 
                name="Psychology" 
                icon={Bookmark} 
                count={15} 
                color="bg-purple-50 text-purple-600" 
              />
              <CategoryCard 
                name="Philosophy" 
                icon={BookOpen} 
                count={12} 
                color="bg-amber-50 text-amber-600" 
              />
            </div>
          </div>
        </section>

        {/* Trending Books */}
        <section className="layout-section">
          <div className="layout-page">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold mr-3">Trending Books</h2>
                <div className="chip bg-red-50 text-red-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Popular</span>
                </div>
              </div>
              <Link to="/trending" className="flex items-center text-primary hover:underline">
                <span className="mr-1">View All</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trendingBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recently Added */}
        <section className="layout-section bg-muted/30">
          <div className="layout-page">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recently Added</h2>
              <Link to="/recent" className="flex items-center text-primary hover:underline">
                <span className="mr-1">View All</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl bg-white animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.slice(0, 4).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="layout-section">
          <div className="layout-page">
            <div className="glass-panel p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to dive deeper?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Explore our full collection of book summaries and start your journey to becoming more knowledgeable today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/browse" className="btn-primary w-full sm:w-auto">
                  Browse All Books
                </Link>
                <Link to="/admin" className="btn-secondary w-full sm:w-auto">
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-10">
        <div className="layout-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-medium">BookBounty</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Discover the essence of great books with our concise and insightful summaries.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
                <li><Link to="/trending" className="text-sm text-muted-foreground hover:text-primary transition-colors">Trending</Link></li>
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Admin</h4>
              <ul className="space-y-2">
                <li><Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Manage Books</Link></li>
                <li><Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Analytics</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} BookBounty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ 
  name, 
  icon: Icon, 
  count, 
  color 
}: { 
  name: string; 
  icon: typeof BookText; 
  count: number; 
  color: string;
}) => (
  <Link 
    to={`/category/${name.toLowerCase()}`}
    className="group flex flex-col items-center p-6 rounded-xl border bg-white hover:shadow-elegant-hover transition-all"
  >
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3`}>
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">{name}</h3>
    <p className="text-sm text-muted-foreground">{count} books</p>
  </Link>
);

export default Index;
