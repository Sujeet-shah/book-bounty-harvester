
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdminPanel from '@/components/AdminPanel';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard | Book Summary App</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
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
          
          {/* Admin Panel */}
          <AdminPanel />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
