import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';
import { authenticate, requireAdmin } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    authenticate(req, res, async () => {
      if (req.user.isAdmin) {
        const orders = await Order.find({}).populate('user products.product');
        res.status(200).json(orders);
      } else {
        const orders = await Order.find({ user: req.user._id }).populate('products.product');
        res.status(200).json(orders);
      }
    });
  } else if (req.method === 'POST') {
    authenticate(req, res, async () => {
      const { products, shippingAddress, phone } = req.body;
      const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = new Order({
        user: req.user._id,
        products,
        totalAmount,
        shippingAddress,
        phone,
      });
      await order.save();
      res.status(201).json(order);
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}