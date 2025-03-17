
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = async () => {
      try {
        // In a production app, this would verify the admin role with your backend
        const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        if (!isAdminLoggedIn) {
          toast({
            title: 'Access denied',
            description: 'Administrator privileges required',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }
        
        // In a production app, we would verify the admin role with the backend
        const userJson = localStorage.getItem('currentUser');
        const user = userJson ? JSON.parse(userJson) : null;
        
        if (!user || user.role !== 'admin') {
          toast({
            title: 'Access denied',
            description: 'Administrator privileges required',
            variant: 'destructive',
          });
          navigate('/');
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
  }, [navigate, toast]);
  
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
