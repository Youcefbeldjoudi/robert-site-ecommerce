import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';
import PersonalityProfile from '../../../models/PersonalityProfile';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      if (id) {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
        return res.status(200).json({ product });
      }

      const products = await Product.find({});
      // Si utilisateur connecté, calculer compatibilité
      if (req.headers.authorization) {
        authenticate(req, res, async () => {
          const user = req.user;
          if (user.personalityProfile) {
            const profile = await PersonalityProfile.findById(user.personalityProfile);
            products.forEach(product => {
              product.compatibilityScore = product.styleTags.includes(profile.styleType) ? 100 : 50;
            });
          }
          res.status(200).json(products);
        });
      } else {
        res.status(200).json(products);
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    authenticate(req, res, async () => {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { name, description, price, images, category, styleTags, stock } = req.body;
      const product = new Product({ name, description, price, images, category, styleTags, stock });
      await product.save();
      res.status(201).json(product);
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}