
import { Book, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'compact';
  animateSparkle?: boolean;
}

const Logo = ({ className, variant = 'default', animateSparkle = true }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center font-semibold text-xl group",
        className
      )}
      aria-label="BookSummary - Home"
    >
      <div className="relative mr-2 flex items-center justify-center">
        <Book className="h-6 w-6 text-primary z-10" />
        <Sparkles 
          className={cn(
            "h-4 w-4 text-primary/80 absolute -top-1 -right-1 transform",
            animateSparkle && "transition-all duration-700 group-hover:scale-125 group-hover:rotate-12"
          )} 
        />
      </div>
      {variant === 'default' && (
        <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
          BookSummary
        </span>
      )}
    </Link>
  );
};

export default Logo;
