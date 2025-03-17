
import React from 'react';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Clock, Award, Users, ThumbsUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About BookBounty | Book Summary App</title>
        <meta name="description" content="Learn about BookBounty - your source for concise, insightful book summaries across various genres." />
        <meta name="keywords" content="book summaries, about us, reading platform, book insights" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">About BookBounty</h1>
          <p className="text-xl text-muted-foreground mb-12">Your source for insightful book summaries</p>
          
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <div className="glass-panel p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="rounded-full bg-primary/10 p-8 inline-flex">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-lg mb-4">
                    At BookBounty, we believe that knowledge should be accessible to everyone. Our mission is to provide concise, thoughtful summaries of valuable books across genres, allowing you to absorb key insights without the time investment of reading the entire book.
                  </p>
                  <p>
                    Whether you're a busy professional, a student, or just someone who wants to expand their knowledge efficiently, our summaries help you discover and understand important concepts from the world's best books.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Why Choose BookBounty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="book-card p-6">
                <Clock className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Save Time</h3>
                <p className="text-muted-foreground">Get the core ideas and insights without spending hours reading the entire book.</p>
              </div>
              
              <div className="book-card p-6">
                <Award className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Quality Content</h3>
                <p className="text-muted-foreground">Our summaries are carefully crafted to capture the essence of each book.</p>
              </div>
              
              <div className="book-card p-6">
                <Users className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Community</h3>
                <p className="text-muted-foreground">Join discussions and share your thoughts with other readers.</p>
              </div>
              
              <div className="book-card p-6">
                <ThumbsUp className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Diverse Selection</h3>
                <p className="text-muted-foreground">Explore summaries across many genres, from self-help to history and business.</p>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="book-card p-6">
                <h3 className="text-lg font-medium mb-2">Are these summaries a replacement for reading the book?</h3>
                <p className="text-muted-foreground">
                  Our summaries are designed to give you the key insights and main points, but they don't replace the full experience of reading the book. Think of them as a complement or a way to decide which books you want to read in full.
                </p>
              </div>
              
              <div className="book-card p-6">
                <h3 className="text-lg font-medium mb-2">How do you create the summaries?</h3>
                <p className="text-muted-foreground">
                  Each summary is carefully created by our team of readers and writers who thoroughly analyze the book and extract the most important concepts, lessons, and insights.
                </p>
              </div>
              
              <div className="book-card p-6">
                <h3 className="text-lg font-medium mb-2">How often do you add new summaries?</h3>
                <p className="text-muted-foreground">
                  We add new summaries regularly, focusing on both new releases and timeless classics. Follow us on social media or subscribe to our newsletter to stay updated.
                </p>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section>
            <div className="glass-panel p-8 text-center rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4">Ready to Start Reading?</h2>
              <p className="text-lg mb-6">Discover insights from the world's best books</p>
              <Link to="/" className="btn-primary inline-flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Explore Summaries
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
