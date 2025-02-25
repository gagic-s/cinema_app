import { UploadApiResponse } from "cloudinary";
import { UUID } from "crypto";
import { Op } from "sequelize";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { Genre, Movie, Screening } from "../db/index.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { ValidationException } from "../exceptions/ValidationException.js";

interface IMovieRepository {
  save(createParams: CreateMovieParams): Promise<Movie>;
  addGenresToMovie(movie: Movie, genres: Genre[]): Promise<void>;
  retrieveAll(searchParams: {
    movieName?: string;
    date?: string;
  }): Promise<Movie[]>;
  retrieveById(movieId: UUID): Promise<Movie | null>;
  update(movie: Movie): Promise<number>;
  delete(movieId: UUID): Promise<number>;
}

interface CreateMovieParams {
  name: string;
  originalName: string;
  posterImage: Express.Multer.File;
  duration: number;
}

interface SearchCondition {
  [key: string]: any;
}

const uploadImageToCloudinary = async (createParams: any) => {
  let uploadResult: UploadApiResponse | undefined;

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "movie_posters",
          resource_type: "image", 
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Cloudinary upload returned no result"));
          }
        }
      );

      // Convert buffer to readable stream
      streamifier
        .createReadStream(createParams.posterImage.buffer)
        .pipe(uploadStream)
        .on("error", (err) =>
          reject(new Error(`Stream error: ${err.message}`))
        );
    });

    return uploadResult;
  } catch (error: any) {
    throw new DatabaseException(`Image upload failed: ${error.message}`);
  }
};

class MovieRepository implements IMovieRepository {
  async save(createParams: CreateMovieParams): Promise<Movie> {
    try {
      if (!createParams.posterImage?.buffer) {
        throw new ValidationException("No poster image provided");
      }

      const result: any = await uploadImageToCloudinary(createParams);

      return await Movie.create({
        name: createParams.name,
        originalName: createParams.originalName,
        posterImage: result.secure_url,
        posterPublicId: result.public_id,
        duration: createParams.duration,
      });
    } catch (err: any) {
      throw new DatabaseException(`Failed to create movie: ${err.message}`);
    }
  }

  async addGenresToMovie(movie: Movie, genres: Genre[]): Promise<void> {
    try {
      return await (movie as any).addGenres(genres);
    } catch (error) {
      throw new DatabaseException("Failed to add Genres!");
    }
  }

  async retrieveAll(searchParams: {
    movieName?: string;
    date?: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const condition: any = {};

    try {
      if (searchParams.movieName) {
        condition.name = { [Op.iLike]: `%${searchParams.movieName}%` };
      }

      const movies = await Movie.findAll({
        where: condition,
        include: [
          {
            model: Genre,
            attributes: ["name"],
          },
          {
            model: Screening,
            where: searchParams.date
              ? { screeningDate: searchParams.date }
              : undefined,
            attributes: [
              "screening_id",
              "screeningDate",
              "screeningTime",
              "ticketPrice",
            ],
          },
        ],
        limit: searchParams.limit || undefined, // Apply limit if specified
        offset: searchParams.offset || undefined,
      });

      return movies;
    } catch (error: any) {
      new DatabaseException(error.message);
    }
  }

  async retrieveById(movieId: UUID): Promise<Movie | null> {
    try {
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        throw new NotFoundException("Movie");
      }
      return movie;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async update(movie: Movie): Promise<number> {
    const { id, name, originalName, duration, posterImage } = movie;

    try {
      const affectedRows = await Movie.update(
        { name, originalName, duration, posterImage },
        { where: { movie_id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new DatabaseException("Failed to update Genre!");
    }
  }

  async delete(movieId: UUID): Promise<number> {
    try {
      const affectedRows = await Movie.destroy({
        where: { movie_id: movieId },
      });

      return affectedRows;
    } catch (error) {
      throw new DatabaseException("Failed to delete Genre!");
    }
  }
}

export default new MovieRepository();
