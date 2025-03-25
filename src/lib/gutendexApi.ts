
// Interface for Gutendex API responses
export interface GutendexResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GutendexBook[];
}

export interface GutendexBook {
  id: number;
  title: string;
  authors: {
    name: string;
    birth_year: number | null;
    death_year: number | null;
  }[];
  translators: {
    name: string;
    birth_year: number | null;
    death_year: number | null;
  }[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  media_type: string;
  formats: {
    [key: string]: string;
  };
  download_count: number;
  summaries?: string[];
}

const BASE_URL = 'https://gutendex.com/books';

export const searchBooks = async (query: string, page: number = 1): Promise<GutendexResponse> => {
  const url = `${BASE_URL}/?search=${encodeURIComponent(query)}&page=${page}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching books: ${response.statusText}`);
  }
  
  return await response.json();
};

export const getBookById = async (id: number): Promise<GutendexBook> => {
  const url = `${BASE_URL}/${id}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching book: ${response.statusText}`);
  }
  
  return await response.json();
};

// Search books by category/topic
export const searchBooksByCategory = async (category: string, page: number = 1): Promise<GutendexResponse> => {
  // Gutendex allows searching by topic which is similar to category
  const url = `${BASE_URL}/?topic=${encodeURIComponent(category)}&page=${page}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching books by category: ${response.statusText}`);
  }
  
  return await response.json();
};

// Helper function to get a suitable cover image from a Gutendex book
export const getCoverImageUrl = (book: GutendexBook): string => {
  // First try to get the cover image from the formats
  if (book.formats['image/jpeg']) {
    return book.formats['image/jpeg'];
  }
  
  // Then try other image formats
  const imageFormats = [
    'image/png',
    'image/jpg'
  ];
  
  // Find the first available image format
  for (const format of imageFormats) {
    if (book.formats[format]) {
      return book.formats[format];
    }
  }
  
  // If no image is available, return a placeholder based on book title for variety
  const seed = book.title.length % 10;
  return `https://source.unsplash.com/random/300x400/?book,${encodeURIComponent(book.title)}&sig=${seed}`;
};

// Helper function to extract genres from a Gutendex book
export const extractGenres = (book: GutendexBook): string[] => {
  // Extract genres from subjects
  const subjects = book.subjects.slice(0, 3);
  
  // If we have fewer than 3 subjects, add bookshelves
  if (subjects.length < 3 && book.bookshelves.length > 0) {
    subjects.push(...book.bookshelves.slice(0, 3 - subjects.length));
  }
  
  // Clean up the subjects (remove periods, capitalize, etc.)
  return subjects.map(subject => {
    // Take only the first part of a subject if it contains -- or ,
    const parts = subject.split(/--|,/);
    const cleaned = parts[0].trim();
    
    // Capitalize the first letter
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  });
};

// Map common topics/subjects to standard categories
export const mapSubjectToCategory = (subject: string): string => {
  const subjectLower = subject.toLowerCase();
  
  const mappings: Record<string, string> = {
    'fiction': 'Fiction',
    'novel': 'Fiction',
    'fiction, general': 'Fiction',
    'juvenile fiction': 'Children',
    'children': 'Children',
    'children\'s literature': 'Children',
    'science fiction': 'Science Fiction',
    'adventure': 'Adventure',
    'fantasy': 'Fantasy',
    'mystery': 'Mystery',
    'detective': 'Mystery',
    'thriller': 'Thriller',
    'horror': 'Horror',
    'romance': 'Romance',
    'love stories': 'Romance',
    'historical': 'Historical Fiction',
    'history': 'History',
    'biography': 'Biography',
    'autobiography': 'Biography',
    'memoirs': 'Biography',
    'philosophy': 'Philosophy',
    'psychology': 'Psychology',
    'self-help': 'Self-Help',
    'business': 'Business',
    'economics': 'Business',
    'science': 'Science',
    'technology': 'Technology',
    'computers': 'Technology',
    'art': 'Art',
    'music': 'Art',
    'poetry': 'Poetry',
    'drama': 'Drama',
    'plays': 'Drama',
    'religion': 'Religion',
    'spirituality': 'Religion',
    'travel': 'Travel',
    'cooking': 'Cooking',
    'health': 'Health',
    'sports': 'Sports',
    'education': 'Education',
    'reference': 'Reference',
    'classic': 'Classics',
    'classics': 'Classics',
    'literature': 'Literature'
  };
  
  for (const [key, value] of Object.entries(mappings)) {
    if (subjectLower.includes(key)) {
      return value;
    }
  }
  
  // Default to the original subject with first letter capitalized
  return subject.charAt(0).toUpperCase() + subject.slice(1);
};

// Helper function to extract a short description from a Gutendex book
export const extractShortDescription = (book: GutendexBook): string => {
  // Check if book has summaries from Gutendex
  if (book.summaries && book.summaries.length > 0) {
    const summary = book.summaries[0];
    // Return first 100 characters of summary
    return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
  }
  
  // If we have subjects, use them to create a description
  if (book.subjects.length > 0) {
    const topSubjects = book.subjects.slice(0, 3).map(s => {
      const parts = s.split(/--|,/);
      return parts[0].trim();
    }).join(", ");
    
    return `A classic work about ${topSubjects}.`;
  }
  
  // Fall back to a generic description with the author
  const authorName = book.authors[0]?.name || "an unknown author";
  return `A classic work by ${authorName}.`;
};

// Helper function to generate a more detailed summary from Gutendex book data
export const generateDetailedSummary = (book: GutendexBook): string => {
  let summary = '';
  
  // Start with a basic introduction
  const authorName = book.authors[0]?.name || "an unknown author";
  const authorYears = book.authors[0]?.birth_year && book.authors[0]?.death_year ? 
    `(${book.authors[0].birth_year}-${book.authors[0].death_year})` : 
    '';
  
  summary += `"${book.title}" is a classic work by ${authorName} ${authorYears}. `;
  
  // Add information about the topics
  if (book.subjects.length > 0) {
    const subjectSummary = book.subjects.slice(0, 5)
      .map(s => {
        const parts = s.split(/--|,/);
        return parts[0].trim();
      })
      .join(", ");
    
    summary += `The book covers topics such as ${subjectSummary}. `;
  }
  
  // Add information about its popularity
  if (book.download_count) {
    summary += `It has been downloaded ${book.download_count} times from Project Gutenberg. `;
  }
  
  // Add information about languages
  if (book.languages.length > 0) {
    const languageNames = book.languages.map(lang => {
      const langMap: Record<string, string> = {
        'en': 'English',
        'fr': 'French',
        'es': 'Spanish',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'la': 'Latin',
        'gr': 'Greek'
      };
      return langMap[lang] || lang;
    });
    
    if (languageNames.length === 1) {
      summary += `The book is available in ${languageNames[0]}. `;
    } else {
      const lastLang = languageNames.pop();
      summary += `The book is available in ${languageNames.join(', ')} and ${lastLang}. `;
    }
  }
  
  // Information about available formats
  const textFormats = [];
  if (book.formats['text/plain; charset=utf-8']) textFormats.push('plain text');
  if (book.formats['text/html; charset=utf-8']) textFormats.push('HTML');
  if (book.formats['application/epub+zip']) textFormats.push('EPUB');
  if (book.formats['application/pdf']) textFormats.push('PDF');
  
  if (textFormats.length > 0) {
    const formatList = textFormats.join(', ');
    summary += `It can be read in ${formatList} format${textFormats.length > 1 ? 's' : ''}.`;
  }
  
  return summary;
};

// Helper function to parse the page number from the next URL
export const getPageFromUrl = (url: string | null): number => {
  if (!url) return 1;
  
  const match = url.match(/page=(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1]) - 1; // The 'next' URL points to the next page, so current is one less
  }
  return 1;
};

// Get modern books (those with higher download counts are usually more popular/modern)
export const getModernBooks = async (page: number = 1): Promise<GutendexResponse> => {
  // Sort by download_count to get popular books which are often more modern in their appeal
  const url = `${BASE_URL}/?sort=download_count&page=${page}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching modern books: ${response.statusText}`);
  }
  
  return await response.json();
};

// Get books by multiple categories
export const getBooksByCategories = async (): Promise<Record<string, GutendexBook[]>> => {
  const categories = [
    'Fiction', 'Mystery', 'Science Fiction', 'Romance', 'Adventure', 
    'Fantasy', 'Classics', 'Biography'
  ];
  
  const result: Record<string, GutendexBook[]> = {};
  
  // Use Promise.all to fetch books for all categories in parallel
  await Promise.all(
    categories.map(async (category) => {
      try {
        const data = await searchBooksByCategory(category);
        result[category] = data.results.slice(0, 8); // Get up to 8 books per category
      } catch (error) {
        console.error(`Error fetching ${category} books:`, error);
        result[category] = []; // Empty array if there's an error
      }
    })
  );
  
  return result;
};
