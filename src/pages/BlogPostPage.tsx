
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { BlogPost, loadBlogPosts, generateBlogMetaTags } from '@/lib/blog';
import BlogPostContent from '@/components/BlogPostContent';
import SEOStructuredData from '@/components/SEOStructuredData';
import BlogPostCard from '@/components/BlogPostCard';

const BlogPostPage = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [notFound, setNotFound] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    const blogPosts = loadBlogPosts();
    const foundPost = blogPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Find related posts (same tags)
      const related = blogPosts
        .filter(p => p.id !== foundPost.id && p.tags.some(tag => foundPost.tags.includes(tag)))
        .slice(0, 3);
      
      setRelatedPosts(related);
    } else {
      setNotFound(true);
    }
  }, [slug]);
  
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, we couldn't find the article you're looking for.</p>
        <button 
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Go to Blog
        </button>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const seoData = generateBlogMetaTags(post);
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:url" content={seoData.openGraph.url} />
        {seoData.openGraph.image && <meta property="og:image" content={seoData.openGraph.image} />}
        <meta property="og:author" content={seoData.openGraph.author} />
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        {seoData.twitter.image && <meta name="twitter:image" content={seoData.twitter.image} />}
        <link rel="canonical" href={seoData.canonical} />
      </Helmet>
      
      <SEOStructuredData type="blogPost" data={post} />
      
      <Navbar />
      
      <main className="pt-28 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/blog" className="hover:text-primary">Blog</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="truncate">{post.title}</span>
          </div>
          
          {/* Back Link */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to all articles</span>
          </Link>
          
          {/* Blog Post Content */}
          <BlogPostContent post={post} />
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t pt-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Related Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogPostPage;
