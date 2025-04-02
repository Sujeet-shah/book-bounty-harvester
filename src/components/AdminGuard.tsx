
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = async () => {
      try {
        // First check if user is authenticated at all
        const isUserLoggedIn = authService.isAuthenticated();
        
        if (!isUserLoggedIn) {
          toast({
            title: 'Access denied',
            description: 'Please login to access this page',
            variant: 'destructive',
          });
          // Save the attempted URL for redirect after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          navigate('/login');
          return;
        }
        
        // Then check if authenticated user is an admin
        const hasAdminRole = authService.isAdmin();
        
        if (!hasAdminRole) {
          toast({
            title: 'Access denied',
            description: 'Administrator privileges required',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Admin authentication check failed:', error);
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
    
    checkAdminAuth();
  }, [navigate, location.pathname, toast]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin) {
    return null;
  }
  
  return <>{children}</>;
};

export default AdminGuard;
