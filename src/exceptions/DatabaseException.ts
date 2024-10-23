import { CustomException } from "./CustomException.js";

export class DatabaseException extends CustomException {
  constructor(message: string) {
    super(`Database Error: ${message}`, 500);
    this.name = "DatabaseException";
  }
}
