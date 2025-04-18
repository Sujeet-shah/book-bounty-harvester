import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Edit, FileText, Plus, Trash2, Search, Tag, Image as ImageIcon, Quote, MessageSquareQuote } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Define content section types
interface ContentSection {
  type: 'text' | 'image' | 'quote';
  content: string;
  imageUrl?: string;
  caption?: string;
}

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
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { type: 'text', content: '' }
  ]);
  const [editMode, setEditMode] = useState<'simple' | 'rich'>('simple');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    setContentSections([{ type: 'text', content: '' }]);
    setEditMode('simple');
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
    
    // Initialize content sections from rich content if available
    if (post.richContent && post.richContent.length > 0) {
      setContentSections(post.richContent);
      setEditMode('rich');
    } else {
      setContentSections([{ type: 'text', content: post.content }]);
      setEditMode('simple');
    }
    
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
  
  const handleSectionChange = (index: number, field: keyof ContentSection, value: string) => {
    const updatedSections = [...contentSections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setContentSections(updatedSections);
  };
  
  const handleAddSection = (type: 'text' | 'image' | 'quote') => {
    const newSection: ContentSection = { 
      type, 
      content: type === 'text' ? '' : type === 'quote' ? '' : '',
      imageUrl: type === 'image' ? '' : undefined,
      caption: type === 'image' ? '' : undefined
    };
    
    setContentSections([...contentSections, newSection]);
  };
  
  const handleRemoveSection = (index: number) => {
    if (contentSections.length <= 1) {
      toast.error('You must have at least one content section');
      return;
    }
    
    const updatedSections = contentSections.filter((_, i) => i !== index);
    setContentSections(updatedSections);
  };
  
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contentSections.length - 1)
    ) {
      return;
    }
    
    const updatedSections = [...contentSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSections[index], updatedSections[newIndex]] = 
      [updatedSections[newIndex], updatedSections[index]];
    
    setContentSections(updatedSections);
  };
  
  const handleImageUpload = (index: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-section-index', index.toString());
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const sectionIndexAttr = e.target.getAttribute('data-section-index');
    const sectionIndex = sectionIndexAttr ? parseInt(sectionIndexAttr, 10) : -1;
    
    if (file && sectionIndex >= 0) {
      // For a real app, you would upload to a server/cloud storage
      // Here we use FileReader to create a data URL for demo purposes
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageUrl = ev.target?.result as string;
        handleSectionChange(sectionIndex, 'imageUrl', imageUrl);
        // Clear the file input value so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
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
    
    let content = '';
    
    // Process content based on edit mode
    if (editMode === 'simple') {
      content = formData.content;
      if (!content.trim()) {
        toast.error('Content is required');
        return;
      }
    } else {
      // Validate rich content
      const textContentExists = contentSections.some(section => 
        section.type === 'text' && section.content.trim().length > 0
      );
      
      if (!textContentExists) {
        toast.error('At least one text section with content is required');
        return;
      }
      
      // Generate simple content from rich content for backward compatibility
      content = contentSections
        .filter(section => section.type === 'text')
        .map(section => section.content)
        .join('\n\n');
    }
    
    // Process tags
    const tags = formData.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Calculate reading time
    const readingTime = calculateReadingTime(content);
    
    if (currentPost) {
      // Update existing post
      const updatedPost: BlogPost = {
        ...currentPost,
        title: formData.title,
        slug: createSlug(formData.title),
        excerpt: formData.excerpt,
        content: content,
        authorName: formData.authorName,
        coverImage: formData.coverImage || currentPost.coverImage,
        tags,
        readingTime,
        richContent: editMode === 'rich' ? contentSections : undefined
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
        content: content,
        authorName: formData.authorName,
        coverImage: formData.coverImage,
        tags,
        publishedDate: new Date().toISOString().split('T')[0],
        readingTime,
        isFeatured: false,
        richContent: editMode === 'rich' ? contentSections : undefined
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
      
      {/* File input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
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
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Content Editor</Label>
              <Tabs value={editMode} onValueChange={(value) => setEditMode(value as 'simple' | 'rich')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="simple">Simple Editor</TabsTrigger>
                  <TabsTrigger value="rich">Rich Content Editor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simple" className="space-y-4">
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your blog post content here... Markdown is supported."
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use Markdown for formatting. Headers (#, ##), bold (**text**), italic (*text*), lists (-, 1.), etc.
                  </p>
                </TabsContent>
                
                <TabsContent value="rich" className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddSection('text')}
                    >
                      <FileText className="w-4 h-4 mr-1" /> Add Text
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddSection('image')}
                    >
                      <ImageIcon className="w-4 h-4 mr-1" /> Add Image
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddSection('quote')}
                    >
                      <MessageSquareQuote className="w-4 h-4 mr-1" /> Add Quote
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {contentSections.map((section, index) => (
                      <div key={index} className="border rounded-md p-4 relative">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            {section.type === 'text' && 'Text Content'}
                            {section.type === 'image' && 'Image'}
                            {section.type === 'quote' && 'Quote'}
                          </Badge>
                          
                          <div className="flex gap-1">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleMoveSection(index, 'up')}
                              disabled={index === 0}
                              className="h-7 w-7"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="m18 15-6-6-6 6"/>
                              </svg>
                            </Button>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleMoveSection(index, 'down')}
                              disabled={index === contentSections.length - 1}
                              className="h-7 w-7"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </Button>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveSection(index)}
                              className="h-7 w-7 text-destructive hover:text-destructive/90"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            </Button>
                          </div>
                        </div>
                        
                        {section.type === 'text' && (
                          <Textarea
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                            placeholder="Enter text content (Markdown supported)..."
                            rows={5}
                          />
                        )}
                        
                        {section.type === 'image' && (
                          <div className="space-y-3">
                            {section.imageUrl ? (
                              <div className="relative">
                                <img 
                                  src={section.imageUrl} 
                                  alt="Uploaded content" 
                                  className="max-h-64 object-contain rounded-md border"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => handleImageUpload(index)}
                                >
                                  Replace Image
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                                onClick={() => handleImageUpload(index)}
                              >
                                <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
                                <p className="mt-2 text-muted-foreground">Click to upload an image</p>
                              </div>
                            )}
                            <Input
                              value={section.caption || ''}
                              onChange={(e) => handleSectionChange(index, 'caption', e.target.value)}
                              placeholder="Image caption (optional)"
                            />
                          </div>
                        )}
                        
                        {section.type === 'quote' && (
                          <Textarea
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                            placeholder="Enter quote text..."
                            rows={3}
                            className="italic"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
