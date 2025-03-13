
export interface Author {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: Author;
  coverUrl: string;
  summary: string;
  shortSummary: string;
  genre: string[];
  dateAdded: string;
  rating: number;
  pageCount?: number;
  yearPublished?: number;
  likes: number;
  isFeatured: boolean;
  isTrending: boolean;
}

export interface BookComment {
  id: string;
  bookId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  likes: number;
}

export const authors: Author[] = [
  {
    id: "author-1",
    name: "James Clear",
    bio: "James Clear is an author and speaker focused on habits, decision-making, and continuous improvement.",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "author-2",
    name: "Dale Carnegie",
    bio: "Dale Carnegie was an American writer and lecturer and the developer of courses in self-improvement, salesmanship, corporate training, public speaking, and interpersonal skills.",
    imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
  },
  {
    id: "author-3",
    name: "Robert Greene",
    bio: "Robert Greene is an American author known for his books on strategy, power, and seduction.",
    imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2074&auto=format&fit=crop"
  },
  {
    id: "author-4",
    name: "Ryan Holiday",
    bio: "Ryan Holiday is an American author, public relations strategist, bookstore owner, and host of the podcast The Daily Stoic.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "author-5",
    name: "Yuval Noah Harari",
    bio: "Yuval Noah Harari is an Israeli public intellectual, historian, and professor in the Department of History at the Hebrew University of Jerusalem.",
    imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop"
  },
];

export const books: Book[] = [
  {
    id: "book-1",
    title: "Atomic Habits",
    author: authors[0],
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop",
    summary: "Tiny Changes, Remarkable Results. No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. If you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change. You do not rise to the level of your goals. You fall to the level of your systems. Here, you'll get a proven system that can take you to new heights.",
    shortSummary: "An easy and proven way to build good habits and break bad ones through small, incremental changes.",
    genre: ["Self-Help", "Productivity", "Psychology"],
    dateAdded: "2023-12-01",
    rating: 4.8,
    pageCount: 320,
    yearPublished: 2018,
    likes: 5432,
    isFeatured: true,
    isTrending: true
  },
  {
    id: "book-2",
    title: "How to Win Friends and Influence People",
    author: authors[1],
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2012&auto=format&fit=crop",
    summary: "Since its release in 1936, How to Win Friends and Influence People has sold more than 30 million copies. Dale Carnegie's first book is a timeless bestseller, packed with rock-solid advice that has carried thousands of now famous people up the ladder of success in their business and personal lives. As relevant as ever before, Dale Carnegie's principles endure, and will help you achieve your maximum potential in the complex and competitive modern age. Learn the six ways to make people like you, the twelve ways to win people to your way of thinking, and the nine ways to change people without arousing resentment.",
    shortSummary: "The first and still the best book of its kind to lead you to success by showing how to get out of a mental rut and make life more rewarding.",
    genre: ["Self-Help", "Communication", "Psychology"],
    dateAdded: "2023-11-15",
    rating: 4.7,
    pageCount: 288,
    yearPublished: 1936,
    likes: 8754,
    isFeatured: false,
    isTrending: true
  },
  {
    id: "book-3",
    title: "The 48 Laws of Power",
    author: authors[2],
    coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1988&auto=format&fit=crop",
    summary: "Amoral, cunning, ruthless, and instructive, this multi-million-copy New York Times bestseller is the definitive manual for anyone interested in gaining, observing, or defending against ultimate control – from the author of The Laws of Human Nature. In the book that People magazine proclaimed "beguiling" and "fascinating," Robert Greene and Joost Elffers have distilled three thousand years of the history of power into 48 essential laws by drawing from the philosophies of Machiavelli, Sun Tzu, and Carl Von Clausewitz and also from the lives of figures ranging from Henry Kissinger to P.T. Barnum.",
    shortSummary: "A guide to understanding and using power dynamics for your advantage through historical examples and practical strategies.",
    genre: ["Psychology", "History", "Business"],
    dateAdded: "2023-10-20",
    rating: 4.6,
    pageCount: 452,
    yearPublished: 1998,
    likes: 7654,
    isFeatured: false,
    isTrending: false
  },
  {
    id: "book-4",
    title: "The Obstacle Is the Way",
    author: authors[3],
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop",
    summary: "The Obstacle Is the Way has become a cult classic, beloved by men and women around the world who apply its wisdom to become more successful at whatever they do. Its many fans include a former governor and movie star (Arnold Schwarzenegger), a hip hop icon (LL Cool J), an Irish tennis pro (James McGee), an NBC sportscaster (Michele Tafoya), and the coaches and players of winning teams like the New England Patriots, Seattle Seahawks, Chicago Cubs, and University of Texas men's basketball team. The book draws its inspiration from stoicism, the ancient Greek philosophy of enduring pain or adversity with perseverance and resilience.",
    shortSummary: "A modern reframing of Stoic philosophy to help you overcome challenges by turning obstacles into opportunities.",
    genre: ["Philosophy", "Self-Help", "Business"],
    dateAdded: "2023-11-05",
    rating: 4.5,
    pageCount: 224,
    yearPublished: 2014,
    likes: 5421,
    isFeatured: true,
    isTrending: false
  },
  {
    id: "book-5",
    title: "Sapiens: A Brief History of Humankind",
    author: authors[4],
    coverUrl: "https://images.unsplash.com/photo-1545239351-cefa43af60f3?q=80&w=1974&auto=format&fit=crop",
    summary: "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions. Drawing on insights from biology, anthropology, paleontology and economics, he explores how the currents of history have shaped our human societies, the animals and plants around us, and even our personalities. Have we become happier as history has unfolded? Can we ever free our behaviour from the heritage of our ancestors? And what, if anything, can we do to influence the course of the centuries to come?",
    shortSummary: "A groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us.",
    genre: ["History", "Anthropology", "Science"],
    dateAdded: "2023-09-10",
    rating: 4.7,
    pageCount: 464,
    yearPublished: 2014,
    likes: 9876,
    isFeatured: true,
    isTrending: true
  },
  {
    id: "book-6",
    title: "Ego Is the Enemy",
    author: authors[3],
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop",
    summary: "Many of us insist the main impediment to a full, successful life is the outside world. In fact, the most common enemy lies within: our ego. Early in our careers, it impedes learning and the cultivation of talent. With success, it can blind us to our faults and sow future problems. In failure, it magnifies each blow and makes recovery more difficult. At every stage, ego holds us back. Ego Is the Enemy draws on a vast array of stories and examples, from literature to philosophy to history. We meet fascinating figures such as George Marshall, Jackie Robinson, Katharine Graham, Bill Belichick, and Eleanor Roosevelt, who all reached the highest levels of power and success by conquering their own egos.",
    shortSummary: "A powerful exploration of how our ego can be our biggest obstacle to success and fulfillment.",
    genre: ["Philosophy", "Self-Help", "Psychology"],
    dateAdded: "2023-10-05",
    rating: 4.5,
    pageCount: 256,
    yearPublished: 2016,
    likes: 4321,
    isFeatured: false,
    isTrending: true
  },
];

export const comments: BookComment[] = [
  {
    id: "comment-1",
    bookId: "book-1",
    userName: "Alex Johnson",
    userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop",
    content: "This book completely changed how I think about habit formation. The idea of making tiny 1% improvements really resonated with me.",
    date: "2023-12-05",
    likes: 24
  },
  {
    id: "comment-2",
    bookId: "book-1",
    userName: "Sarah Miller",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    content: "I've read many productivity books, but Atomic Habits provides the most practical framework for actually implementing changes in your life.",
    date: "2023-12-03",
    likes: 18
  },
  {
    id: "comment-3",
    bookId: "book-2",
    userName: "Michael Brown",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    content: "Despite being written decades ago, the principles in this book are still incredibly relevant today. Essential reading for anyone looking to improve their social skills.",
    date: "2023-11-20",
    likes: 32
  },
  {
    id: "comment-4",
    bookId: "book-4",
    userName: "Emily Wilson",
    userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    content: "The stoic philosophy explained in this book has been a guiding principle for me during difficult times. Highly recommend!",
    date: "2023-11-18",
    likes: 15
  },
  {
    id: "comment-5",
    bookId: "book-5",
    userName: "David Chen",
    userAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=2034&auto=format&fit=crop",
    content: "Harari's perspective on human history is fascinating and thought-provoking. This book made me question many assumptions I had about our species.",
    date: "2023-10-30",
    likes: 41
  }
];
