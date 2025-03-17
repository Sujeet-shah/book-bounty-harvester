
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserGuardProps {
  children: React.ReactNode;
}

const UserGuard = ({ children }: UserGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isUserLoggedIn) {
      toast({
        title: 'Login required',
        description: 'Please login to access this feature',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [navigate, toast]);
  
  return <>{children}</>;
};

export default UserGuard;
