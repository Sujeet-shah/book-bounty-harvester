
import React, { useEffect, useState } from 'react';
import { Moon, Sun, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

type ThemeType = 'light' | 'dark' | 'reading';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeType>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'reading');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch 
          checked={theme === 'dark'}
          onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
        />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <button
        onClick={() => setTheme(theme === 'reading' ? 'light' : 'reading')}
        className={cn(
          "flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
          theme === 'reading' 
            ? "bg-amber-200 text-amber-800" 
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
        aria-label="Toggle reading mode"
      >
        <Book className="h-3 w-3" />
        <span>Reading</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
