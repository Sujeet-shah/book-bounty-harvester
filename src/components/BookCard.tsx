
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Star } from 'lucide-react';
import { Book } from '@/lib/data';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  className?: string;
}

const BookCard = ({ book, className }: BookCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  return (
    <div className={cn("book-card group", className)}>
      <div className="relative overflow-hidden rounded-lg mb-3">
        <Link to={`/book/${book.id}`}>
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="book-card-image"
            loading="lazy"
          />
        </Link>
        
        {/* Liked and bookmark buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur transition-all",
              isLiked 
                ? "bg-white/90 text-red-500" 
                : "bg-black/20 text-white hover:bg-white/90 hover:text-foreground"
            )}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          </button>
          
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur transition-all",
              isBookmarked 
                ? "bg-white/90 text-primary" 
                : "bg-black/20 text-white hover:bg-white/90 hover:text-foreground"
            )}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        
        {/* Genre badge */}
        {book.genre && book.genre.length > 0 && (
          <div className="absolute top-3 left-3">
            <span className="chip bg-primary/80 text-white backdrop-blur-sm">
              {book.genre[0]}
            </span>
          </div>
        )}
        
        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
          <span>{book.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-1">
        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
          <Link to={`/book/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{book.author.name}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{book.shortSummary}</p>
      </div>
    </div>
  );
};

export default BookCard;
