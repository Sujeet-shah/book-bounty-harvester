
import { Book } from './data';

// Interface for modern books API response
interface ModernBooksResponse {
  books: ModernBook[];
  total: number;
}

interface ModernBook {
  id: string;
  title: string;
  author: string;
  summary: string;
  coverImage: string;
  publishedYear: number;
  genres: string[];
  rating: number;
}

// This would normally fetch from a real API, but we'll simulate it
export const fetchModernBooks = async (page: number = 1, limit: number = 20): Promise<ModernBooksResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate 5000 books in batches
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, 5000);
  
  const books: ModernBook[] = [];
  
  for (let i = startIndex; i < endIndex; i++) {
    const currentYear = new Date().getFullYear();
    const publishedYear = Math.floor(Math.random() * (currentYear - 1950)) + 1950;
    
    books.push(generateModernBook(i, publishedYear));
  }
  
  return {
    books,
    total: 5000
  };
};

// Convert modern book format to our app's Book format
export const convertToAppBook = (book: ModernBook): Book => {
  return {
    id: `modern-${book.id}`,
    title: book.title,
    author: {
      id: `author-${book.id}`,
      name: book.author,
    },
    coverUrl: book.coverImage,
    summary: book.summary,
    shortSummary: book.summary.substring(0, 100) + '...',
    genre: book.genres,
    dateAdded: new Date().toISOString(),
    rating: book.rating,
    yearPublished: book.publishedYear,
    likes: Math.floor(Math.random() * 100),
    isFeatured: false,
    isTrending: Math.random() > 0.8,
    richSummary: [
      {
        type: 'text',
        content: book.summary
      }
    ]
  };
};

// Generate a modern book with realistic data
const generateModernBook = (index: number, publishedYear: number): ModernBook => {
  const genres = [
    'Fiction', 'Non-fiction', 'Science Fiction', 'Fantasy', 'Mystery', 
    'Thriller', 'Romance', 'Historical Fiction', 'Biography', 'Self-help',
    'Business', 'Science', 'Technology', 'Philosophy', 'Psychology',
    'Politics', 'Travel', 'Cooking', 'Art', 'Music'
  ];
  
  const authors = [
    'Margaret Atwood', 'Haruki Murakami', 'Toni Morrison', 'Stephen King', 
    'J.K. Rowling', 'George R.R. Martin', 'Neil Gaiman', 'Chimamanda Ngozi Adichie',
    'Donna Tartt', 'Khaled Hosseini', 'Dan Brown', 'Malcolm Gladwell',
    'Yuval Noah Harari', 'Michelle Obama', 'Ta-Nehisi Coates', 'Zadie Smith',
    'Cormac McCarthy', 'Ian McEwan', 'Gillian Flynn', 'Colson Whitehead'
  ];
  
  const titlePrefixes = [
    'The', 'A', 'Secret', 'Lost', 'Hidden', 'Forgotten', 'Last', 'First',
    'New', 'Ancient', 'Modern', 'Eternal', 'Infinite', 'Dark', 'Bright',
    'Silent', 'Loud', 'Quiet', 'Brave', 'Fearless'
  ];
  
  const titleNouns = [
    'Road', 'Mountain', 'River', 'Forest', 'City', 'Ocean', 'Sky', 'Star',
    'Moon', 'Sun', 'Dream', 'Memory', 'Hope', 'Love', 'Journey', 'Adventure',
    'Mystery', 'Secret', 'Truth', 'Lie', 'Song', 'Dance', 'Story', 'Tale',
    'History', 'Future', 'Past', 'Present', 'Life', 'Death'
  ];
  
  const titleSuffixes = [
    'of Time', 'of Space', 'of Light', 'of Darkness', 'of the Heart',
    'of the Mind', 'of the Soul', 'of the World', 'of the Universe',
    'of Tomorrow', 'of Yesterday', 'of Dreams', 'of Memories',
    'of Shadows', 'of Echoes', 'of Whispers', 'of Silence',
    'of Eternity', 'of Infinity', 'of Destiny'
  ];
  
  // Generate a random title
  const titlePrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  const titleNoun = titleNouns[Math.floor(Math.random() * titleNouns.length)];
  const useSuffix = Math.random() > 0.5;
  const titleSuffix = useSuffix ? ' ' + titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)] : '';
  const title = `${titlePrefix} ${titleNoun}${titleSuffix}`;
  
  // Select random author
  const author = authors[Math.floor(Math.random() * authors.length)];
  
  // Select random genres (1-3)
  const numGenres = Math.floor(Math.random() * 3) + 1;
  const bookGenres = [];
  const usedGenreIndices = new Set<number>();
  
  for (let i = 0; i < numGenres; i++) {
    let genreIndex;
    do {
      genreIndex = Math.floor(Math.random() * genres.length);
    } while (usedGenreIndices.has(genreIndex));
    
    usedGenreIndices.add(genreIndex);
    bookGenres.push(genres[genreIndex]);
  }
  
  // Generate a realistic summary
  const summary = generateBookSummary(title, author, bookGenres[0], publishedYear);
  
  // Generate a cover image using a placeholder service
  // In a real app, we'd use a real book cover API
  const coverImage = `https://source.unsplash.com/random/500x700/?book,${encodeURIComponent(bookGenres[0])}&sig=${index}`;
  
  return {
    id: `${index}`,
    title,
    author,
    summary,
    coverImage,
    publishedYear,
    genres: bookGenres,
    rating: (Math.random() * 2) + 3  // Rating between 3-5
  };
};

// Generate a realistic book summary
const generateBookSummary = (title: string, author: string, genre: string, year: number): string => {
  const summaryTemplates = [
    `In "${title}", ${author} explores the complexities of human relationships against the backdrop of a rapidly changing world. Set in ${year}, the story follows the journey of a protagonist who must confront personal demons while navigating societal expectations. With rich characterization and evocative prose, this ${genre} novel delves into themes of identity, belonging, and the search for meaning in a chaotic universe.`,
    
    `${author}'s bestselling ${genre} book "${title}" takes readers on an unforgettable journey through time and space. Published in ${year}, this groundbreaking work challenges conventional wisdom and offers fresh perspectives on age-old questions. Critics have praised its innovative narrative structure and powerful emotional impact, cementing ${author}'s reputation as one of the most important voices of the modern literary landscape.`,
    
    `"${title}" is a captivating ${genre} masterpiece that showcases ${author}'s unparalleled storytelling abilities. Written in ${year}, this book weaves together multiple storylines with precision and grace, creating a tapestry of human experience that resonates with readers across generations. Through memorable characters and vivid settings, ${author} explores universal themes of love, loss, and redemption.`,
    
    `In this thought-provoking ${genre} work published in ${year}, ${author} invites readers to question their assumptions about reality and truth. "${title}" combines scholarly research with accessible prose, making complex ideas understandable without sacrificing depth. The book has been hailed as a landmark contribution to its field, influencing countless other authors and thinkers since its publication.`,
    
    `${author}'s "${title}" stands as a defining ${genre} text of the late ${Math.floor(year/10)*10}s. Through meticulous research and compelling narrative, the book illuminates hidden aspects of our shared history and challenges readers to see the world with new eyes. Since its publication in ${year}, it has sparked important conversations about responsibility, justice, and the possibility of positive change in an imperfect world.`
  ];
  
  return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
};
