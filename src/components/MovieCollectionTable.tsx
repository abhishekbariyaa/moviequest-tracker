
import { useState } from 'react';
import { Movie, MovieStatus } from '@/types/movie';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  FilmIcon, 
  SearchIcon, 
  SlidersIcon,
  ArrowUpDown,
  XIcon
} from 'lucide-react';
import StatusSelector from '@/components/StatusSelector';
import { cn } from '@/lib/utils';

interface MovieCollectionTableProps {
  movies: Movie[];
  activeFilter: MovieStatus | 'all';
  onFilterChange: (filter: MovieStatus | 'all') => void;
  onStatusChange: (id: string, status: MovieStatus) => void;
  onRemoveMovie: (id: string) => void;
}

type SortKey = 'title' | 'year' | 'imdbRating' | 'dateAdded';
type SortDirection = 'asc' | 'desc';

const MovieCollectionTable = ({ 
  movies, 
  activeFilter, 
  onFilterChange, 
  onStatusChange, 
  onRemoveMovie 
}: MovieCollectionTableProps) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('dateAdded');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filterOptions = [
    { value: 'all', label: 'All', count: movies.length },
    { value: 'to-watch', label: 'To Watch', count: movies.filter(m => m.status === 'to-watch').length },
    { value: 'watching', label: 'Watching', count: movies.filter(m => m.status === 'watching').length },
    { value: 'on-hold', label: 'On Hold', count: movies.filter(m => m.status === 'on-hold').length },
    { value: 'watched', label: 'Watched', count: movies.filter(m => m.status === 'watched').length }
  ];

  // Filter and sort movies
  let filteredMovies = movies.filter(movie => {
    const matchesSearch = searchFilter === '' || 
      movie.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (movie.franchise && movie.franchise.toLowerCase().includes(searchFilter.toLowerCase())) ||
      movie.genre.toLowerCase().includes(searchFilter.toLowerCase());
      
    return matchesSearch;
  });

  // Sort movies
  filteredMovies.sort((a, b) => {
    let comparison = 0;
    
    switch(sortKey) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'year':
        comparison = parseInt(a.year) - parseInt(b.year);
        break;
      case 'imdbRating':
        comparison = parseFloat(a.imdbRating || '0') - parseFloat(b.imdbRating || '0');
        break;
      case 'dateAdded':
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full">
      {/* Filter and search controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex space-x-1 overflow-x-auto py-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value as MovieStatus | 'all')}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all",
                activeFilter === option.value
                  ? "bg-gray-800 text-white"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              )}
            >
              {option.label}
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-xs",
                activeFilter === option.value
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              )}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
        
        <div className="relative flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Filter collection..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9 pr-9 focus-visible:ring-gray-300"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>
      
      {/* Movies table */}
      {filteredMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
          <div className="bg-gray-100 w-16 h-16 flex items-center justify-center rounded-full mb-3">
            <FilmIcon size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No movies found</h3>
          <p className="text-gray-500 mt-1">
            {activeFilter === 'all' && !searchFilter
              ? "Your collection is empty. Search and add some movies!" 
              : "No movies match your current filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                    <div className="flex items-center">
                      Title
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('year')}>
                    <div className="flex items-center">
                      Year
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('imdbRating')}>
                    <div className="flex items-center">
                      Rating
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell>
                      <div className="w-10 h-14 overflow-hidden rounded">
                        {movie.poster !== 'N/A' ? (
                          <img 
                            src={movie.poster} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FilmIcon size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px]">
                        <div className="font-medium truncate">{movie.title}</div>
                        {movie.franchise && (
                          <div className="text-xs text-gray-500 truncate">
                            {movie.franchise} franchise
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{movie.year}</TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate">
                        {movie.genre}
                      </div>
                    </TableCell>
                    <TableCell>
                      {movie.imdbRating !== 'N/A' ? (
                        <div className="flex items-center">
                          <span className="text-amber-500">★</span>
                          <span className="ml-1">{movie.imdbRating}/10</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusSelector 
                        id={movie.id}
                        currentStatus={movie.status}
                        onChange={(status) => onStatusChange(movie.id, status)}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => onRemoveMovie(movie.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove from collection"
                      >
                        <XIcon size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCollectionTable;
