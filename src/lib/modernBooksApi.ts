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

// Cache of generated books to ensure consistency
const bookCache = new Map<string, Book>();

// This would normally fetch from a real API, but we'll simulate it
export const fetchModernBooks = async (page: number = 1, limit: number = 20): Promise<ModernBooksResponse> => {
  // Simulate API call delay but keep it short
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate 5000 books in batches
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, 5000);
  
  const books: ModernBook[] = [];
  
  for (let i = startIndex; i < endIndex; i++) {
    const currentYear = new Date().getFullYear();
    const publishedYear = Math.floor(Math.random() * (currentYear - 1950)) + 1950;
    
    // Generate the book or retrieve from cache
    const bookId = `${i}`;
    let book: ModernBook;
    
    const cachedBook = bookCache.get(`modern-${bookId}`);
    if (cachedBook) {
      // Convert cached book back to ModernBook format
      book = {
        id: bookId,
        title: cachedBook.title,
        author: cachedBook.author.name,
        summary: cachedBook.summary,
        coverImage: cachedBook.coverUrl,
        publishedYear: cachedBook.yearPublished || publishedYear,
        genres: cachedBook.genre,
        rating: cachedBook.rating
      };
    } else {
      book = generateModernBook(i, publishedYear);
    }
    
    books.push(book);
  }
  
  return {
    books,
    total: 5000
  };
};

// Fetch a single modern book by ID
export const fetchModernBookById = async (id: string): Promise<Book> => {
  // Check cache first
  const cachedBook = bookCache.get(`modern-${id}`);
  if (cachedBook) {
    return cachedBook;
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Parse the ID to get the index
  const index = parseInt(id);
  const currentYear = new Date().getFullYear();
  const publishedYear = Math.floor(Math.random() * (currentYear - 1950)) + 1950;
  
  // Generate the book
  const modernBook = generateModernBook(index, publishedYear);
  
  // Convert to our Book format
  const book = convertToAppBook(modernBook);
  
  // Cache the book
  bookCache.set(book.id, book);
  
  return book;
};

// Convert modern book format to our app's Book format
export const convertToAppBook = (book: ModernBook): Book => {
  const appBook: Book = {
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
  
  return appBook;
};

// Book title components for more realistic titles
const titlePrefixes = [
  'The', 'A', 'Secret', 'Lost', 'Hidden', 'Forgotten', 'Last', 'First',
  'New', 'Ancient', 'Modern', 'Eternal', 'Infinite', 'Dark', 'Bright',
  'Silent', 'Loud', 'Quiet', 'Brave', 'Fearless', 'Mysterious', 'Radiant',
  'Shattered', 'Broken', 'Healed', 'Perfect', 'Imperfect', 'Sacred', 'Stolen',
  'Golden', 'Silver', 'Midnight', 'Burning', 'Frozen', 'Electric', 'Velvet'
];

const titleNouns = [
  'Road', 'Mountain', 'River', 'Forest', 'City', 'Ocean', 'Sky', 'Star',
  'Moon', 'Sun', 'Dream', 'Memory', 'Hope', 'Love', 'Journey', 'Adventure',
  'Mystery', 'Secret', 'Truth', 'Lie', 'Song', 'Dance', 'Story', 'Tale',
  'History', 'Future', 'Past', 'Present', 'Life', 'Death', 'Heart', 'Soul',
  'Shadow', 'Light', 'Fire', 'Water', 'Earth', 'Air', 'Child', 'Garden',
  'House', 'World', 'Universe', 'Kingdom', 'Empire', 'Mind', 'Spirit', 'Voice'
];

const titleSuffixes = [
  'of Time', 'of Space', 'of Light', 'of Darkness', 'of the Heart',
  'of the Mind', 'of the Soul', 'of the World', 'of the Universe',
  'of Tomorrow', 'of Yesterday', 'of Dreams', 'of Memories',
  'of Shadows', 'of Echoes', 'of Whispers', 'of Silence',
  'of Eternity', 'of Infinity', 'of Destiny', 'of Fate', 'of Fortune',
  'of Courage', 'of Honor', 'of Truth', 'of Lies', 'of Secrets',
  'of Passion', 'of Desire', 'of Hope', 'of Despair', 'of Joy',
  'of Sorrow', 'in Bloom', 'in Ruins', 'in Chains', 'in Flight'
];

// Well-known authors for modern books
const authors = [
  'Margaret Atwood', 'Haruki Murakami', 'Toni Morrison', 'Stephen King', 
  'J.K. Rowling', 'George R.R. Martin', 'Neil Gaiman', 'Chimamanda Ngozi Adichie',
  'Donna Tartt', 'Khaled Hosseini', 'Dan Brown', 'Malcolm Gladwell',
  'Yuval Noah Harari', 'Michelle Obama', 'Ta-Nehisi Coates', 'Zadie Smith',
  'Cormac McCarthy', 'Ian McEwan', 'Gillian Flynn', 'Colson Whitehead',
  'Gabriel García Márquez', 'Alice Walker', 'Isabel Allende', 'John Grisham',
  'James Patterson', 'Paulo Coelho', 'Jhumpa Lahiri', 'Arundhati Roy'
];

// Popular modern genres
const genres = [
  'Fiction', 'Non-fiction', 'Science Fiction', 'Fantasy', 'Mystery', 
  'Thriller', 'Romance', 'Historical Fiction', 'Biography', 'Self-help',
  'Business', 'Science', 'Technology', 'Philosophy', 'Psychology',
  'Politics', 'Travel', 'Cooking', 'Art', 'Music', 'Crime', 'Young Adult',
  'Dystopian', 'Contemporary', 'Memoir', 'Horror', 'Literary Fiction'
];

// Generate a modern book with realistic data
const generateModernBook = (index: number, publishedYear: number): ModernBook => {
  // Generate a random title
  const titlePrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  const titleNoun = titleNouns[Math.floor(Math.random() * titleNouns.length)];
  const useSuffix = Math.random() > 0.3;
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
