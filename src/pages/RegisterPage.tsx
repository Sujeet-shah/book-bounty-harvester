
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, LockKeyhole, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet-async';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // In a real app, you would send this data to your backend
      // For now, we'll just store it in localStorage
      
      // Check if email already exists (in a real app, this would be done by the backend)
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const existingUser = users.find((user: any) => user.email === values.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      // Add the new user
      const newUser = {
        id: `user-${Date.now()}`,
        name: values.name,
        email: values.email,
        password: values.password, // In a real app, NEVER store passwords in plain text
        role: 'user',
        dateRegistered: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set user as logged in
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }));
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password validation helpers
  const password = form.watch('password');
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sign Up | Book Summary App</title>
        <meta name="description" content="Create an account to save favorite books, leave comments, and access exclusive content." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-md mx-auto glass-panel p-8 shadow-elegant animate-fade-in">
          <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="John Doe" 
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="you@example.com" 
                          className="pl-10"
                          type="email"
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
                    
                    <div className="mt-2 space-y-1">
                      <PasswordRequirement met={hasMinLength}>At least 8 characters</PasswordRequirement>
                      <PasswordRequirement met={hasUppercase}>One uppercase letter</PasswordRequirement>
                      <PasswordRequirement met={hasLowercase}>One lowercase letter</PasswordRequirement>
                      <PasswordRequirement met={hasNumber}>One number</PasswordRequirement>
                    </div>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

interface PasswordRequirementProps {
  met: boolean;
  children: React.ReactNode;
}

const PasswordRequirement = ({ met, children }: PasswordRequirementProps) => (
  <div className="flex items-center gap-2 text-xs">
    <CheckCircle className={`h-3 w-3 ${met ? 'text-green-500' : 'text-muted-foreground'}`} />
    <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
      {children}
    </span>
  </div>
);

export default RegisterPage;
