
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, FileText, Search, Tag as TagIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { BlogPost, loadBlogPosts } from '@/lib/blog';
import BlogPostCard from '@/components/BlogPostCard';
import { generatePageMetaTags } from '@/lib/seo';
import SEOStructuredData from '@/components/SEOStructuredData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    const blogPosts = loadBlogPosts();
    setPosts(blogPosts);
    
    // Extract unique tags from all posts
    const tags = blogPosts.flatMap(post => post.tags);
    const uniqueTags = Array.from(new Set(tags));
    setAllTags(uniqueTags);
  }, []);
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });
  
  const featuredPosts = filteredPosts.filter(post => post.isFeatured);
  const regularPosts = filteredPosts.filter(post => !post.isFeatured);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };
  
  const seoData = generatePageMetaTags(
    "Blog", 
    "Explore our collection of articles about book summaries, reading strategies, and knowledge optimization.",
    ["book summaries", "reading", "blog", "articles", "knowledge"]
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:url" content={`https://book-bounty-harvester.lovable.app${seoData.openGraph.url}`} />
        <link rel="canonical" href={`https://book-bounty-harvester.lovable.app${seoData.openGraph.url}`} />
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
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              Explore our articles on book summaries, reading strategies, and knowledge optimization.
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All Topics
              </Badge>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">No Articles Found</h2>
              <p className="text-muted-foreground">
                We couldn't find any blog posts matching your search.
              </p>
            </div>
          ) : (
            <>
              {/* Featured posts */}
              {featuredPosts.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredPosts.map(post => (
                      <BlogPostCard key={post.id} post={post} featured />
                    ))}
                  </div>
                </section>
              )}
              
              {/* Regular posts */}
              {regularPosts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {regularPosts.map(post => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
