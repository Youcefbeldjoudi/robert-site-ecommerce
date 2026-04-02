import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      alert('Erreur de connexion');
    }
  };

  return (
    <Layout>
      <section className="container py-16">
        <div className="max-w-md mx-auto card p-8">
          <h2 className="text-3xl font-black mb-4">Connexion RKN</h2>
          <p className="text-[var(--muted)] mb-8">Identifiez-vous pour accéder à votre espace, votre quiz et vos commandes.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
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
            <button type="submit" className="btn-primary w-full">Se connecter</button>
          </form>
          <p className="mt-4 text-sm text-[var(--muted)]">Nouveau chez RKN ? <a href="/register" className="text-[var(--accent)] font-semibold">Créer un compte</a></p>
        </div>
      </section>
    </Layout>
  );
}