
import { Book } from './data';

// Generate SEO-friendly meta tags from book data
export const generateBookMetaTags = (book: Book) => {
  const title = `${book.title} by ${book.author.name} | BookSummary App`;
  const description = book.shortSummary || book.summary.substring(0, 160);
  
  const keywords = [
    book.title,
    book.author.name,
    ...book.genre,
    'book summary',
    'book review'
  ].join(', ');
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      image: book.coverUrl,
      url: `/book/${book.id}`,
      type: 'book',
      author: book.author.name
    }
  };
};

// Generate canonical URL for a book
export const getCanonicalUrl = (book: Book, baseUrl: string = 'https://booksummary.app') => {
  return `${baseUrl}/book/${book.id}/${encodeURIComponent(book.title.toLowerCase().replace(/\s+/g, '-'))}`;
};

// Format book genres for URL
export const formatGenreForUrl = (genre: string): string => {
  return genre.toLowerCase().replace(/\s+/g, '-');
};

// Create valid slugs for SEO-friendly URLs
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
};
