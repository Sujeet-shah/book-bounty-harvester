
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '@/lib/blog';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogPostCard = ({ post, featured = false }: BlogPostCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/blog/${post.slug}`);
  };
  
  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${
      featured ? 'border-primary/20' : ''
    }`}>
      {post.coverImage && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        {featured && (
          <Badge variant="outline" className="mb-2 border-primary/30 text-primary">
            Featured
          </Badge>
        )}
        <h3 
          className="text-xl font-bold leading-tight cursor-pointer hover:text-primary transition-colors line-clamp-2" 
          onClick={handleClick}
        >
          {post.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          className="p-0 h-auto text-primary hover:text-primary hover:bg-transparent underline-offset-4 hover:underline"
          onClick={handleClick}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
