export type Command = 'push' | 'report-status';
export type ErrorType = 'cli' | Command;
export interface ValidationError extends Error {
  type: ErrorType;
}
