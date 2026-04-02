import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products?id=${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product || data));
  }, [id]);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center text-[var(--muted)]">Chargement du produit...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <img className="w-full h-[520px] object-cover rounded-2xl" src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--muted)] mb-3">{product.category || 'Vêtements'}</p>
            <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-[var(--muted)] mb-6">{product.description || 'Description non disponible'}</p>
            <p className="text-3xl font-black mb-3">{product.price}€</p>
            <p className="text-sm text-[#111827] mb-6">Compatibilité : <span className="font-semibold text-[var(--accent)]">{product.compatibilityScore || 0}%</span></p>
            <button className="btn-primary">Ajouter au panier</button>
            <div className="mt-7 border p-4 rounded-xl border-[var(--border)]">
              <h4 className="font-semibold mb-2">Détails du style</h4>
              <ul className="text-[var(--muted)] text-sm space-y-1">
                {product.styleTags?.map((tag) => <li key={tag}>• {tag}</li>)}
                {!product.styleTags?.length && <li>Style non défini</li>}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
