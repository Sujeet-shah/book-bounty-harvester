
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Edit, FileText, Plus, Trash2, Search, Tag } from 'lucide-react';
import { BlogPost, loadBlogPosts, saveBlogPosts, createSlug } from '@/lib/blog';
import { calculateReadingTime } from '@/lib/seo';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const BlogManager = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    authorName: 'BookSummary Team',
    coverImage: '',
    tags: ''
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const posts = loadBlogPosts();
    setBlogPosts(posts);
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleNewPost = () => {
    setCurrentPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      authorName: 'BookSummary Team',
      coverImage: '',
      tags: ''
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      authorName: post.authorName,
      coverImage: post.coverImage || '',
      tags: post.tags.join(', ')
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (post: BlogPost) => {
    setCurrentPost(post);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (currentPost) {
      const updatedPosts = blogPosts.filter(post => post.id !== currentPost.id);
      setBlogPosts(updatedPosts);
      saveBlogPosts(updatedPosts);
      setIsDeleteDialogOpen(false);
      toast.success('Blog post deleted successfully');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSavePost = () => {
    // Validate form data
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    // Process tags
    const tags = formData.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Calculate reading time
    const readingTime = calculateReadingTime(formData.content);
    
    if (currentPost) {
      // Update existing post
      const updatedPost: BlogPost = {
        ...currentPost,
        title: formData.title,
        slug: createSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        authorName: formData.authorName,
        coverImage: formData.coverImage || currentPost.coverImage,
        tags,
        readingTime
      };
      
      const updatedPosts = blogPosts.map(post => 
        post.id === currentPost.id ? updatedPost : post
      );
      
      setBlogPosts(updatedPosts);
      saveBlogPosts(updatedPosts);
      toast.success('Blog post updated successfully');
    } else {
      // Create new post
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        title: formData.title,
        slug: createSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        authorName: formData.authorName,
        coverImage: formData.coverImage,
        tags,
        publishedDate: new Date().toISOString().split('T')[0],
        readingTime,
        isFeatured: false
      };
      
      const updatedPosts = [newPost, ...blogPosts];
      setBlogPosts(updatedPosts);
      saveBlogPosts(updatedPosts);
      toast.success('Blog post created successfully');
    }
    
    setIsEditDialogOpen(false);
  };
  
  const toggleFeatured = (post: BlogPost) => {
    const updatedPost = { ...post, isFeatured: !post.isFeatured };
    const updatedPosts = blogPosts.map(p => 
      p.id === post.id ? updatedPost : p
    );
    
    setBlogPosts(updatedPosts);
    saveBlogPosts(updatedPosts);
    toast.success(`Post ${updatedPost.isFeatured ? 'featured' : 'unfeatured'} successfully`);
  };
  
  const handlePreview = (post: BlogPost) => {
    navigate(`/blog/${post.slug}`);
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Blog Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage SEO-optimized blog posts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <Button onClick={handleNewPost} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>
      
      {blogPosts.length === 0 ? (
        <Alert className="bg-muted/50">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            No blog posts found. Create your first post to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.authorName}</TableCell>
                  <TableCell>{new Date(post.publishedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={post.isFeatured ? "default" : "outline"} 
                      className="cursor-pointer"
                      onClick={() => toggleFeatured(post)}
                    >
                      {post.isFeatured ? "Featured" : "Regular"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handlePreview(post)}
                        title="Preview"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditPost(post)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClick(post)}
                        title="Delete"
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
            <DialogDescription>
              {currentPost ? 'Update the details of your blog post' : 'Fill in the details to create a new blog post'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Write a brief description (appears in previews)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown Supported)</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog post content here..."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use Markdown for formatting. Headers (#, ##), bold (**text**), italic (*text*), lists (-, 1.), etc.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Entrepreneurship, Business, Book Summaries"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePost}>
              {currentPost ? 'Update Post' : 'Create Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentPost && (
            <div className="py-4">
              <h3 className="font-medium">{currentPost.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{currentPost.excerpt}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
