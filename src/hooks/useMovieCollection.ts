
import { useState, useEffect } from 'react';
import { Movie, MovieStatus, MovieDetails } from '@/types/movie';
import { extractFranchise } from '@/services/movieApi';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const useMovieCollection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [activeFilter, setActiveFilter] = useState<MovieStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Load movies from local storage on component mount
  useEffect(() => {
    const loadMovies = () => {
      setIsLoading(true);
      try {
        const storedMovies = localStorage.getItem('movieCollection');
        if (storedMovies) {
          const parsedMovies: Movie[] = JSON.parse(storedMovies);
          setMovies(parsedMovies);
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
  }, []);
  
  // Update filtered movies when main collection or filter changes
  useEffect(() => {    
    if (activeFilter === 'all') {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(movies.filter(movie => movie.status === activeFilter));
    }
  }, [movies, activeFilter]);
  
  // Save movies to local storage whenever the collection changes
  useEffect(() => {
    localStorage.setItem('movieCollection', JSON.stringify(movies));
  }, [movies]);
  
  // Add a new movie to the collection
  const addMovie = async (movieDetails: MovieDetails, status: MovieStatus = 'to-watch') => {
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
    try {
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
    try {
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
