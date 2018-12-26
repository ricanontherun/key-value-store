const {inherits} = require('util');

class CustomBaseError extends Error {
  public message : string;

  constructor(message : string) {
    super(message);
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorItemTooLarge extends CustomBaseError {
  public name : string = "ErrorItemTooLarge";
}

export class ErrorMemoryLimitReached extends Error {
  public name : string = "ErrorMemoryLimitReached";
}
