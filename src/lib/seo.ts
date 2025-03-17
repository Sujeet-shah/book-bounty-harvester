
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

// Generate JSON-LD structured data for books (Schema.org)
export const generateBookStructuredData = (book: Book, baseUrl: string = 'https://booksummary.app') => {
  const bookData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author.name
    },
    description: book.shortSummary || book.summary.substring(0, 160),
    image: book.coverUrl,
    url: `${baseUrl}/book/${book.id}/${createSlug(book.title)}`,
    publisher: book.publisher || 'BookSummary App',
    genre: book.genre,
    datePublished: book.publicationDate || book.dateAdded
  };

  return JSON.stringify(bookData);
};

// Generate JSON-LD structured data for the website
export const generateWebsiteStructuredData = (baseUrl: string = 'https://booksummary.app') => {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BookSummary App',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    description: 'Discover summaries of popular books across various genres. Get the key insights without reading the entire book.'
  };

  return JSON.stringify(websiteData);
};

// Generate basic meta tags for non-book pages
export const generatePageMetaTags = (
  title: string, 
  description: string, 
  keywords: string[] = []
) => {
  return {
    title: `${title} | BookSummary App`,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: `${title} | BookSummary App`,
      description,
      url: `/${title.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'website'
    }
  };
};

// Calculate reading time in minutes
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s/g).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
};
