
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
  url,
  breadcrumbs
}) => {
  // Get the current URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' 
    ? window.location.href 
    : "https://book-bounty-harvester.lovable.app");
  
  // Generate the appropriate structured data based on the type
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return generateWebsiteStructuredData(currentUrl);
      case 'book':
        if (!data) return generateWebsiteStructuredData(currentUrl);
        return generateBookStructuredData(data, currentUrl);
      case 'faq':
        if (!data) return generateWebsiteStructuredData(currentUrl);
        return generateFAQStructuredData(data);
      case 'breadcrumb':
        if (!breadcrumbs) return generateWebsiteStructuredData(currentUrl);
        return generateBreadcrumbStructuredData(breadcrumbs, currentUrl);
      default:
        return generateWebsiteStructuredData(currentUrl);
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
