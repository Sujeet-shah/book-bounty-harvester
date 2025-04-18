
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  coverImage?: string;
  tags: string[];
  publishedDate: string;
  readingTime: number;
  isFeatured: boolean;
}

// Sample blog data
export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Top 10 Book Summaries for Entrepreneurs",
    slug: "top-10-book-summaries-for-entrepreneurs",
    excerpt: "Discover the most impactful book summaries that every entrepreneur should read to save time while gaining valuable insights.",
    content: `
# Top 10 Book Summaries for Entrepreneurs

As an entrepreneur, time is your most valuable asset. Reading book summaries allows you to extract the core ideas from business literature without spending hours on each book.

## 1. "The Lean Startup" by Eric Ries

The Lean Startup introduces the concept of validated learning and the build-measure-learn feedback loop. Key takeaways include:
- Start with a minimum viable product (MVP)
- Test your assumptions with real customers
- Pivot when necessary based on data

## 2. "Zero to One" by Peter Thiel

Peter Thiel argues that the most valuable businesses create something entirely new. Core concepts include:
- Seek to create monopolies through unique technology
- Competition is for losers - aim to be unique
- The future isn't random, but created by visionaries

## 3. "Atomic Habits" by James Clear

This book breaks down how tiny changes can lead to remarkable results:
- Focus on systems, not goals
- The 1% rule: small improvements compound over time
- Make good habits easier and bad habits harder

## 4. "Good to Great" by Jim Collins

Jim Collins studied companies that transformed from good to outstanding performers:
- Level 5 Leadership combines humility with fierce resolve
- First who, then what - get the right people on the bus
- Confront the brutal facts while maintaining faith

## 5. "The 4-Hour Workweek" by Tim Ferriss

Tim Ferriss shares strategies for escaping the 9-5 grind:
- Define your fears instead of your goals
- Eliminate before you optimize
- Outsource and automate where possible

## 6. "Start With Why" by Simon Sinek

Simon Sinek explores how great leaders inspire action:
- People don't buy what you do, they buy why you do it
- The Golden Circle: Why, How, What
- Inspire through purpose-driven leadership

## 7. "Thinking, Fast and Slow" by Daniel Kahneman

Nobel laureate Daniel Kahneman reveals how our minds work:
- System 1 (fast, intuitive) vs. System 2 (slow, deliberate) thinking
- Common cognitive biases that affect decision making
- How to recognize and overcome these biases

## 8. "The E-Myth Revisited" by Michael E. Gerber

Michael Gerber explains why most small businesses fail:
- Work on your business, not just in your business
- Create systems that don't depend on you
- The importance of the Entrepreneur, Manager, and Technician roles

## 9. "Deep Work" by Cal Newport

Cal Newport advocates for focused, distraction-free work:
- Deep work produces more value than shallow work
- Schedule deep work sessions
- Embrace boredom and reduce digital distractions

## 10. "Never Split the Difference" by Chris Voss

Former FBI negotiator Chris Voss shares negotiation techniques:
- Use tactical empathy to build rapport
- Deploy "no"-oriented questions
- Leverage the power of emotional intelligence

## Conclusion

Reading summaries of these books can give you the essential insights you need without consuming weeks of reading time. Apply these principles to your business and watch it grow.
    `,
    authorName: "BookSummary Team",
    coverImage: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Entrepreneurship", "Business", "Book Summaries", "Productivity"],
    publishedDate: "2025-02-15",
    readingTime: 8,
    isFeatured: true
  },
  {
    id: "blog-2",
    title: "Why Reading Summaries Saves Time and Boosts Knowledge",
    slug: "why-reading-summaries-saves-time-and-boosts-knowledge",
    excerpt: "Explore how book summaries can help you absorb more information in less time while still capturing the essential wisdom from great books.",
    content: `
# Why Reading Summaries Saves Time and Boosts Knowledge

In our fast-paced world, finding time to read all the books on your list can feel impossible. Book summaries offer a powerful solution for knowledge-hungry professionals.

## The Time Efficiency Factor

The average person reads at a speed of 200-300 words per minute. A typical business book contains around 50,000-60,000 words, which means it would take 3-5 hours to read completely. A well-crafted summary can deliver the key insights in just 15-30 minutes.

## Retention and Implementation

Studies show that we forget approximately 80% of what we read within two weeks. Summaries typically focus on:

- Core concepts that are easier to remember
- Actionable steps rather than anecdotes
- Visual frameworks that stick in your memory

This concentration of valuable information makes implementation more likely.

## Quality Over Quantity

Reading 10 complete books might seem better than reading 50 summaries, but consider this:

- Most books contain 2-3 truly novel ideas padded with examples
- Authors often stretch concepts that could be explained in a few pages
- Many business books follow similar patterns and reinforce the same principles

Summaries strip away the padding and leave you with the essential wisdom.

## The Breadth Advantage

By reading summaries, you can expose yourself to a wider range of ideas and perspectives:

- Sample various fields rather than diving deep into just one
- Identify which books deserve your full attention
- Connect dots between different domains more easily

## How to Make the Most of Book Summaries

1. **Read actively** - Take notes even on summaries
2. **Implement immediately** - Apply one idea from each summary
3. **Use summaries as filters** - Decide which books to read in full
4. **Review regularly** - Brief summaries make revisiting concepts easier
5. **Share insights** - Teaching others reinforces your learning

## The Limitations of Summaries

While summaries offer tremendous value, they do have limitations:

- Less emotional impact than full narratives
- Fewer examples and stories to reinforce concepts
- May oversimplify nuanced arguments

## Conclusion

Book summaries aren't about cutting corners—they're about optimizing your learning. By strategically using summaries, you can absorb more knowledge in less time while still gaining the wisdom offered by the world's best thinkers.

The most successful people aren't necessarily those who read the most books, but those who extract and apply the most valuable insights.
    `,
    authorName: "BookSummary Team",
    coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Reading", "Productivity", "Learning", "Self-improvement"],
    publishedDate: "2025-03-01",
    readingTime: 6,
    isFeatured: true
  }
];

// Function to load blog posts from localStorage or use defaults
export const loadBlogPosts = (): BlogPost[] => {
  const storedPosts = localStorage.getItem('bookSummaryBlogPosts');
  if (storedPosts) {
    return JSON.parse(storedPosts);
  }
  // Initialize with sample data if nothing stored
  localStorage.setItem('bookSummaryBlogPosts', JSON.stringify(blogPosts));
  return blogPosts;
};

// Function to save blog posts to localStorage
export const saveBlogPosts = (posts: BlogPost[]): void => {
  localStorage.setItem('bookSummaryBlogPosts', JSON.stringify(posts));
};

// Create a URL-friendly slug from a title
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Generate SEO-friendly meta tags for blog posts
export const generateBlogMetaTags = (post: BlogPost) => {
  const title = `${post.title} | BookSummary Blog`;
  const description = post.excerpt;
  
  const keywords = [
    ...post.tags,
    'book summary',
    'book blog',
    'reading insights',
    'book analysis',
    'literature'
  ].join(', ');
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      image: post.coverImage || '/og-image.png',
      url: `/blog/${post.slug}`,
      type: 'article',
      author: post.authorName
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: post.coverImage || '/og-image.png'
    },
    canonical: `https://book-bounty-harvester.lovable.app/blog/${post.slug}`
  };
};

// Generate structured data for blog posts
export const generateBlogStructuredData = (post: BlogPost) => {
  const blogData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || 'https://book-bounty-harvester.lovable.app/og-image.png',
    datePublished: post.publishedDate,
    author: {
      '@type': 'Person',
      name: post.authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'BookSummary App',
      logo: {
        '@type': 'ImageObject',
        url: 'https://book-bounty-harvester.lovable.app/og-image.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://book-bounty-harvester.lovable.app/blog/${post.slug}`
    },
    keywords: post.tags.join(', ')
  };

  return JSON.stringify(blogData);
};
