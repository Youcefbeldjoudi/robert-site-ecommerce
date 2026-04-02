import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data));

    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    // Refresh orders
    const res = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(await res.json());
  };

  return (
    <Layout>
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="card p-6">
            <h2 className="text-2xl font-bold mb-3">Panel Admin</h2>
            <p className="text-[var(--muted)]">Gestion simplifiée des commandes et du catalogue.</p>
          </article>

          <article className="lg:col-span-2 card p-6">
            <h3 className="text-xl font-semibold mb-4">Commandes récentes</h3>
            <div className="space-y-4">
              {orders.length === 0 && <p className="text-[var(--muted)]">Aucune commande trouvée.</p>}
              {orders.map((order) => (
                <div key={order._id} className="border border-[var(--border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.user?.name || 'Client'}</p>
                    <p className="text-sm text-[var(--muted)]">{order.products?.length || 0} articles • {order.totalAmount}€</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium text-[var(--muted)]">Statut :</span>
                    <select
                      className="rounded-lg border border-[var(--border)] px-3 py-2 bg-white"
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      value={order.status}
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}