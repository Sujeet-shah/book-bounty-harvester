import { useState, useEffect } from 'react';
import { Book, Author, books as allBooks, authors as allAuthors } from '@/lib/data';
import { BookComment } from '@/lib/data';
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import BookFormRich from '@/components/BookFormRich';
import { SummaryGeneratorService } from '@/services/summary-generator.service';

const AdminPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [activeTab, setActiveTab] = useState('books');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setBooks(allBooks);
    setAuthors(allAuthors);
    // Load API key from local storage on component mount
    const storedApiKey = localStorage.getItem('summaryGeneratorApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      SummaryGeneratorService.setApiKey(storedApiKey);
    }
  }, []);

  const openBookForm = () => {
    setSelectedBook(null);
    setShowBookForm(true);
  };

  const closeBookForm = () => {
    setShowBookForm(false);
    setSelectedBook(null);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setShowBookForm(true);
  };

  const handleDeleteBook = (book: Book) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${book.title}"?`);
    if (confirmDelete) {
      const updatedBooks = books.filter((b) => b.id !== book.id);
      setBooks(updatedBooks);
    }
  };

  const handleSaveBook = (book: Book) => {
    const isNewBook = !book.id;
    
    if (isNewBook) {
      // Generate a unique ID for the new book
      book.id = `book-${Date.now()}`;
      setBooks([...books, book]);
    } else {
      // Update existing book
      const updatedBooks = books.map((b) => (b.id === book.id ? book : b));
      setBooks(updatedBooks);
    }
    
    closeBookForm();
    
    toast({
      title: isNewBook ? "Book added" : "Book updated",
      description: isNewBook ? "Book has been successfully added." : "Book has been successfully updated.",
    })
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    // Also set the API key in the SummaryGeneratorService
    SummaryGeneratorService.setApiKey(newApiKey);
    // Store the API key in local storage
    localStorage.setItem('summaryGeneratorApiKey', newApiKey);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="summaries">Summaries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="books" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Books</h2>
            <Button onClick={openBookForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </div>

          <Table>
            <TableCaption>A list of your books.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author.name}</TableCell>
                  <TableCell>{book.genre.join(', ')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditBook(book)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteBook(book)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showBookForm && (
            <div className="mt-6">
              <BookFormRich
                book={selectedBook}
                onCancel={closeBookForm}
                onSave={handleSaveBook}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="authors" className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">Authors</h2>
          <Table>
            <TableCaption>A list of your authors.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  <TableCell>{author.bio}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="summaries" className="mt-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Summary Generation</h2>
            <p>Enter your API key to enable automatic summary generation for books.</p>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                type="text" 
                id="api-key" 
                value={apiKey} 
                onChange={handleApiKeyChange} 
                className="mt-2" 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
