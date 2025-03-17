
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  
  // Load user data
  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const handleLogout = () => {
    // Clear both user and admin login state
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
    
    setCurrentUser(null);
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    
    // Redirect to home if on a protected page
    if (location.pathname.includes('/admin') || location.pathname.includes('/profile')) {
      navigate('/');
    }
  };
  
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="fixed w-full z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="font-bold text-xl" onClick={closeMenu}>
              📚 BookSummary
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 mr-2"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100"
              aria-label="Open menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-10">
            <NavLink to="/categories" currentPath={location.pathname}>
              Categories
            </NavLink>
            <NavLink to="/trending" currentPath={location.pathname}>
              Trending
            </NavLink>
            <NavLink to="/about" currentPath={location.pathname}>
              About
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" currentPath={location.pathname}>
                Admin
              </NavLink>
            )}
          </nav>
          
          {/* Desktop right section */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            <SearchBar />
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      {showSearch && isMobile && (
        <div className="px-4 pb-4">
          <SearchBar />
        </div>
      )}
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" onClick={closeMenu} currentPath={location.pathname}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/categories" onClick={closeMenu} currentPath={location.pathname}>
              Categories
            </MobileNavLink>
            <MobileNavLink to="/trending" onClick={closeMenu} currentPath={location.pathname}>
              Trending
            </MobileNavLink>
            <MobileNavLink to="/about" onClick={closeMenu} currentPath={location.pathname}>
              About
            </MobileNavLink>
            {isAdmin && (
              <MobileNavLink to="/admin" onClick={closeMenu} currentPath={location.pathname}>
                Admin
              </MobileNavLink>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {currentUser ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">{currentUser.name}</div>
                    <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <MobileNavLink to="/profile" onClick={closeMenu} currentPath={location.pathname}>
                    Your Profile
                  </MobileNavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base text-destructive hover:bg-destructive/10"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 px-2 space-y-1">
                <MobileNavLink to="/login" onClick={closeMenu} currentPath={location.pathname}>
                  Sign in
                </MobileNavLink>
                <MobileNavLink to="/register" onClick={closeMenu} currentPath={location.pathname}>
                  Sign up
                </MobileNavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Desktop navigation link
interface NavLinkProps {
  to: string;
  currentPath: string;
  children: React.ReactNode;
}

const NavLink = ({ to, currentPath, children }: NavLinkProps) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  return (
    <Link
      to={to}
      className={`text-base font-medium transition-colors ${
        isActive ? 'text-primary' : 'text-foreground hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
};

// Mobile navigation link
interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, currentPath, onClick, children }: MobileNavLinkProps) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-gray-50 hover:text-primary'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
