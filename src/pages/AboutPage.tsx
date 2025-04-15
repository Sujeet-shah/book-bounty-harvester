import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet-async';
import { generatePageMetaTags, generateWebsiteStructuredData, generateFAQStructuredData } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Mail, Globe } from 'lucide-react';

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

  const faqs = [
    {
      question: "What is BookSummary App?",
      answer: "BookSummary App is a platform that provides concise summaries and key insights from popular books across various genres, helping readers grasp the core concepts without reading the entire book."
    },
    {
      question: "Are all summaries free to access?",
      answer: "Yes, all book summaries on our platform are completely free to access. We believe knowledge should be accessible to everyone."
    },
    {
      question: "How do you select books to summarize?",
      answer: "We select books based on popularity, critical acclaim, and educational value. We cover classics from Project Gutenberg as well as modern bestsellers across fiction and non-fiction genres."
    },
    {
      question: "Can I suggest a book to be summarized?",
      answer: "Absolutely! We welcome suggestions from our community. You can contact us with your book recommendation, and our team will consider it for future summaries."
    },
    {
      question: "Do you offer mobile apps?",
      answer: "Currently, we offer a responsive web application that works well on all devices. Native mobile apps are in our development roadmap for the future."
    }
  ];

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
        <script type="application/ld+json">
          {generateFAQStructuredData(faqs)}
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
              <li>Access to classic literature from Project Gutenberg</li>
              <li>Modern bestsellers and trending books</li>
              <li>Curated collections based on topics and themes</li>
              <li>Regular additions of new book summaries</li>
            </ul>
          </section>

          <section className="glass-panel p-6 mb-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              BookSummary App was founded in 2023 by a group of avid readers and educators who recognized the challenge 
              of keeping up with the vast amount of valuable literature available today.
            </p>
            <p className="text-muted-foreground mb-4">
              We started with a simple idea: to create a platform that would help people access the core ideas of important 
              books without having to read them cover to cover. This would allow more people to benefit from the wisdom 
              contained in these works, even with limited time.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to offer summaries of hundreds of books, with new additions every week. Our community 
              continues to grow as more readers discover the value of concise, well-crafted book summaries.
            </p>
          </section>
          
          <section className="glass-panel p-6 mb-8 rounded-lg" id="faq">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="glass-panel p-6 mb-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Our Team</h2>
            <p className="text-muted-foreground mb-6">
              BookSummary App is powered by a dedicated team of writers, editors, and developers who are passionate 
              about literature and education.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-4 rounded">
                <h3 className="font-medium mb-1">Content Team</h3>
                <p className="text-sm text-muted-foreground">
                  Our content team consists of professional writers and literature enthusiasts who carefully read and 
                  analyze each book before creating a comprehensive summary.
                </p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded">
                <h3 className="font-medium mb-1">Technical Team</h3>
                <p className="text-sm text-muted-foreground">
                  Our developers work tirelessly to ensure the platform is fast, accessible, and easy to use across 
                  all devices.
                </p>
              </div>
            </div>
          </section>
          
          <section className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-muted/30 p-4 rounded flex items-start">
                <Mail className="h-5 w-5 mt-0.5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-primary">contact@booksummary.app</p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded flex items-start">
                <Globe className="h-5 w-5 mt-0.5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Visit Our Blog</p>
                  <a href="#" className="text-primary hover:underline">blog.booksummary.app</a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-6">
              <p className="font-medium mb-3">Follow us:</p>
              <div className="flex space-x-4 items-center">
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-[#1877F2] transition-colors group"
                  aria-label="Facebook"
                >
                  <Facebook 
                    className="h-5 w-5 group-hover:scale-110 transition-transform" 
                    strokeWidth={1.5} 
                  />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-[#1DA1F2] transition-colors group"
                  aria-label="Twitter"
                >
                  <Twitter 
                    className="h-5 w-5 group-hover:scale-110 transition-transform" 
                    strokeWidth={1.5} 
                  />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-[#E1306C] transition-colors group"
                  aria-label="Instagram"
                >
                  <Instagram 
                    className="h-5 w-5 group-hover:scale-110 transition-transform" 
                    strokeWidth={1.5} 
                  />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-[#0A66C2] transition-colors group"
                  aria-label="LinkedIn"
                >
                  <Linkedin 
                    className="h-5 w-5 group-hover:scale-110 transition-transform" 
                    strokeWidth={1.5} 
                  />
                </a>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <Link 
                  to="/register" 
                  className="flex items-center text-primary hover:underline"
                >
                  Create an account
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                
                <Link
                  to="/"
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <BookOpen className="mr-1 h-4 w-4" />
                  Explore Books
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
