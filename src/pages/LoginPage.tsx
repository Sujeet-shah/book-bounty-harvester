
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth.service';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet-async';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get redirect location from state or session storage
  const redirectTo = location.state?.redirectTo || 
                     sessionStorage.getItem('redirectAfterLogin') || 
                     '/';
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const user = await authService.login({
        email: values.email,
        password: values.password,
      });
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
      
      // Clear the redirect URL from session storage
      sessionStorage.removeItem('redirectAfterLogin');
      
      // Redirect based on user role
      if (user.role === 'admin' && redirectTo === '/admin') {
        navigate('/admin');
      } else if (redirectTo !== '/login' && redirectTo !== '/register') {
        navigate(redirectTo);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please check your credentials and try again',
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
        <meta name="description" content="Log in to access your saved books, summaries, and personalized recommendations." />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
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
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
              <p className="mt-2 text-muted-foreground">
                Admin demo: admin@example.com / admin123
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
