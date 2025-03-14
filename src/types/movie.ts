
export type MovieStatus = 'to-watch' | 'watching' | 'on-hold' | 'watched';

export interface Movie {
  id: string;
  title: string;
  year: string;
  type: string;
  imdbRating: string;
  genre: string;
  plot: string;
  director: string;
  actors: string;
  poster: string;
  franchise?: string;
  status: MovieStatus;
  dateAdded: string;
}

export interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
