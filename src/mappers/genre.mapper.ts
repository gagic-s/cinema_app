import GenreDTO from "../dto/genre.dto";
import Genre from "../models/genre.model";

class GenreMapper {
  toGenreDTO(genre: Genre): GenreDTO {
    return {
      id: genre.genre_id!,
      name: genre.name!,
    };
  }

  toGenreModel(genreDto: GenreDTO) {
    return {
      id: genreDto.id,
      name: genreDto.name,
    };
  }
}
export default new GenreMapper();
