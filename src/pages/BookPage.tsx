
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, books as allBooks } from '@/lib/data';
import Navbar from '@/components/Navbar';
import BookDetail from '@/components/BookDetail';
import BookCard from '@/components/BookCard';
import AudioSummary from '@/components/AudioSummary';
import { ArrowLeft, BookOpen } from 'lucide-react';

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundBook = allBooks.find(b => b.id === id) || null;
      setBook(foundBook);
      
      if (foundBook) {
        // Get books with similar genres
        const similar = allBooks
          .filter(b => b.id !== foundBook.id && 
                     b.genre.some(g => foundBook.genre.includes(g)))
          .slice(0, 4);
        setRelatedBooks(similar);
      }
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 px-4">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 w-32 bg-muted rounded-md mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="aspect-[3/4] rounded-xl bg-muted"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 w-3/4 bg-muted rounded-md"></div>
                <div className="h-6 w-1/2 bg-muted rounded-md"></div>
                <div className="h-32 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
            <p className="text-muted-foreground mb-8">
              Sorry, we couldn't find the book you're looking for.
            </p>
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Back navigation */}
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
          
          {/* Book Details */}
          <BookDetail book={book} />
          
          {/* Audio Summary */}
          {book.audioSummaryUrl && (
            <div className="max-w-4xl mx-auto mt-8">
              <AudioSummary audioUrl={book.audioSummaryUrl} title={book.title} />
            </div>
          )}
          
          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {relatedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookPage;
