export class ValidationError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "NotFoundError";
  }
}

export class ExternalServiceError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ExternalServiceError";
  }
}
