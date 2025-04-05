
import { useState, useEffect } from 'react';
import { Movie, MovieStatus, MovieDetails } from '@/types/movie';
import { extractFranchise } from '@/services/movieApi';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useMovieCollection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [activeFilter, setActiveFilter] = useState<MovieStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Load movies from database on component mount or when user changes
  useEffect(() => {
    if (!user) return;
    
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_movies')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          // Transform database records to the Movie type
          const transformedMovies: Movie[] = data.map(item => ({
            id: item.movie_id,
            title: item.title,
            year: item.year,
            type: item.type,
            imdbRating: item.imdb_rating,
            genre: item.genre,
            plot: item.plot,
            director: item.director,
            actors: item.actors,
            poster: item.poster,
            franchise: item.franchise,
            status: item.status as MovieStatus,
            dateAdded: item.date_added
          }));
          
          setMovies(transformedMovies);
        }
      } catch (error: any) {
        console.error('Error loading movies:', error);
        toast({
          title: "Error",
          description: "Failed to load your movie collection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [user]);
  
  // Update filtered movies when main collection or filter changes
  useEffect(() => {    
    if (activeFilter === 'all') {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(movies.filter(movie => movie.status === activeFilter));
    }
  }, [movies, activeFilter]);
  
  // Add a new movie to the collection
  const addMovie = async (movieDetails: MovieDetails, status: MovieStatus = 'to-watch') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add movies to your collection",
        variant: "destructive",
      });
      return false;
    }
    
    const franchise = extractFranchise(movieDetails.Title, movieDetails.Production);
    
    const newMovie: Movie = {
      id: movieDetails.imdbID,
      title: movieDetails.Title,
      year: movieDetails.Year,
      type: movieDetails.Type,
      imdbRating: movieDetails.imdbRating,
      genre: movieDetails.Genre,
      plot: movieDetails.Plot,
      director: movieDetails.Director,
      actors: movieDetails.Actors,
      poster: movieDetails.Poster,
      franchise: franchise,
      status: status,
      dateAdded: new Date().toISOString()
    };
    
    // Check if movie already exists
    if (movies.some(movie => movie.id === newMovie.id)) {
      toast({
        title: "Movie already exists",
        description: "This movie is already in your collection",
      });
      return false;
    }
    
    try {
      // Add to database
      const { error } = await supabase.from('user_movies').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        movie_id: newMovie.id,
        title: newMovie.title,
        year: newMovie.year,
        type: newMovie.type,
        imdb_rating: newMovie.imdbRating,
        genre: newMovie.genre,
        plot: newMovie.plot,
        director: newMovie.director,
        actors: newMovie.actors,
        poster: newMovie.poster,
        franchise: newMovie.franchise,
        status: newMovie.status,
        date_added: newMovie.dateAdded,
      });
      
      if (error) throw error;
      
      setMovies(prevMovies => [...prevMovies, newMovie]);
      toast({
        title: "Movie added",
        description: `${newMovie.title} has been added to your collection`,
      });
      return true;
    } catch (error: any) {
      console.error('Error adding movie:', error);
      toast({
        title: "Error",
        description: "Failed to add movie to your collection",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Remove a movie from the collection
  const removeMovie = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_movies')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', id);
      
      if (error) throw error;
      
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
      toast({
        title: "Movie removed",
        description: "The movie has been removed from your collection",
      });
    } catch (error: any) {
      console.error('Error removing movie:', error);
      toast({
        title: "Error",
        description: "Failed to remove movie from your collection",
        variant: "destructive",
      });
    }
  };
  
  // Update a movie's status
  const updateMovieStatus = async (id: string, status: MovieStatus) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_movies')
        .update({ status })
        .eq('user_id', user.id)
        .eq('movie_id', id);
      
      if (error) throw error;
      
      setMovies(prevMovies => 
        prevMovies.map(movie => 
          movie.id === id ? { ...movie, status } : movie
        )
      );
    } catch (error: any) {
      console.error('Error updating movie status:', error);
      toast({
        title: "Error",
        description: "Failed to update movie status",
        variant: "destructive",
      });
    }
  };
  
  // Filter movies by status
  const filterByStatus = (status: MovieStatus | 'all') => {
    setActiveFilter(status);
  };
  
  return {
    movies,
    filteredMovies,
    activeFilter,
    isLoading,
    addMovie,
    removeMovie,
    updateMovieStatus,
    filterByStatus
  };
};
