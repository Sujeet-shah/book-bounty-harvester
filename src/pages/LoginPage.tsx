
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet-async';

// Admin credentials (in a real app, this would be handled by a backend)
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if we have a redirectTo in the location state
  const redirectTo = location.state?.redirectTo || '/';
  
  // Check if user is already logged in
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (isAdminLoggedIn) {
      navigate('/admin');
    } else if (isUserLoggedIn) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Check if admin login
      if (values.email === ADMIN_EMAIL && values.password === ADMIN_PASSWORD) {
        // Set admin logged in state
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          id: 'admin-1',
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin'
        }));
        
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin dashboard',
        });
        
        navigate('/admin');
        return;
      }
      
      // Check if regular user
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const user = users.find((user: any) => 
        user.email === values.email && user.password === values.password
      );
      
      if (user) {
        // Set user logged in state
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        }));
        
        toast({
          title: 'Login successful',
          description: `Welcome back, ${user.name}!`,
        });
        
        navigate(redirectTo);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Login | Book Summary App</title>
        <meta name="description" content="Sign in to your account to access your saved books, comments, and preferences." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-md mx-auto glass-panel p-8 shadow-elegant animate-fade-in">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="you@example.com" 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10"
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
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-sm text-center text-muted-foreground">
            <p>Demo credentials:</p>
            <div className="font-mono bg-muted p-2 rounded mt-1 space-y-1 text-xs">
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>User:</strong> Create an account to test user features</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
