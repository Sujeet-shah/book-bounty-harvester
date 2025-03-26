
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
        // For development purposes, set admin login to true if it doesn't exist
        if (localStorage.getItem('adminLoggedIn') === null) {
          console.log('Setting admin login for development');
          localStorage.setItem('adminLoggedIn', 'true');
          
          // Also create a mock admin user if none exists
          if (localStorage.getItem('currentUser') === null) {
            const mockAdminUser = {
              id: 'admin-1',
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin'
            };
            localStorage.setItem('currentUser', JSON.stringify(mockAdminUser));
          } else {
            // Ensure existing user has admin role
            const userJson = localStorage.getItem('currentUser');
            const user = userJson ? JSON.parse(userJson) : null;
            if (user && user.role !== 'admin') {
              user.role = 'admin';
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
          }
        }
        
        // Check admin login status
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
        
        // Verify admin role
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
