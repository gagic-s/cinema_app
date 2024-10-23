import { CustomException } from "./CustomException.js";

export class NotFoundException extends CustomException {
  constructor(entity: string) {
    super(`${entity} not found`, 404); // Set the message and status code
    this.name = "NotFoundException"; // Set a custom name
  }
}
