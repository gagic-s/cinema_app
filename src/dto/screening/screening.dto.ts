import { UUID } from "crypto";

export default class updateScreeningDTO {
  id!: UUID;
  screeningDate?: string;
  screeningTime?: string;
  ticketPrice?: string;
  screeningColumns?: string;
  screeningRows?: string;
}
