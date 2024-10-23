import { CustomException } from "./CustomException.js";

export class ValidationException extends CustomException {
  constructor(message: string) {
    super(`Validation Error: ${message}`, 400);
    this.name = "ValidationException";
  }
}
