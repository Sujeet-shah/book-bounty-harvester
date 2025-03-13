
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ease-in-out',
        isScrolled ? 'py-3 bg-white/90 backdrop-blur shadow-sm' : 'py-5 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-foreground font-medium"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg">BookBounty</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/trending">Trending</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="btn-icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <Link to="/admin" className="btn-icon" aria-label="Admin">
            <User className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden btn-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg animate-slide-down border-t border-border">
          <nav className="flex flex-col p-4">
            <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</MobileNavLink>
            <MobileNavLink to="/trending" onClick={() => setIsMobileMenuOpen(false)}>Trending</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileNavLink>
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
              <Link 
                to="/search" 
                className="flex-1 py-2 px-4 rounded-full bg-secondary text-secondary-foreground text-center flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
              <Link 
                to="/admin" 
                className="flex-1 py-2 px-4 rounded-full bg-primary text-primary-foreground text-center flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

// Desktop Nav Link component
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
  >
    {children}
  </Link>
);

// Mobile Nav Link component
const MobileNavLink = ({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="py-3 text-foreground border-b border-border last:border-0"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
