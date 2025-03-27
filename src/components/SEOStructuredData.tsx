
import React from 'react';
import { generateWebsiteStructuredData } from '@/lib/seo';

interface SEOStructuredDataProps {
  type?: 'website' | 'book' | 'faq';
  data?: any;
}

const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ type = 'website', data }) => {
  // Generate the appropriate structured data based on the type
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return generateWebsiteStructuredData("https://book-bounty-harvester.lovable.app");
      case 'book':
        return JSON.stringify(data);
      case 'faq':
        return JSON.stringify(data);
      default:
        return generateWebsiteStructuredData("https://book-bounty-harvester.lovable.app");
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: getStructuredData() }}
    />
  );
};

export default SEOStructuredData;
