
import React from 'react';
import { Book } from '@/lib/data';
import FeaturedBook from './FeaturedBook';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { SlidersHorizontal } from 'lucide-react';

interface FeaturedBooksSliderProps {
  books: Book[];
}

const FeaturedBooksSlider = ({ books }: FeaturedBooksSliderProps) => {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex items-center mb-6">
        <SlidersHorizontal className="h-5 w-5 text-primary mr-2" />
        <h2 className="text-2xl font-bold">Featured Books</h2>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book) => (
            <CarouselItem key={book.id} className="pl-2 md:pl-4 md:basis-2/3 lg:basis-1/2">
              <FeaturedBook book={book} className="h-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end mt-4 gap-2">
          <CarouselPrevious className="relative static left-auto right-auto translate-y-0" />
          <CarouselNext className="relative static left-auto right-auto translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default FeaturedBooksSlider;
