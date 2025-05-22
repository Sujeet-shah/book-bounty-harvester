
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Book } from '@/lib/data';
import { cn } from '@/lib/utils';

interface FeaturedBookProps {
  book: Book;
  className?: string;
}

const FeaturedBook = ({ book, className }: FeaturedBookProps) => {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl group min-h-[300px]", className)}>
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover object-center opacity-60 group-hover:scale-105 transition-transform duration-500"
          loading="eager"
          width="800"
          height="1200"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end text-white">
        <div className="flex items-center mb-2">
          <span className="chip bg-primary/70 backdrop-blur text-white">Featured</span>
          <div className="flex items-center ml-3">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm">{book.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">{book.title}</h2>
        <p className="text-sm text-white/80 mb-2">by {book.author.name}</p>
        
        <p className="text-sm text-white/70 mb-4 line-clamp-3">{book.shortSummary}</p>
        
        <Link 
          to={`/book/${book.id}`}
          className="self-start flex items-center text-white group-hover:text-primary transition-colors"
        >
          <span className="mr-2 font-medium">Read Summary</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedBook;
