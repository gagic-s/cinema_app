import { UUID } from "crypto";

export class ScreeningMovie {
  movie_id?: UUID;
  name?: string;
  duration?: number;
  posterImage?: string;
}
export default class RetrieveScreeningResponse {
  id!: UUID;
  screeningDate?: string;
  screeningTime?: string;
  ticketPrice?: string;
  screeningColumns?: string;
  screeningRows?: string;
  movie?: ScreeningMovie;
  tickets?: [];
}
