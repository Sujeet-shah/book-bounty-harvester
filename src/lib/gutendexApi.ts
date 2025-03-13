
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

// Helper function to get a suitable cover image from a Gutendex book
export const getCoverImageUrl = (book: GutendexBook): string => {
  const imageFormats = [
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];
  
  // Find the first available image format
  for (const format of imageFormats) {
    if (book.formats[format]) {
      return book.formats[format];
    }
  }
  
  // If no image is available, return a placeholder
  return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop';
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
