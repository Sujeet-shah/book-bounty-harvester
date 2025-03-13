
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdminPanel from '@/components/AdminPanel';
import { ArrowLeft } from 'lucide-react';

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
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
