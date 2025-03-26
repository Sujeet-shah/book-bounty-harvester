
import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet-async';
import { generatePageMetaTags, generateWebsiteStructuredData } from '@/lib/seo';

const AboutPage = () => {
  const metaTags = generatePageMetaTags(
    'About Us | Book Summary App', 
    'Learn more about the BookSummary App, our mission, and how we help readers discover the key insights from popular books and classics from Project Gutenberg.',
    [
      'about us', 
      'book summaries', 
      'reading', 
      'book insights', 
      'literature',
      'project gutenberg',
      'book reviews',
      'reading assistance',
      'free book summaries',
      'classic literature'
    ]
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={metaTags.openGraph.title} />
        <meta property="og:description" content={metaTags.openGraph.description} />
        <meta property="og:type" content={metaTags.openGraph.type} />
        <meta property="og:url" content={metaTags.openGraph.url} />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.openGraph.title} />
        <meta name="twitter:description" content={metaTags.openGraph.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://book-bounty-harvester.lovable.app/about" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {generateWebsiteStructuredData("https://book-bounty-harvester.lovable.app")}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About BookSummary</h1>
          
          <section className="glass-panel p-6 mb-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At BookSummary, we believe that knowledge should be accessible to everyone. Our mission is to provide concise, 
              high-quality summaries of the world's best books, allowing readers to grasp key concepts and insights quickly.
            </p>
            <p className="text-muted-foreground">
              Whether you're a busy professional, a student, or simply an avid reader looking to expand your knowledge, 
              our summaries offer a way to absorb the most important ideas from a wide range of books efficiently.
            </p>
          </section>
          
          <section className="glass-panel p-6 mb-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Concise summaries of bestselling books across various genres</li>
              <li>Key takeaways and insights from each book</li>
              <li>Audio summaries for on-the-go learning</li>
              <li>Curated collections based on topics and themes</li>
              <li>Regular additions of new book summaries</li>
            </ul>
          </section>
          
          <section className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <div className="bg-muted/30 p-4 rounded">
              <p className="font-medium">Email:</p>
              <p className="text-primary">contact@booksummary.app</p>
              
              <p className="font-medium mt-3">Follow us:</p>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Facebook</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
