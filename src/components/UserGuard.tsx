
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserGuardProps {
  children: React.ReactNode;
}

const UserGuard = ({ children }: UserGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a production app, this would be a call to your backend API
        // to validate the session token in an HTTP-only cookie
        const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (!isUserLoggedIn) {
          toast({
            title: 'Login required',
            description: 'Please login to access this feature',
            variant: 'destructive',
          });
          // Redirect to login page with the intended destination
          navigate('/login', { state: { redirectTo: location.pathname } });
          return;
        }
        
        // In a production app, we would verify the user session with the backend
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast({
          title: 'Authentication error',
          description: 'Please try logging in again',
          variant: 'destructive',
        });
        navigate('/login', { state: { redirectTo: location.pathname } });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname, toast]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export default UserGuard;
