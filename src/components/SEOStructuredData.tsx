
import React from 'react';
import { generateWebsiteStructuredData, generateBookStructuredData, generateFAQStructuredData } from '@/lib/seo';

interface SEOStructuredDataProps {
  type?: 'website' | 'book' | 'faq';
  data?: any;
  url?: string;
}

const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ 
  type = 'website', 
  data,
  url = "https://book-bounty-harvester.lovable.app"
}) => {
  // Generate the appropriate structured data based on the type
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return generateWebsiteStructuredData(url);
      case 'book':
        if (!data) return generateWebsiteStructuredData(url);
        return generateBookStructuredData(data, url);
      case 'faq':
        if (!data) return generateWebsiteStructuredData(url);
        return generateFAQStructuredData(data);
      default:
        return generateWebsiteStructuredData(url);
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
