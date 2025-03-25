
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogIn, Book, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn || adminLoggedIn);
  }, []);
  
  const navLinks = [
    { label: 'Home', path: '/', icon: <Book className="h-4 w-4 mr-2" /> },
    { label: 'Modern Books', path: '/modern-books', icon: <Sparkles className="h-4 w-4 mr-2" /> },
    { label: 'Trending', path: '/trending', icon: <Clock className="h-4 w-4 mr-2" /> },
    { label: 'Categories', path: '/categories', icon: <Search className="h-4 w-4 mr-2" /> },
    { label: 'About', path: '/about', icon: <Book className="h-4 w-4 mr-2" /> },
  ];
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    navigate('/login');
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-colors",
      isScrolled ? "bg-background/90 backdrop-blur-sm" : "bg-transparent",
    )}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center font-semibold text-xl">
          BookSummary
        </Link>
        
        {isMobile ? (
          <button onClick={toggleMenu} className="text-gray-500">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        ) : (
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        )}
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {isMobile && (
        <div className={cn(
          "fixed top-0 left-0 h-screen w-3/4 bg-background p-4 z-40 shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex justify-end mb-4">
            <button onClick={toggleMenu} className="text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex items-center text-lg text-muted-foreground hover:text-primary transition-colors">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center text-lg text-muted-foreground hover:text-primary transition-colors">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link to="/register" className="flex items-center text-lg text-muted-foreground hover:text-primary transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
