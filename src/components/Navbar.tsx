
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogIn, Clock, BookOpen, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { authService } from '@/services/auth.service';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
    // Check login status and admin status
    const checkAuth = () => {
      setIsLoggedIn(authService.isAuthenticated());
      setIsAdmin(authService.isAdmin());
    };
    
    checkAuth();
    
    // Listen for storage events (like logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]); // Re-check on route changes
  
  const navLinks = [
    { label: 'Home', path: '/', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { label: 'Trending', path: '/trending', icon: <Clock className="h-4 w-4 mr-2" /> },
    { label: 'Categories', path: '/categories', icon: <Search className="h-4 w-4 mr-2" /> },
    { label: 'Generate Summary', path: '/generate-summary', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { label: 'About', path: '/about', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  ];
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    authService.logout().then(() => {
      setIsLoggedIn(false);
      setIsAdmin(false);
      navigate('/login');
    });
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-colors",
      isScrolled ? "bg-background/90 backdrop-blur-sm shadow-subtle" : "bg-transparent",
    )}>
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-3 py-3 flex items-center justify-between">
        <Logo variant={isMobile ? 'compact' : 'default'} />
        
        {isMobile ? (
          <button onClick={toggleMenu} className="text-gray-500">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        ) : (
          <nav className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        )}
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="px-2">
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
                <Button variant="ghost" size="sm" className="px-2">
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
          <div className="flex justify-between items-center mb-6">
            <Logo />
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
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center text-lg text-primary hover:text-primary/80 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            <div className="py-2">
              <ThemeToggle />
            </div>
            
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
