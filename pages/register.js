import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/login');
    } else {
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <Layout>
      <section className="container py-16">
        <div className="max-w-md mx-auto card p-8">
          <h2 className="text-3xl font-black mb-4">Rejoindre RKN</h2>
          <p className="text-[var(--muted)] mb-8">Créez votre compte pour accéder aux recommandations de style personnalisées.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-[var(--border)] rounded-xl px-4 py-3 bg-white outline-none focus:border-[var(--accent)] focus:ring focus:ring-[rgba(34,34,34,0.12)]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-[var(--border)] rounded-xl px-4 py-3 bg-white outline-none focus:border-[var(--accent)] focus:ring focus:ring-[rgba(34,34,34,0.12)]"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-[var(--border)] rounded-xl px-4 py-3 bg-white outline-none focus:border-[var(--accent)] focus:ring focus:ring-[rgba(34,34,34,0.12)]"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-[var(--border)] rounded-xl px-4 py-3 bg-white outline-none focus:border-[var(--accent)] focus:ring focus:ring-[rgba(34,34,34,0.12)]"
            />
            <button type="submit" className="btn-primary w-full">Créer mon compte</button>
          </form>
          <p className="mt-4 text-sm text-[var(--muted)]">Déjà membre ? <a href="/login" className="text-[var(--accent)] font-semibold">Connexion</a></p>
        </div>
      </section>
    </Layout>
  );
}