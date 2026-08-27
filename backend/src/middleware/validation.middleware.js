import { sendError } from '../utils/response.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return sendError(res, 'Validation failed', 400, formattedErrors);
  }
  req.body = result.data;
  next();
};
