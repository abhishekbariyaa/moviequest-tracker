
import { MovieDetails, MovieSearchResult } from '@/types/movie';

// Replace with your actual API key
const API_KEY = '8a21f3b1';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query: string): Promise<MovieSearchResult[]> => {
  try {
    const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.Error || 'Failed to search movies');
    }
    
    if (data.Response === 'False') {
      console.log('No results found:', data.Error);
      return [];
    }
    
    return data.Search || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (imdbId: string): Promise<MovieDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}?i=${imdbId}&plot=full&apikey=${API_KEY}`);
    const data = await response.json();
    
    if (!response.ok || data.Response === 'False') {
      throw new Error(data.Error || 'Failed to get movie details');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Function to attempt to extract franchise from title or production info
export const extractFranchise = (title: string, production?: string): string | undefined => {
  // Common franchise identifiers
  const franchisePatterns = [
    /(.+?)(?:\s+\d+|:\s+.+)$/,  // Match "Star Wars: The Force Awakens" or "John Wick 4"
    /^(The\s+[\w]+)/, // Match "The Avengers", "The Matrix", etc.
    /^([^:]+):/ // Match anything before a colon
  ];
  
  for (const pattern of franchisePatterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no franchise is detected from the title patterns
  return undefined;
};
