import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  role: string;
  employeeId: string;
  iat: number;
  exp: number;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET as string;

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const user = await User.findById(decoded.id).select('+password');
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Account not found or deactivated' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
  const payload = {
    id: user._id.toString(),
    role: user.role,
    employeeId: user.employeeId,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });

  const refreshToken = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
}
