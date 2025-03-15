
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Movie, MovieStatus } from '@/types/movie';
import { useMovieCollection } from '@/hooks/useMovieCollection';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ClockIcon, 
  FilmIcon, 
  GlobeIcon,
  StarIcon, 
  TagIcon, 
  TrashIcon, 
  UserIcon, 
  VideoIcon,
  TvIcon
} from 'lucide-react';
import StatusSelector from '@/components/StatusSelector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { movies, updateMovieStatus, removeMovie } = useMovieCollection();
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      const foundMovie = movies.find(m => m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
      }
    }
  }, [id, movies]);
  
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FilmIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Movie not found</h1>
          <p className="text-gray-600 mt-2">The movie you're looking for doesn't exist in your collection.</p>
          <Button 
            className="mt-6" 
            onClick={() => navigate('/')}
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to collection
          </Button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleStatusChange = (status: MovieStatus) => {
    updateMovieStatus(movie.id, status);
    toast({
      title: "Status updated",
      description: `${movie.title} is now marked as ${status}`,
    });
  };
  
  const handleRemove = () => {
    removeMovie(movie.id);
    toast({
      title: "Movie removed",
      description: `${movie.title} has been removed from your collection`,
      variant: "destructive",
    });
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeftIcon size={20} />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Movie Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusSelector 
                currentStatus={movie.status} 
                onChange={handleStatusChange}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={handleRemove}
              >
                <TrashIcon size={16} />
                <span className="ml-1 hidden sm:inline">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
          {/* Hero section with poster and basic info */}
          <div className="relative bg-gray-900 text-white">
            {/* Background poster with overlay */}
            <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ 
              backgroundImage: `url(${movie.poster !== 'N/A' ? movie.poster : ''})` 
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/80"></div>
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <div className="w-full md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src={movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Basic info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{movie.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-white/80">
                      <span>{movie.year}</span>
                      <span className="text-white/50">•</span>
                      <span className="capitalize">{movie.type}</span>
                      {movie.franchise && (
                        <>
                          <span className="text-white/50">•</span>
                          <span>{movie.franchise} franchise</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    {movie.imdbRating !== 'N/A' && (
                      <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1.5 rounded-md">
                        <StarIcon size={16} className="text-yellow-400" />
                        <span className="font-medium">{movie.imdbRating}</span>
                        <span className="text-sm text-white/70">/10 IMDb</span>
                      </div>
                    )}
                    
                    <div className="text-sm text-white/80">
                      Added: {formatDate(movie.dateAdded)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {movie.genre.split(',').map((genre, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-white/10 rounded-full">
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <h2 className="text-lg font-medium mb-2">Synopsis</h2>
                    <p className="text-white/90 leading-relaxed">
                      {movie.plot || "No synopsis available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cast & Crew</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Director</h3>
                    <p className="text-gray-800">{movie.director}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Actors</h3>
                    <p className="text-gray-800">{movie.actors}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Where to Watch</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <TvIcon size={24} className="mx-auto mb-2 text-blue-500" />
                  <p className="font-medium text-gray-800">Netflix</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <TvIcon size={24} className="mx-auto mb-2 text-green-500" />
                  <p className="font-medium text-gray-800">Hulu</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <TvIcon size={24} className="mx-auto mb-2 text-amber-500" />
                  <p className="font-medium text-gray-800">Amazon Prime</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <GlobeIcon size={24} className="mx-auto mb-2 text-purple-500" />
                  <p className="font-medium text-gray-800">More Options</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Note: Streaming availability is for demonstration purposes and may not reflect actual availability.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
