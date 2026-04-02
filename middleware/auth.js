import { verifyToken } from '../utils/auth';
import dbConnect from '../lib/mongodb';
import User from '../models/User';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  await dbConnect();
  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  req.user = user;
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};