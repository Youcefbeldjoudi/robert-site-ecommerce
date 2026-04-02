import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier le token et récupérer l'utilisateur
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUser(data.user));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[var(--border)] shadow-sm">
        <div className="container flex items-center justify-between py-4 gap-6">
          <Link href="/" className="text-3xl font-black tracking-tight text-[#111827]">RKN</Link>
          <nav className="hidden lg:flex gap-8 text-sm uppercase font-semibold tracking-wide text-[#4b5563]">
            <Link href="/" className="hover:text-[var(--accent)] transition">Accueil</Link>
            <Link href="/shop" className="hover:text-[var(--accent)] transition">Boutique</Link>
            <Link href="/quiz" className="hover:text-[var(--accent)] transition">Quiz</Link>
            <Link href="/admin" className="hover:text-[var(--accent)] transition">Admin</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-[var(--muted)]">{user.name}</span>
                <Link href="/profile" className="text-sm font-medium text-[var(--accent)]">Profil</Link>
                <button onClick={logout} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition">Connexion</Link>
                <Link href="/register" className="btn-primary">Inscription</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}