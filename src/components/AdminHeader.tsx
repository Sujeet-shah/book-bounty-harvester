
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get admin user from localStorage
  const userJson = localStorage.getItem('currentUser');
  const currentUser = userJson ? JSON.parse(userJson) : null;
  
  const handleLogout = () => {
    // Remove admin and user session
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUser');
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    
    navigate('/');
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate('/')} size="sm">
          <Home className="h-4 w-4 mr-2" />
          Back to Site
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminHeader;
