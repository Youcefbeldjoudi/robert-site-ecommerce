require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: 'T-shirt Décontracté',
    description: 'T-shirt confortable pour un style casual.',
    price: 25,
    images: ['/tshirt.jpg'],
    category: 'Vêtements',
    styleTags: ['Décontracté'],
    stock: 100,
  },
  {
    name: 'Robe Élégante',
    description: 'Robe parfaite pour les occasions spéciales.',
    price: 80,
    images: ['/robe.jpg'],
    category: 'Vêtements',
    styleTags: ['Élégant'],
    stock: 50,
  },
  // Ajouter plus
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.insertMany(products);
  console.log('Produits ajoutés');
  process.exit();
}

seed();