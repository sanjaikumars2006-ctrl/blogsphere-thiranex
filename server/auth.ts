import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, User } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'blogsphere-super-secure-secret-key-2025';

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = db.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found. Session invalid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
  }
}

export function optionalAuthToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = db.getUserById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid optional token
  }
  next();
}
