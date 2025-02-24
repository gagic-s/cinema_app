import { MovieResponse } from "../dto/movies/movies.dto";

const sortScreenings = (screenings: any[]) =>
  screenings.sort(
    (a, b) =>
      new Date(`${a.screeningDate}T${a.screeningTime}`).getTime() -
      new Date(`${b.screeningDate}T${b.screeningTime}`).getTime()
  );

const mapGenreNamesToArrayOfStrings = (genres: any) => {
  return genres.map((genre: any) => genre.name);
};

class MovieMapper {
  toMovieResponse(movie: any): MovieResponse {
    return {
      movie_id: movie.movie_id,
      name: movie.name,
      originalName: movie.originalName,
      duration: movie.duration,
      posterImage: movie.posterImage,
      genres: mapGenreNamesToArrayOfStrings(movie.Genres),
      screenings: sortScreenings(movie.Screenings),
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    };
  }
}

export default new MovieMapper();
