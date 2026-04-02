import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { verifyPassword, generateToken } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, gender: user.gender, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}