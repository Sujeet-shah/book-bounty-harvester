
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';

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
        const isUserLoggedIn = authService.isAuthenticated();
        
        if (!isUserLoggedIn) {
          toast({
            title: 'Login required',
            description: 'Please login to access this feature',
            variant: 'destructive',
          });
          // Save the current location for redirect after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          navigate('/login');
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast({
          title: 'Authentication error',
          description: 'Please try logging in again',
          variant: 'destructive',
        });
        navigate('/login');
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
