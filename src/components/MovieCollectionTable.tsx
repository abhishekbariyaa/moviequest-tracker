import React, { useState } from 'react';
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
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import StatusSelector from '@/components/StatusSelector';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

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
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  
  const toggleRow = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const truncateSynopsis = (text: string, maxLength: number = 120) => {
    if (!text || text === 'N/A') return "No synopsis available";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: movies.length },
    { value: 'to-watch', label: 'To Watch', count: movies.filter(m => m.status === 'to-watch').length },
    { value: 'watching', label: 'Watching', count: movies.filter(m => m.status === 'watching').length },
    { value: 'on-hold', label: 'On Hold', count: movies.filter(m => m.status === 'on-hold').length },
    { value: 'watched', label: 'Watched', count: movies.filter(m => m.status === 'watched').length }
  ];

  let filteredMovies = movies.filter(movie => {
    const matchesSearch = searchFilter === '' || 
      movie.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (movie.franchise && movie.franchise.toLowerCase().includes(searchFilter.toLowerCase())) ||
      movie.genre.toLowerCase().includes(searchFilter.toLowerCase());
      
    return matchesSearch;
  });

  filteredMovies = [...filteredMovies].sort((a, b) => {
    let comparison = 0;
    
    switch(sortKey) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'year':
        comparison = parseInt(a.year) - parseInt(b.year);
        break;
      case 'imdbRating':
        const ratingA = parseFloat(a.imdbRating !== 'N/A' ? a.imdbRating : '0');
        const ratingB = parseFloat(b.imdbRating !== 'N/A' ? b.imdbRating : '0');
        comparison = ratingA - ratingB;
        break;
      case 'dateAdded':
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
      default:
        comparison = 0;
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

  const navigateToMovie = (id: string) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="w-full">
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
                      {sortKey === 'title' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                      {sortKey !== 'title' && <ArrowUpDown size={14} className="ml-1" />}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('year')}>
                    <div className="flex items-center">
                      Year
                      {sortKey === 'year' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                      {sortKey !== 'year' && <ArrowUpDown size={14} className="ml-1" />}
                    </div>
                  </TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('imdbRating')}>
                    <div className="flex items-center">
                      Rating
                      {sortKey === 'imdbRating' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                      {sortKey !== 'imdbRating' && <ArrowUpDown size={14} className="ml-1" />}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.map((movie) => (
                  <React.Fragment key={movie.id}>
                    <TableRow 
                      className={cn(
                        expandedRows[movie.id] ? "border-b-0" : "",
                        "cursor-pointer hover:bg-gray-50"
                      )}
                      onClick={() => navigateToMovie(movie.id)}
                    >
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
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <StatusSelector 
                          id={movie.id}
                          currentStatus={movie.status}
                          onChange={(status) => onStatusChange(movie.id, status)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => toggleRow(movie.id, e)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                            title={expandedRows[movie.id] ? "Hide details" : "Show details"}
                          >
                            {expandedRows[movie.id] ? (
                              <ChevronUpIcon size={16} />
                            ) : (
                              <ChevronDownIcon size={16} />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveMovie(movie.id);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Remove from collection"
                          >
                            <XIcon size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows[movie.id] && (
                      <TableRow key={`expanded-${movie.id}`} className="bg-gray-50">
                        <TableCell colSpan={7} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-800">Synopsis</h4>
                              <p className="text-sm text-gray-700">{truncateSynopsis(movie.plot)}</p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-800">Cast & Crew</h4>
                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-700 font-medium">Director:</span>
                                  <span className="text-gray-600">{movie.director}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-700 font-medium">Actors:</span>
                                  <span className="text-gray-600">{movie.actors}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
