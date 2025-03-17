
import { useState } from 'react';
import { Book, BookComment, comments as allComments, SummarySection } from '@/lib/data';
import { Heart, Bookmark, Share, MessageCircle, Star, User, Clock, Send, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookDetailProps {
  book: Book;
}

const BookDetail = ({ book }: BookDetailProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [bookComments, setBookComments] = useState<BookComment[]>(
    allComments.filter(comment => comment.bookId === book.id)
  );

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment: BookComment = {
      id: `comment-${Date.now()}`,
      bookId: book.id,
      userName: "You",
      content: newComment,
      date: new Date().toISOString(),
      likes: 0
    };
    
    setBookComments([comment, ...bookComments]);
    setNewComment('');
  };

  // Render the rich summary sections if available
  const renderRichSummary = () => {
    if (!book.richSummary) {
      return <p className="leading-relaxed text-foreground mb-4">{book.summary}</p>;
    }

    return book.richSummary.map((section, index) => {
      if (section.type === 'text') {
        return (
          <p key={index} className="leading-relaxed text-foreground mb-6">
            {section.content}
          </p>
        );
      } else if (section.type === 'image') {
        return (
          <figure key={index} className="mb-8">
            <div className="aspect-video rounded-xl overflow-hidden mb-2">
              <img 
                src={section.content} 
                alt={section.caption || `Image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
            {section.caption && (
              <figcaption className="text-sm text-center text-muted-foreground italic">
                {section.caption}
              </figcaption>
            )}
          </figure>
        );
      }
      return null;
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Book Cover Column */}
        <div className="md:col-span-1 self-start sticky top-24">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-elegant-hover">
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "flex-1 py-2 rounded-l-lg border flex items-center justify-center transition-colors",
                isLiked 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "border-border text-muted-foreground hover:text-primary hover:border-primary/20"
              )}
            >
              <Heart className="h-4 w-4 mr-2" fill={isLiked ? "currentColor" : "none"} />
              <span>Like</span>
            </button>
            
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "flex-1 py-2 border-t border-b flex items-center justify-center transition-colors",
                isBookmarked 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "border-border text-muted-foreground hover:text-primary hover:border-primary/20"
              )}
            >
              <Bookmark className="h-4 w-4 mr-2" fill={isBookmarked ? "currentColor" : "none"} />
              <span>Save</span>
            </button>
            
            <button 
              className="flex-1 py-2 rounded-r-lg border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 transition-colors"
            >
              <Share className="h-4 w-4 mr-2" />
              <span>Share</span>
            </button>
          </div>
        </div>
        
        {/* Book Info Column */}
        <div className="md:col-span-2">
          {/* Book Header */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {book.genre.map((genre) => (
                <span key={genre} className="chip">
                  {genre}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            
            <div className="flex items-center mb-4">
              <p className="text-lg text-muted-foreground">by {book.author.name}</p>
              <div className="ml-4 flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">{book.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
              {book.pageCount && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">{book.pageCount}</span> pages
                </div>
              )}
              {book.yearPublished && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">{book.yearPublished}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
          
          {/* Book Summary */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-5 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-primary" />
              Summary
            </h2>
            <div className="prose prose-gray max-w-none">
              {renderRichSummary()}
            </div>
          </div>
          
          {/* Book Comments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Comments</h2>
              <div className="flex items-center text-muted-foreground">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{bookComments.length}</span>
              </div>
            </div>
            
            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mr-3 flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary disabled:text-muted-foreground"
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
            
            {/* Comments List */}
            <div className="space-y-4">
              {bookComments.map((comment) => (
                <div key={comment.id} className="flex">
                  <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden mr-3 flex-shrink-0">
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">{comment.userName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                    <div className="flex items-center mt-1 ml-2 text-xs text-muted-foreground">
                      <button className="hover:text-primary transition-colors">Like</button>
                      <span className="mx-2">•</span>
                      <button className="hover:text-primary transition-colors">Reply</button>
                      {comment.likes > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1 text-red-500 fill-red-500" />
                            <span>{comment.likes}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
