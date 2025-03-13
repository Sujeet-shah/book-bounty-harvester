
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isAdminLoggedIn) {
      toast({
        title: 'Access denied',
        description: 'Please login to access the admin area',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [navigate, toast]);
  
  return <>{children}</>;
};

export default AdminGuard;
