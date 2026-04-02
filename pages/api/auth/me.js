import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  authenticate(req, res, () => {
    res.status(200).json({ user: req.user });
  });
}