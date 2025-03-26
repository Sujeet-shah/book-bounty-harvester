
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, books as allBooks } from '@/lib/data';
import Navbar from '@/components/Navbar';
import BookDetail from '@/components/BookDetail';
import BookCard from '@/components/BookCard';
import AudioSummary from '@/components/AudioSummary';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { generateBookMetaTags } from '@/lib/seo';
import { getBookById, GutendexBook, getCoverImageUrl, extractGenres, extractShortDescription } from '@/lib/gutendexApi';
import { fetchModernBookById } from '@/lib/modernBooksApi';
import { useQuery } from '@tanstack/react-query';

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isGutenbergBook, setIsGutenbergBook] = useState(false);
  const [isModernBook, setIsModernBook] = useState(false);
  
  // Check if this is a Gutenberg book ID
  const gutenbergId = id?.startsWith('gutenberg-') ? Number(id.replace('gutenberg-', '')) : null;
  
  // Check if this is a modern book ID
  const modernBookId = id?.startsWith('modern-') ? id.replace('modern-', '') : null;

  // Use react-query for Gutenberg books
  const {
    data: gutenbergBook,
    isLoading: isGutenbergLoading
  } = useQuery({
    queryKey: ['book', gutenbergId],
    queryFn: () => getBookById(gutenbergId!),
    enabled: !!gutenbergId,
    meta: {
      onSuccess: (data: GutendexBook) => {
        console.log('Gutenberg book loaded:', data);
      },
      onError: (error: Error) => {
        console.error('Error loading Gutenberg book:', error);
      }
    }
  });

  // Use react-query for Modern books
  const {
    data: modernBook,
    isLoading: isModernLoading
  } = useQuery({
    queryKey: ['modernBook', modernBookId],
    queryFn: () => fetchModernBookById(modernBookId!),
    enabled: !!modernBookId,
    meta: {
      onSuccess: (data: Book) => {
        console.log('Modern book loaded:', data);
      },
      onError: (error: Error) => {
        console.error('Error loading Modern book:', error);
      }
    }
  });

  // Effect to handle local books
  useEffect(() => {
    if (!gutenbergId && !modernBookId) {
      // This is a regular book from our local data
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
      }, 300); // Reduced timer for faster loading
      
      return () => clearTimeout(timer);
    }
  }, [id, gutenbergId, modernBookId]);

  // Effect for modern books
  useEffect(() => {
    if (modernBook) {
      setIsModernBook(true);
      setBook(modernBook);
      
      // Get related modern books (could be expanded in the future)
      setRelatedBooks([]);
    }
  }, [modernBook]);

  // Effect to convert Gutenberg book to our Book format
  useEffect(() => {
    if (gutenbergBook) {
      setIsGutenbergBook(true);
      
      // Convert Gutenberg book to our Book format
      const genres = extractGenres(gutenbergBook);
      const coverUrl = getCoverImageUrl(gutenbergBook);
      const shortSummary = extractShortDescription(gutenbergBook);
      
      const authorName = gutenbergBook.authors.length > 0
        ? gutenbergBook.authors[0].name
        : "Unknown Author";
      
      const convertedBook: Book = {
        id: `gutenberg-${gutenbergBook.id}`,
        title: gutenbergBook.title,
        author: {
          id: `author-gutenberg-${gutenbergBook.id}`,
          name: authorName,
        },
        coverUrl: coverUrl,
        summary: gutenbergBook.subjects.join(". ") || "A classic work of literature.",
        shortSummary: shortSummary,
        genre: genres,
        dateAdded: new Date().toISOString(),
        rating: 4.5, // Default rating
        pageCount: Math.floor(Math.random() * 300) + 100, // Random page count
        yearPublished: gutenbergBook.authors[0]?.birth_year || 1900,
        likes: gutenbergBook.download_count || 0,
        isFeatured: false,
        isTrending: gutenbergBook.download_count > 1000,
        richSummary: [
          {
            type: 'text',
            content: gutenbergBook.subjects.join(". ") || "A classic work of literature."
          }
        ]
      };
      
      setBook(convertedBook);
      
      // For related books, we'd need to make another API call, but for now let's use empty array
      setRelatedBooks([]);
    }
  }, [gutenbergBook]);

  // Combined loading state
  const isLoading = (gutenbergId && isGutenbergLoading) || (modernBookId && isModernLoading) || (!gutenbergId && !modernBookId && !book);

  // Handle loading state and 404
  if (isLoading || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 px-4">
          <div className={isLoading ? "max-w-4xl mx-auto animate-pulse" : "max-w-4xl mx-auto text-center"}>
            {isLoading ? (
              <>
                <div className="h-8 w-32 bg-muted rounded-md mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="aspect-[3/4] rounded-xl bg-muted"></div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="h-8 w-3/4 bg-muted rounded-md"></div>
                    <div className="h-6 w-1/2 bg-muted rounded-md"></div>
                    <div className="h-32 bg-muted rounded-md"></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Helmet>
                  <title>Book Not Found | Book Summary App</title>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
                <p className="text-muted-foreground mb-8">
                  Sorry, we couldn't find the book you're looking for.
                </p>
                <Link to="/" className="btn-primary">
                  Back to Home
                </Link>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // SEO meta tags
  const seoData = generateBookMetaTags(book);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:image" content={seoData.openGraph.image} />
        <meta property="og:url" content={seoData.openGraph.url} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
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
          <BookDetail book={book} isGutenbergBook={isGutenbergBook} isModernBook={isModernBook} />
          
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
