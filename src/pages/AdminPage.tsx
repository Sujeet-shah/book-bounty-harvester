
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdminPanel from '@/components/AdminPanel';
import AdminHeader from '@/components/AdminHeader';
import BlogManager from '@/components/BlogManager';
import { ArrowLeft, BookOpen, FileText, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SEOStructuredData from '@/components/SEOStructuredData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<string>("books");
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard | Book Summary App</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Admin dashboard for managing book summaries and user content." />
      </Helmet>
      
      <SEOStructuredData type="website" />
      
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Back navigation */}
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
          
          {/* Admin Header */}
          <AdminHeader />
          
          {/* SEO Information */}
          <div className="mb-6 p-4 border rounded-lg bg-background/80">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium">SEO Tools</h2>
            </div>
            <p className="text-muted-foreground mb-2">
              SEO data is automatically generated for each book and blog post based on the information you provide. This includes:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li className="flex items-center"><Tag className="h-3.5 w-3.5 mr-2 text-primary" /> Meta title and description</li>
              <li className="flex items-center"><Tag className="h-3.5 w-3.5 mr-2 text-primary" /> OpenGraph tags for social media</li>
              <li className="flex items-center"><Tag className="h-3.5 w-3.5 mr-2 text-primary" /> JSON-LD structured data</li>
              <li className="flex items-center"><Tag className="h-3.5 w-3.5 mr-2 text-primary" /> SEO-friendly URLs with slugs</li>
            </ul>
          </div>
          
          {/* Tabs for different admin sections */}
          <Tabs defaultValue="books" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="books" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Books
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Blog
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="books">
              <AdminPanel />
            </TabsContent>
            
            <TabsContent value="blog">
              <BlogManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
