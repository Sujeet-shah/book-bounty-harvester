
import React from 'react';
import { generateWebsiteStructuredData, generateBookStructuredData, generateFAQStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';

interface SEOStructuredDataProps {
  type?: 'website' | 'book' | 'faq' | 'breadcrumb';
  data?: any;
  url?: string;
  breadcrumbs?: Array<{name: string, url: string}>;
}

const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ 
  type = 'website', 
  data,
  url = "https://book-bounty-harvester.lovable.app",
  breadcrumbs
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
      case 'breadcrumb':
        if (!breadcrumbs) return generateWebsiteStructuredData(url);
        return generateBreadcrumbStructuredData(breadcrumbs, url);
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
