import {
  ExternalServiceError,
  NotFoundError,
  ValidationError,
} from "../errors/serviceErrors.js";

export function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (error instanceof ExternalServiceError) {
    console.error(error.cause ?? error);
    return res.status(500).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Server error!" });
}
