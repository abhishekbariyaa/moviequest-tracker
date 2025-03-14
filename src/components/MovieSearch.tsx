
import { useState } from 'react';
import { searchMovies, getMovieDetails } from '@/services/movieApi';
import { MovieSearchResult, MovieDetails, MovieStatus } from '@/types/movie';
import { toast } from '@/components/ui/use-toast';
import { SearchIcon, FilmIcon, Loader2Icon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieSearchProps {
  onAddMovie: (movie: MovieDetails, status: MovieStatus) => boolean;
}

const MovieSearch = ({ onAddMovie }: MovieSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<MovieStatus>('to-watch');
  
  // Status options for new movies
  const statusOptions: { value: MovieStatus; label: string }[] = [
    { value: 'to-watch', label: 'To Watch' },
    { value: 'watching', label: 'Watching' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'watched', label: 'Watched' }
  ];
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({ 
        title: "Empty search",
        description: "Please enter a movie title to search"
      });
      return;
    }
    
    setIsSearching(true);
    const searchResults = await searchMovies(query);
    setResults(searchResults);
    setIsSearching(false);
  };
  
  const handleAddMovie = async (result: MovieSearchResult) => {
    setIsFetching(true);
    const movieDetails = await getMovieDetails(result.imdbID);
    setIsFetching(false);
    
    if (!movieDetails) {
      toast({
        title: "Error",
        description: "Failed to get movie details",
        variant: "destructive"
      });
      return;
    }
    
    const added = onAddMovie(movieDetails, selectedStatus);
    if (added) {
      // Clear search results after successful add
      setResults([]);
      setQuery('');
    }
  };
  
  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
  };
  
  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie or series..."
            className="search-input pl-10 pr-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XIcon size={18} />
            </button>
          )}
        </div>
        
        <div className="mt-2 flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as MovieStatus)}
            className="text-sm px-3 py-2 bg-white/80 border border-gray-200 rounded-lg shadow-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            type="submit"
            disabled={isSearching}
            className={cn(
              "flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg transition-all",
              "hover:bg-gray-800 active:scale-[0.98]",
              isSearching && "opacity-70"
            )}
          >
            {isSearching ? (
              <>
                <Loader2Icon size={16} className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon size={16} />
                Search
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
          <h3 className="p-3 border-b border-gray-100 font-medium text-sm text-gray-700">
            Search Results ({results.length})
          </h3>
          
          <div className="max-h-80 overflow-y-auto">
            {results.map((result) => (
              <div 
                key={result.imdbID}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="w-12 h-18 flex-shrink-0 overflow-hidden rounded">
                  {result.Poster !== 'N/A' ? (
                    <img 
                      src={result.Poster} 
                      alt={result.Title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FilmIcon size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{result.Title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>{result.Year}</span>
                    <span className="opacity-50">•</span>
                    <span className="capitalize">{result.Type}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddMovie(result)}
                  disabled={isFetching}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full transition-all",
                    isFetching ? "bg-gray-100 text-gray-400" : "bg-gray-800 text-white hover:bg-gray-700"
                  )}
                >
                  {isFetching ? (
                    <Loader2Icon size={14} className="animate-spin" />
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
