
import React from 'react';
import { BlogPost } from '@/lib/blog';
import { Clock, Calendar, User, Tag as TagIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import ReactMarkdown from 'react-markdown';

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
    <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert mx-auto">
      {post.coverImage && (
        <div className="not-prose mb-8 -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden aspect-video">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <header className="not-prose mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{post.authorName}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary">
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </header>
      
      <ReactMarkdown>
        {post.content}
      </ReactMarkdown>
    </article>
  );
};

export default BlogPostContent;
