
import { useState } from 'react';
import MovieSearch from '@/components/MovieSearch';
import MovieCollection from '@/components/MovieCollection';
import MovieCollectionTable from '@/components/MovieCollectionTable';
import { useMovieCollection } from '@/hooks/useMovieCollection';
import { MovieStatus } from '@/types/movie';
import { FilmIcon, TableIcon, GridIcon, Loader2Icon, LogOutIcon, UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { 
    filteredMovies, 
    activeFilter, 
    isLoading,
    addMovie, 
    removeMovie, 
    updateMovieStatus, 
    filterByStatus 
  } = useMovieCollection();
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-900 text-white p-2 rounded-lg">
                <FilmIcon size={20} />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MovieQuest</h1>
            </div>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
                    <UserIcon size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add New Movie</h2>
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-sm">
            <MovieSearch onAddMovie={addMovie} />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Your Collection</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                title="Grid view"
              >
                <GridIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-gray-200' : 'bg-white'}`}
                title="Table view"
              >
                <TableIcon size={18} />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2Icon className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading your collection...</span>
            </div>
          ) : viewMode === 'grid' ? (
            <MovieCollection
              movies={filteredMovies}
              activeFilter={activeFilter}
              onFilterChange={filterByStatus}
              onStatusChange={updateMovieStatus}
              onRemoveMovie={removeMovie}
            />
          ) : (
            <MovieCollectionTable
              movies={filteredMovies}
              activeFilter={activeFilter}
              onFilterChange={filterByStatus}
              onStatusChange={updateMovieStatus}
              onRemoveMovie={removeMovie}
            />
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-sm text-gray-500">
            MovieQuest — Your personal movie tracking companion
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
