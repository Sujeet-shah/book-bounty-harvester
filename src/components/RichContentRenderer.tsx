
import React from 'react';
import { ContentSection } from '@/lib/data';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface RichContentRendererProps {
  sections: ContentSection[];
  className?: string;
}

const RichContentRenderer = ({ sections, className }: RichContentRendererProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'text':
            return (
              <div key={index} className="prose prose-gray max-w-none dark:prose-invert">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            );
            
          case 'image':
            return (
              <figure key={index} className="my-6">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={section.imageUrl} 
                    alt={section.caption || `Image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {section.caption && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );
            
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-primary pl-4 my-6">
                <p className="text-xl font-serif italic text-muted-foreground">
                  "{section.content}"
                </p>
                {section.caption && (
                  <footer className="mt-2 text-sm text-muted-foreground">
                    — {section.caption}
                  </footer>
                )}
              </blockquote>
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
};

export default RichContentRenderer;
