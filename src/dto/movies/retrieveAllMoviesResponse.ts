import { UUID } from "crypto";

export class Genre {
  name!: string;
}

export class Screening {
  screeningDate!: string;
  screeningTime!: string;
  screening_id!: string;
  ticketPrice!: string;
}

export class RetrieveMovieResponse {
  createdAt!: string;
  duration!: string;
  movie_id!: UUID;
  name!: string;
  originalName!: string;
  posterImage!: string;
  updatedAt!: string;
  screenings!: Screening[];
  genres!: Genre[];
}
