
import { Movie, MovieStatus } from '@/types/movie';
import StatusSelector from './StatusSelector';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  FilmIcon, 
  StarIcon, 
  TagIcon, 
  TrashIcon, 
  UserIcon, 
  VideoIcon,
  ExternalLinkIcon
} from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onStatusChange: (id: string, status: MovieStatus) => void;
  onRemove: (id: string) => void;
}

const MovieCard = ({ movie, onStatusChange, onRemove }: MovieCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleStatusChange = (status: MovieStatus) => {
    onStatusChange(movie.id, status);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div 
      className={cn(
        "movie-card glass-card overflow-hidden transition-all duration-300",
        isExpanded ? "col-span-2 sm:col-span-2 md:col-span-2" : "col-span-1"
      )}
    >
      <div className="relative overflow-hidden">
        {/* Poster with gradient overlay */}
        <div className="relative h-48">
          <img 
            src={movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        {/* Top overlay with status selector */}
        <div className="absolute top-2 right-2 z-10">
          <StatusSelector 
            currentStatus={movie.status} 
            onChange={handleStatusChange}
          />
        </div>
        
        {/* View details link */}
        <div className="absolute top-2 left-2 z-10">
          <Link
            to={`/movie/${movie.id}`}
            className="p-1.5 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full transition-colors"
            title="View details"
          >
            <ExternalLinkIcon size={16} />
          </Link>
        </div>
        
        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3 className="text-white font-semibold text-lg line-clamp-1">{movie.title}</h3>
          
          <div className="flex items-center gap-2 text-xs text-white/90 mt-1">
            <div className="flex items-center gap-1">
              <StarIcon size={12} className="text-yellow-400" />
              <span>{movie.imdbRating !== 'N/A' ? movie.imdbRating : '?'}</span>
            </div>
            <span className="opacity-50">•</span>
            <div>{movie.year}</div>
            <span className="opacity-50">•</span>
            <div className="capitalize">{movie.type}</div>
          </div>
          
          {/* Synopsis preview (only shown in collapsed state) */}
          <div className="mt-1 text-xs text-white/80 line-clamp-2">
            {movie.plot || "No synopsis available"}
          </div>
          
          {/* Expand/Collapse button */}
          <button 
            className="mt-2 text-xs text-white/80 hover:text-white transition-colors underline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less details' : 'More details'}
          </button>
        </div>
      </div>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="p-4 space-y-3 animate-slide-up">
          <div className="flex flex-wrap gap-1">
            {movie.genre.split(',').map((genre, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                {genre.trim()}
              </span>
            ))}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-800">Synopsis</h4>
            <p className="text-sm text-gray-700">{movie.plot || "No synopsis available"}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <UserIcon size={14} className="text-gray-400" />
              <span className="text-gray-700 font-medium">Director:</span>
              <span className="text-gray-600 text-xs">{movie.director}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <VideoIcon size={14} className="text-gray-400" />
              <span className="text-gray-700 font-medium">Actors:</span>
              <span className="text-gray-600 text-xs line-clamp-1">{movie.actors}</span>
            </div>
            
            {movie.franchise && (
              <div className="flex items-center gap-2">
                <TagIcon size={14} className="text-gray-400" />
                <span className="text-gray-700 font-medium">Franchise:</span>
                <span className="text-gray-600 text-xs">{movie.franchise}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <CalendarIcon size={14} className="text-gray-400" />
              <span className="text-gray-700 font-medium">Added:</span>
              <span className="text-gray-600 text-xs">{formatDate(movie.dateAdded)}</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
              onClick={() => onRemove(movie.id)}
            >
              <TrashIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
