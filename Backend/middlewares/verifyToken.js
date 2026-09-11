import jwt from 'jsonwebtoken';

// Higher-order auth: verifyToken(...allowedRoles) -> middleware.
// Called bare as verifyToken() for any authenticated user,
// or verifyToken('admin') to gate on req.user.role.
export const verifyToken = (...allowedRoles) => (req, _res, next) => {
  try {
    const h = req.headers.authorization || '';
    // ponytail: cookie first (browser), Bearer fallback (non-browser clients)
    const token = req.cookies?.token || (h.startsWith('Bearer ') ? h.slice(7) : null);
    if (!token) {
      const err = new Error('Unauthorized');
      err.name = 'JsonWebTokenError';
      throw err;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.sub;
    req.user = decoded;
    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      const err = new Error('Forbidden');
      err.name = 'ForbiddenError';
      throw err;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role || 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
