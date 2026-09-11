// Centralized error handler keyed off err.name. Must be mounted last.
export const notFound = (_req, _res, next) => {
  const err = new Error('Not found');
  err.name = 'NotFoundError';
  next(err);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  switch (err.name) {
    case 'ValidationError':
    case 'StrictModeError':
    case 'CastError':
      return res.status(400).json({ error: err.message });
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'Unauthorized' });
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'Token expired' });
    case 'ForbiddenError':
      return res.status(403).json({ error: 'Forbidden' });
    case 'NotFoundError':
      return res.status(404).json({ error: 'Not found' });
    default:
      if (err.code === 11000) return res.status(409).json({ error: 'Duplicate key' });
      if (err.status) return res.status(err.status).json({ error: err.message });
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
  }
};
