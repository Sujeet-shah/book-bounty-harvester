
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Page Not Found | Book Summary App</title>
        <meta name="description" content="The page you are looking for does not exist. Return to our book summary homepage to discover popular and classic book summaries." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://book-bounty-harvester.lovable.app" />
        <meta property="og:title" content="Page Not Found | Book Summary App" />
        <meta property="og:description" content="The page you are looking for does not exist. Return to our book summary homepage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://book-bounty-harvester.lovable.app/404" />
      </Helmet>
      
      <Navbar />
      
      <div className="pt-28 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <BookOpen className="h-20 w-20 text-primary/30 mb-6" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
