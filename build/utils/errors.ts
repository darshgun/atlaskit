/** Error utils */

/* Allow us to handle validation errors specifically */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
