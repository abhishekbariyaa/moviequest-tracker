
import { useState, useRef, useEffect } from 'react';
import { searchMovies, getMovieDetails } from '@/services/movieApi';
import { MovieSearchResult, MovieDetails, MovieStatus } from '@/types/movie';
import { toast } from '@/components/ui/use-toast';
import { 
  SearchIcon, 
  FilmIcon, 
  Loader2Icon, 
  XIcon, 
  PlusIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MovieSearchProps {
  onAddMovie: (movie: MovieDetails, status: MovieStatus) => boolean;
}

const MovieSearch = ({ onAddMovie }: MovieSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<MovieStatus>('to-watch');
  const [open, setOpen] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  
  // Status options for new movies
  const statusOptions: { value: MovieStatus; label: string }[] = [
    { value: 'to-watch', label: 'To Watch' },
    { value: 'watching', label: 'Watching' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'watched', label: 'Watched' }
  ];
  
  // Debounced search
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(async () => {
      setIsSearching(true);
      setOpen(true);
      const searchResults = await searchMovies(query);
      setResults(searchResults);
      setIsSearching(false);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);
  
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
      setOpen(false);
      toast({
        title: "Success",
        description: `${result.Title} added to your collection`,
      });
    }
  };
  
  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
  };
  
  return (
    <div className="w-full">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Popover open={open && results.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a movie or series..."
                  className="w-full pl-10 pr-10 h-10 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            </PopoverTrigger>
            
            <PopoverContent 
              className="p-0 w-[350px] border border-gray-200 shadow-lg"
              align="start"
              sideOffset={5}
            >
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  {isSearching ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2Icon className="h-5 w-5 animate-spin text-gray-500" />
                      <span className="ml-2 text-sm text-gray-500">Searching...</span>
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No results found</CommandEmpty>
                      <CommandGroup heading="Search Results">
                        {results.map((result) => (
                          <CommandItem
                            key={result.imdbID}
                            onSelect={() => handleAddMovie(result)}
                            className="flex items-center gap-2 py-2 px-2"
                          >
                            <div className="w-10 h-14 flex-shrink-0 overflow-hidden rounded">
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
                              <p className="text-sm font-medium text-gray-900 truncate">{result.Title}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>{result.Year}</span>
                                <span className="opacity-50">•</span>
                                <span className="capitalize">{result.Type}</span>
                              </div>
                            </div>
                            
                            <PlusIcon size={16} className="text-gray-400 hover:text-gray-600" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as MovieStatus)}
          className="h-10 text-sm px-3 py-2 bg-white/80 border border-gray-200 rounded-lg shadow-sm"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MovieSearch;
