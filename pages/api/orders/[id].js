import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';
import { authenticate, requireAdmin } from '../../../middleware/auth';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === 'PUT') {
    authenticate(req, res, async () => {
      requireAdmin(req, res, async () => {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
      });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}