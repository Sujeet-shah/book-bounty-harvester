
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, LogOut, BookOpen, Heart, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet-async';
import { authService, User as UserType } from '@/services/auth.service';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email').optional(),
});

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check authentication status
    const loadUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        
        if (!user) {
          navigate('/login', { state: { redirectTo: '/profile' } });
          return;
        }
        
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to load user data:', error);
        navigate('/login');
      } finally {
        setIsPageLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser, form]);
  
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      const updatedUser = await authService.updateProfile({
        name: values.name
      });
      
      setCurrentUser(updatedUser);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await authService.logout();
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    
    navigate('/');
  };
  
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!currentUser) {
    return null; // Loading or redirect will happen via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Your Profile | Book Summary App</title>
        <meta name="description" content="Manage your profile, view your favorite books, and update your account settings." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="col-span-1">
              <div className="glass-panel p-6 text-center shadow-elegant">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="text-xl">{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-semibold mb-1">{currentUser.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{currentUser.email}</p>
                
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-center space-x-6 text-center">
                    <div>
                      <div className="text-2xl font-semibold">0</div>
                      <div className="text-xs text-muted-foreground">Books</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">0</div>
                      <div className="text-xs text-muted-foreground">Comments</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">0</div>
                      <div className="text-xs text-muted-foreground">Favorites</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="col-span-1 md:col-span-2">
              <div className="glass-panel p-6 shadow-elegant mb-8">
                <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-10"
                                disabled
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </Form>
              </div>
              
              <div className="glass-panel p-6 shadow-elegant">
                <h3 className="text-xl font-semibold mb-6">My Activity</h3>
                
                <div className="space-y-8">
                  {/* Empty states for activity */}
                  <div className="text-center py-8 border-b border-border">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h4 className="text-lg font-medium mb-1">No Books</h4>
                    <p className="text-sm text-muted-foreground mb-4">You haven't saved any books yet.</p>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Browse Books
                    </Button>
                  </div>
                  
                  <div className="text-center py-8 border-b border-border">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h4 className="text-lg font-medium mb-1">No Favorites</h4>
                    <p className="text-sm text-muted-foreground mb-4">You haven't favorited any books yet.</p>
                  </div>
                  
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h4 className="text-lg font-medium mb-1">No Comments</h4>
                    <p className="text-sm text-muted-foreground mb-4">You haven't commented on any books yet.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
