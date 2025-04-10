
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Predefined book categories
export const PREDEFINED_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 
  'Thriller', 'Romance', 'Historical Fiction', 'Biography', 'Self-Help', 
  'Business', 'Philosophy', 'Science', 'Technology', 'Art', 'Poetry',
  'Drama', 'Horror', 'Adventure', 'Classic', 'Children', 'Young Adult'
];

const CategoryManager = () => {
  const [categories, setCategories] = useState<string[]>(PREDEFINED_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const { toast } = useToast();
  
  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    
    if (categories.includes(newCategory.trim())) {
      toast({
        title: 'Category already exists',
        variant: 'destructive',
      });
      return;
    }
    
    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
    
    toast({
      title: 'Category added',
      description: `"${newCategory.trim()}" has been added to categories`,
    });
  };
  
  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
    
    toast({
      title: 'Category removed',
      description: `"${category}" has been removed from categories`,
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Book Categories</h2>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Add new category..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div 
            key={category}
            className="px-3 py-1.5 rounded-full bg-muted flex items-center gap-1"
          >
            <span>{category}</span>
            <button 
              onClick={() => handleRemoveCategory(category)}
              className="h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
