
import { Movie, MovieStatus } from '@/types/movie';
import MovieCard from './MovieCard';
import { cn } from '@/lib/utils';
import { 
  BookmarkIcon, 
  CheckIcon, 
  FilterIcon, 
  PauseIcon, 
  PlayIcon, 
} from 'lucide-react';

interface MovieCollectionProps {
  movies: Movie[];
  activeFilter: MovieStatus | 'all';
  onFilterChange: (filter: MovieStatus | 'all') => void;
  onStatusChange: (id: string, status: MovieStatus) => void;
  onRemoveMovie: (id: string) => void;
}

const MovieCollection = ({ 
  movies, 
  activeFilter, 
  onFilterChange, 
  onStatusChange, 
  onRemoveMovie 
}: MovieCollectionProps) => {
  const filterOptions = [
    { value: 'all', label: 'All', count: movies.length, icon: <FilterIcon size={14} /> },
    { 
      value: 'to-watch', 
      label: 'To Watch', 
      count: movies.filter(m => m.status === 'to-watch').length,
      icon: <BookmarkIcon size={14} />,
      color: 'text-blue-600'
    },
    { 
      value: 'watching', 
      label: 'Watching', 
      count: movies.filter(m => m.status === 'watching').length,
      icon: <PlayIcon size={14} />,
      color: 'text-green-600'
    },
    { 
      value: 'on-hold', 
      label: 'On Hold', 
      count: movies.filter(m => m.status === 'on-hold').length,
      icon: <PauseIcon size={14} />,
      color: 'text-amber-600'
    },
    { 
      value: 'watched', 
      label: 'Watched', 
      count: movies.filter(m => m.status === 'watched').length,
      icon: <CheckIcon size={14} />,
      color: 'text-indigo-600'
    }
  ];
  
  return (
    <div className="w-full">
      {/* Filter tabs */}
      <div className="flex space-x-1 overflow-x-auto py-2 mb-4">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value as MovieStatus | 'all')}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all",
              activeFilter === option.value
                ? "bg-gray-800 text-white"
                : "bg-white hover:bg-gray-50 text-gray-700",
              option.color && activeFilter !== option.value && option.color
            )}
          >
            {option.icon}
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
      
      {/* Movies grid */}
      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
          <div className="bg-gray-100 w-16 h-16 flex items-center justify-center rounded-full mb-3">
            <FilterIcon size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No movies found</h3>
          <p className="text-gray-500 mt-1">
            {activeFilter === 'all' 
              ? "Your collection is empty. Search and add some movies!" 
              : `You don't have any movies with '${activeFilter}' status.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onStatusChange={onStatusChange}
              onRemove={onRemoveMovie}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCollection;
