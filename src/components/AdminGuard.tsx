
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
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = async () => {
      try {
        // Check admin login status using auth service
        const isAdmin = authService.isAdmin();
        
        if (!isAdmin) {
          toast({
            title: 'Access denied',
            description: 'Administrator privileges required',
            variant: 'destructive',
          });
          // Save the attempted URL for redirect after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          navigate('/login');
          return;
        }
        
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
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export default AdminGuard;
