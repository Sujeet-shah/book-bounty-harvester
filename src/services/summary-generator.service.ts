
/**
 * Summary Generator Service
 * 
 * This service handles generating summaries using AI models like Gemini
 */

interface SummaryGenerationData {
  title: string;
  author?: string;
  genres?: string[];
  content?: string;
}

interface SummaryResponse {
  summary: string;
}

class SummaryGeneratorService {
  private static API_KEY: string | null = null;
  
  /**
   * Set the API key for the AI model
   */
  static setApiKey(apiKey: string): void {
    this.API_KEY = apiKey;
    // Store the API key temporarily in session storage
    // In production, this should be handled more securely
    sessionStorage.setItem('ai_api_key', apiKey);
  }
  
  /**
   * Get the API key
   */
  static getApiKey(): string | null {
    return this.API_KEY || sessionStorage.getItem('ai_api_key');
  }
  
  /**
   * Validate if the API key is in the correct format
   */
  static validateApiKey(apiKey: string): boolean {
    // Basic validation - Gemini API keys usually start with "AIza"
    return apiKey && apiKey.startsWith('AIza') && apiKey.length > 20;
  }
  
  /**
   * Generate a summary using Gemini API
   */
  static async generateSummary(data: SummaryGenerationData): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not set. Please set an API key first.');
    }
    
    if (!this.validateApiKey(apiKey)) {
      throw new Error('Invalid API key format. Please check your API key.');
    }
    
    try {
      // Prepare the prompt for Gemini
      let prompt = `Generate a comprehensive summary for the book "${data.title}"`;
      
      if (data.author && data.author.trim()) {
        prompt += ` by ${data.author}`;
      }
      
      if (data.genres && data.genres.length > 0) {
        prompt += `. The book belongs to the following genres: ${data.genres.join(', ')}.`;
      }
      
      if (data.content && data.content.trim()) {
        prompt += `. Here's the content to summarize: ${data.content.substring(0, 5000)}...`;
      } else {
        prompt += `. The summary should cover the main themes, characters, and key points of the book.`;
      }
      
      console.log('Sending request to Gemini API...');
      
      // Make the API request to Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        }
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        
        // Extract more specific error information if available
        const errorMessage = errorData.error?.message || 'Unknown error';
        const errorCode = errorData.error?.code || 0;
        
        if (errorCode === 400) {
          throw new Error(`API Error (400): ${errorMessage}. This could be due to an invalid API key.`);
        } else if (errorCode === 403) {
          throw new Error(`API Error (403): ${errorMessage}. Access denied - please check if your API key has the correct permissions.`);
        } else if (errorCode === 429) {
          throw new Error(`API Error (429): ${errorMessage}. Rate limit exceeded - please try again later.`);
        } else {
          throw new Error(`API Error (${errorCode}): ${errorMessage}`);
        }
      }
      
      const responseData = await response.json();
      console.log('Response data received');
      
      // Extract the summary from the response
      const generatedText = responseData.contents?.[0]?.parts?.[0]?.text;
      
      if (!generatedText) {
        console.error('No text in response:', responseData);
        throw new Error('No summary was generated. The API returned an empty response.');
      }
      
      return generatedText;
    } catch (error) {
      console.error('Summary generation failed:', error);
      
      // Improve error handling with more specific messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the Gemini API. Please check your internet connection.');
      }
      
      // Rethrow the original error
      throw error;
    }
  }

  /**
   * Generate summaries for multiple books in batch
   */
  static async generateBatchSummaries(books: any[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    for (const book of books) {
      try {
        const summary = await this.generateSummary({
          title: book.title,
          author: book.author.name,
          genres: book.genre
        });
        
        results[book.id] = summary;
      } catch (error) {
        console.error(`Failed to generate summary for book ${book.id}:`, error);
        results[book.id] = "Summary generation failed.";
      }
      
      // Small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}

export { SummaryGeneratorService };
