
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';
import { generateWebsiteStructuredData } from '@/lib/seo';
import { useEffect } from 'react';

import './App.css';

// Pages
import Index from './pages/Index';
import BookPage from './pages/BookPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import TrendingPage from './pages/TrendingPage';
import CategoriesPage from './pages/CategoriesPage';
import ModernBooksPage from './pages/ModernBooksPage';
import SummaryGeneratorPage from './pages/SummaryGeneratorPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

// Guards
import UserGuard from './components/UserGuard';
import AdminGuard from './components/AdminGuard';

// Analytics tracking component
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views - normally this would be where you put your analytics code
    const page_path = location.pathname + location.search;
    console.log(`Page view: ${page_path}`);
    
    // If you have a real analytics solution, you would call it here
    // e.g., gtag('config', 'GA_MEASUREMENT_ID', { page_path });
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          {/* Global SEO elements */}
          <Helmet>
            <script type="application/ld+json">
              {generateWebsiteStructuredData("https://book-bounty-harvester.lovable.app")}
            </script>
            <link rel="manifest" href="/manifest.json" />
          </Helmet>
          
          {/* Analytics tracker */}
          <RouteChangeTracker />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/modern-books" element={<ModernBooksPage />} />
            <Route path="/generate-summary" element={<SummaryGeneratorPage />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<UserGuard><ProfilePage /></UserGuard>} />
            
            {/* Admin Route - Strictly protected */}
            <Route 
              path="/admin" 
              element={
                <AdminGuard>
                  <AdminPage />
                </AdminGuard>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <SonnerToaster position="top-right" />
          <Toaster />
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
