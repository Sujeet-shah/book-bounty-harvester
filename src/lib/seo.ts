
import { Book } from './data';

// Generate SEO-friendly meta tags from book data
export const generateBookMetaTags = (book: Book) => {
  const title = `${book.title} by ${book.author.name} | BookSummary App`;
  const description = book.shortSummary || (book.summary && book.summary.substring(0, 160)) || `Read our summary of ${book.title} by ${book.author.name}`;
  
  const keywords = [
    book.title,
    book.author.name,
    ...(book.genre || []),
    'book summary',
    'book review',
    'book insights',
    'book analysis',
    'literature',
    'reading'
  ].join(', ');
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      image: book.coverUrl || '/og-image.png',
      url: `/book/${book.id}/${createSlug(book.title)}`,
      type: 'book',
      author: book.author.name
    }
  };
};

// Generate canonical URL for a book
export const getCanonicalUrl = (book: Book, baseUrl: string = 'https://book-bounty-harvester.lovable.app') => {
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
export const generateBookStructuredData = (book: Book, baseUrl: string = 'https://book-bounty-harvester.lovable.app') => {
  const bookData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author.name
    },
    description: book.shortSummary || (book.summary && book.summary.substring(0, 160)) || `Summary of ${book.title}`,
    image: book.coverUrl || `${baseUrl}/og-image.png`,
    url: `${baseUrl}/book/${book.id}/${createSlug(book.title)}`,
    publisher: 'BookSummary App',
    genre: book.genre,
    datePublished: book.yearPublished?.toString() || book.dateAdded,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: book.rating,
        bestRating: '5'
      }
    },
    inLanguage: "en",
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/book/${book.id}/${createSlug(book.title)}`
    }
  };

  return JSON.stringify(bookData);
};

// Generate JSON-LD structured data for the website
export const generateWebsiteStructuredData = (baseUrl: string = 'https://book-bounty-harvester.lovable.app') => {
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
    description: 'Discover summaries of popular books across various genres. Get the key insights without reading the entire book.',
    publisher: {
      '@type': 'Organization',
      name: 'BookSummary App',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/og-image.png`
      }
    },
    inLanguage: "en",
    copyrightYear: new Date().getFullYear()
  };

  return JSON.stringify(websiteData);
};

// Generate basic meta tags for non-book pages
export const generatePageMetaTags = (
  title: string, 
  description: string, 
  keywords: string[] = [],
  path: string = ''
) => {
  return {
    title: `${title} | BookSummary App`,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: `${title} | BookSummary App`,
      description,
      url: `/${path || title.toLowerCase().replace(/\s+/g, '-')}`,
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

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (
  items: Array<{name: string, url: string}>,
  baseUrl: string = 'https://book-bounty-harvester.lovable.app'
) => {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${baseUrl}${item.url}`
    }))
  };

  return JSON.stringify(breadcrumbData);
};

// Generate FAQ structured data
export const generateFAQStructuredData = (
  faqs: Array<{question: string, answer: string}>
) => {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return JSON.stringify(faqData);
};
