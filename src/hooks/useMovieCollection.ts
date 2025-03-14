
import { useState, useEffect } from 'react';
import { Movie, MovieStatus, MovieDetails } from '@/types/movie';
import { extractFranchise } from '@/services/movieApi';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'movie-collection';

export const useMovieCollection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [activeFilter, setActiveFilter] = useState<MovieStatus | 'all'>('all');
  
  // Load movies from localStorage on initial render
  useEffect(() => {
    const savedMovies = localStorage.getItem(STORAGE_KEY);
    if (savedMovies) {
      try {
        setMovies(JSON.parse(savedMovies));
      } catch (error) {
        console.error('Error parsing saved movies:', error);
        toast({
          title: "Error",
          description: "Failed to load your movie collection",
          variant: "destructive",
        });
      }
    }
  }, []);
  
  // Save movies to localStorage whenever movies change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    
    if (activeFilter === 'all') {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(movies.filter(movie => movie.status === activeFilter));
    }
  }, [movies, activeFilter]);
  
  // Add a new movie to the collection
  const addMovie = (movieDetails: MovieDetails, status: MovieStatus = 'to-watch') => {
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
    
    setMovies(prevMovies => [...prevMovies, newMovie]);
    toast({
      title: "Movie added",
      description: `${newMovie.title} has been added to your collection`,
    });
    return true;
  };
  
  // Remove a movie from the collection
  const removeMovie = (id: string) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
    toast({
      title: "Movie removed",
      description: "The movie has been removed from your collection",
    });
  };
  
  // Update a movie's status
  const updateMovieStatus = (id: string, status: MovieStatus) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id ? { ...movie, status } : movie
      )
    );
  };
  
  // Filter movies by status
  const filterByStatus = (status: MovieStatus | 'all') => {
    setActiveFilter(status);
  };
  
  return {
    movies,
    filteredMovies,
    activeFilter,
    addMovie,
    removeMovie,
    updateMovieStatus,
    filterByStatus
  };
};
