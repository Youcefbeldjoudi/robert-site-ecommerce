import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data || []));
  }, []);

  return (
    <Layout>
      <section className="container py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black">Boutique</h1>
            <p className="text-[var(--muted)] mt-2">Grille produits premium, filtres simples et navigation fluide.</p>
          </div>
          <div className="flex gap-2 text-sm">
            <button className="btn-primary">Nouveau</button>
            <button className="btn-primary bg-white text-[var(--text)] border border-[var(--border)] hover:opacity-90">Best-sellers</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <article key={product._id} className="card overflow-hidden transform transition hover:-translate-y-1 hover:shadow-lg">
              <Link href={`/product/${product._id}`}>
                <img
                  className="w-full h-72 object-cover"
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                />
              </Link>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-[var(--muted)] text-sm mb-3">{product.category || 'Style'} • Score {product.compatibilityScore || 0}%</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{product.price}€</span>
                  <Link href={`/product/${product._id}`} className="btn-primary">Voir</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
