import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'rkn_theme';
const USER_STORAGE_KEY = 'rkn_users';
const CURRENT_USER_KEY = 'rkn_currentUser';
const CART_KEY = 'rkn_cart';
const ORDERS_KEY = 'rkn_orders';

const PROFILES = {
  minimaliste: { name: 'Minimaliste', icon: '◻️', emoji: '🎯', color: '#c8c8c8', desc: 'La sobriété maîtrisée.', traits: ['Épuré', 'Essentiel', 'Intemporel', 'Neutre', 'Précis'] },
  elegant: { name: 'Élégant', icon: '👑', emoji: '💎', color: '#c8a664', desc: 'Raffinement et matières nobles.', traits: ['Raffiné', 'Sophistiqué', 'Classique', 'Noble', 'Posé'] },
  streetwear: { name: 'Streetwear', icon: '🔥', emoji: '🏙️', color: '#e85030', desc: 'Urbain, audacieux, libre.', traits: ['Audacieux', 'Urbain', 'Graphique', 'Actuel', 'Libre'] },
  creatif: { name: 'Créatif', icon: '🎨', emoji: '✨', color: '#c030e8', desc: 'Pièces uniques, émotions fortes.', traits: ['Artistique', 'Original', 'Audacieux', 'Expressif', 'Unique'] },
  sportif: { name: 'Sportif', icon: '⚡', emoji: '🏃', color: '#78e878', desc: 'Performance et style.', traits: ['Dynamique', 'Fonctionnel', 'Technique', 'Actif', 'Efficace'] },
  boheme: { name: 'Bohème', icon: '🌿', emoji: '🌸', color: '#e8c030', desc: 'Naturel et libre.', traits: ['Libre', 'Naturel', 'Artisanal', 'Fluide', 'Authentique'] },
};

const PRODUCTS = [
  { id: 1, name: 'Tee-shirt Blanc Essentiel', price: 2800, category: 'hauts', gender: 'Homme', styles: ['minimaliste', 'elegant'], description: 'Coton pima premium 200g.', sizes: ['XS', 'S', 'M', 'L', 'XL'], stock: 20, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', bg: 'linear-gradient(135deg,#f5f0e8,#e0d8cc)', emoji: '👕' },
  { id: 2, name: 'Pantalon Chino Beige', price: 5500, category: 'bas', gender: 'Homme', styles: ['minimaliste', 'elegant'], description: 'Coton sergé léger.', sizes: ['36', '38', '40', '42', '44'], stock: 15, imageUrl: 'https://images.unsplash.com/photo-1624378439575-d1ead6bb246c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', bg: 'linear-gradient(135deg,#d4c9a8,#c0b08e)', emoji: '👖' },
  { id: 3, name: 'Pull Col Roulé Gris', price: 3800, category: 'hauts', gender: 'Homme', styles: ['minimaliste', 'elegant'], description: 'Laine mérinos 100%.', sizes: ['S', 'M', 'L', 'XL'], stock: 12, imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', bg: 'linear-gradient(135deg,#9a9a9a,#787878)', emoji: '🧥' },
  { id: 4, name: 'Chemise Lin Blanc Cassé', price: 4200, category: 'hauts', gender: 'Femme', styles: ['minimaliste', 'boheme'], description: 'Lin naturel lavé.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], stock: 18, imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85fc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', bg: 'linear-gradient(135deg,#f0ebe0,#e8ddd0)', emoji: '👔' },
  { id: 5, name: 'Blazer Noir Structuré', price: 12000, category: 'vestes', gender: 'Femme', styles: ['elegant'], description: 'Laine vierge 70%.', sizes: ['38', '40', '42', '44', '46'], stock: 8, imageUrl: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', bg: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)', emoji: '🧥' },
  { id: 6, name: 'Robe Mi-longue Ivoire', price: 9500, category: 'robes', gender: 'Femme', styles: ['elegant', 'minimaliste'], description: 'Crêpe de soie mat.', sizes: ['XS', 'S', 'M', 'L'], stock: 7, imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', bg: 'linear-gradient(135deg,#faf6ee,#ede5d8)', emoji: '👗' },
];

const QUIZ_QUESTIONS = [
  { q: 'Quelle palette de couleurs vous attire le plus ?', opts: [ { text: 'Neutres : beige, blanc, gris anthracite', scores: { minimaliste: 3, elegant: 1 } }, { text: 'Monochromes : tout en noir ou blanc', scores: { elegant: 2, minimaliste: 2 } }, { text: 'Saturées et vives', scores: { creatif: 3, streetwear: 1 } }, { text: 'Délavées et terreuses', scores: { boheme: 3, sportif: 1 } }, { text: 'Primaires et graphiques', scores: { streetwear: 3, creatif: 1 } }, { text: 'Techniques : bleu nuit, gris', scores: { sportif: 3, streetwear: 1 } } ] },
  { q: 'Comment décririez-vous votre style de vie ?', opts: [ { text: 'Urbain et dynamique', scores: { streetwear: 3, sportif: 1 } }, { text: 'Professionnel et ambitieux', scores: { elegant: 3, minimaliste: 1 } }, { text: 'Créatif et artistique', scores: { creatif: 3, boheme: 1 } }, { text: 'Simple et fonctionnel', scores: { minimaliste: 3, sportif: 1 } }, { text: 'Sportif et plein air', scores: { sportif: 3 } }, { text: 'Nomade et voyageur', scores: { boheme: 3, creatif: 1 } } ] },
  { q: 'Quel endroit vous ressemble le plus ?', opts: [ { text: 'Galeries d art', scores: { creatif: 3, elegant: 1 } }, { text: 'Terrains de sport', scores: { sportif: 3 } }, { text: 'Cafés créatifs', scores: { boheme: 2, creatif: 2 } }, { text: 'Bureaux coworking', scores: { minimaliste: 2, elegant: 2 } }, { text: 'Concerts, clubs', scores: { streetwear: 3 } }, { text: 'Dîners luxe', scores: { elegant: 3, minimaliste: 1 } } ] },
];

const save = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};
const load = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(window.localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('home');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState('Homme');
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [sortOption, setSortOption] = useState('compat');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [accountTab, setAccountTab] = useState('orders');
  const [checkoutFullName, setCheckoutFullName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutWilaya, setCheckoutWilaya] = useState('Alger');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutNote, setCheckoutNote] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const themeSaved = load(THEME_STORAGE_KEY, 'dark');
    setTheme(themeSaved);
    setView('home');
    setUsers(load(USER_STORAGE_KEY, []));
    setCart(load(CART_KEY, []));
    setOrders(load(ORDERS_KEY, []));

    const token = load('token', null);
    if (token) {
      fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.user) setCurrentUser(data.user); else save('token', null); })
        .catch(() => save('token', null));
    }
  }, []);

  useEffect(() => {
    save(THEME_STORAGE_KEY, theme);
    if (typeof window !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);
  useEffect(() => save(USER_STORAGE_KEY, users), [users]);
  useEffect(() => save(CURRENT_USER_KEY, currentUser), [currentUser]);
  useEffect(() => save(CART_KEY, cart), [cart]);
  useEffect(() => save(ORDERS_KEY, orders), [orders]);

  const showToast = (message, type = 'info') => {
    setToast(message); setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const getCompat = (product, profile) => {
    if (!profile) return null;
    if (product.styles.includes(profile)) return Math.floor(Math.random() * 15) + 85;
    const map = { minimaliste: ['elegant'], elegant: ['minimaliste', 'creatif'], streetwear: ['sportif', 'creatif'], creatif: ['boheme', 'elegant'], sportif: ['streetwear'], boheme: ['creatif', 'minimaliste'] };
    const related = map[profile] || []; 
    if (product.styles.some((s) => related.includes(s))) return Math.floor(Math.random() * 20) + 55;
    return Math.floor(Math.random() * 20) + 25;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product, size = null) => {
    const finalSize = size || (product.sizes?.[0] || 'N/A');
    const existing = cart.find((item) => item.id === product.id && item.size === finalSize);
    if (existing) setCart(cart.map((item) => item === existing ? { ...item, qty: item.qty + 1 } : item));
    else setCart([...cart, { id: product.id, size: finalSize, qty: 1 }]);
    showToast('Ajouté au panier ✓', 'success');
  };

  const doLogin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Erreur de connexion', 'error'); return; }
      save('token', data.token);
      setCurrentUser(data.user);
      showToast(`Bienvenue, ${data.user.name.split(' ')[0]} !`, 'success');
      if (data.user.isAdmin) return setView('admin');
      setView('catalog');
    } catch (err) {
      showToast('Erreur serveur', 'error');
    }
  };

  const doRegister = async (name, email, password, gender) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, gender }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Erreur inscription', 'error'); return; }
      showToast('Compte créé avec succès ! Connectez-vous.', 'success');
      setAuthMode('login');
      setAuthPassword('');
    } catch (err) {
      showToast('Erreur serveur', 'error');
    }
  };

  const doLogout = () => { 
    save('token', null);
    setCurrentUser(null); 
    setView('home'); 
    showToast('Déconnecté', 'info'); 
  };

  const toggleFavorite = (productId) => {
    if (!currentUser) { showToast('Connectez-vous pour ajouter aux favoris', 'error'); setView('auth'); setAuthMode('login'); return; }
    const prefs = currentUser.favorites || [];
    const isFav = prefs.includes(productId);
    const updatedFavorites = isFav ? prefs.filter((id) => id !== productId) : [...prefs, productId];
    const updatedUser = { ...currentUser, favorites: updatedFavorites };
    setCurrentUser(updatedUser);
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    showToast(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris', isFav ? 'info' : 'success');
  };

  const proceedQuiz = () => {
    if (selectedAnswerIndex === null) { showToast('Sélectionnez une réponse', 'error'); return; }
    const answer = QUIZ_QUESTIONS[quizStep].opts[selectedAnswerIndex].scores;
    const nextAnswers = [...quizAnswers, answer];
    setQuizAnswers(nextAnswers);
    setSelectedAnswerIndex(null);
    if (quizStep + 1 < QUIZ_QUESTIONS.length) return setQuizStep(quizStep + 1);
    const totals = Object.keys(PROFILES).reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
    nextAnswers.forEach((s) => Object.entries(s).forEach(([k, v]) => { totals[k] += v; }));
    const selected = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
    const updated = { ...currentUser, styleProfile: selected };
    setCurrentUser(updated);
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
    showToast(`Profil défini : ${PROFILES[selected].name}`, 'success');
    setView('catalog');
    setQuizStep(0); setQuizAnswers([]); setSelectedAnswerIndex(null);
  };

  const catalogProducts = useMemo(() => {
    let items = [...PRODUCTS];
    if (currentUser?.gender === 'Homme') items = items.filter(p => p.gender === 'Homme');
    else if (currentUser?.gender === 'Femme') items = items.filter(p => p.gender === 'Femme');

    if (catalogFilter !== 'all') {
      if (PROFILES[catalogFilter]) items = items.filter((p) => p.styles.includes(catalogFilter));
      else items = items.filter((p) => p.category === catalogFilter);
    }
    if (sortOption === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') items.sort((a, b) => b.price - a.price);
    if (sortOption === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOption === 'compat' && currentUser?.styleProfile) items.sort((a, b) => getCompat(b, currentUser.styleProfile) - getCompat(a, currentUser.styleProfile));
    return items;
  }, [catalogFilter, sortOption, currentUser]);

  const selectedProfileKey = currentUser?.styleProfile || null;
  const selectedProfile = selectedProfileKey ? PROFILES[selectedProfileKey] : null;
  const cartTotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id); return sum + (product?.price || 0) * item.qty;
  }, 0);
  const deliveryFee = cartTotal >= 8000 ? 0 : 500;

  const changeQuantity = (item, delta) => {
    setCart(cart.map((i) => i === item ? { ...i, qty: Math.max(1, i.qty + delta) } : i).filter((i) => i.qty > 0));
  };

  const removeFromCart = (item) => {
    setCart(cart.filter((i) => i !== item)); showToast('Produit retiré', 'info');
  };

  const submitOrder = (fullname, phone, wilaya, address, note) => {
    if (!fullname || !phone || !address) { showToast('Remplissez tous les champs obligatoires', 'error'); return; }
    const order = {
      id: `VES-${Date.now().toString(36).toUpperCase()}`,
      userId: currentUser?.id,
      items: cart.map((i) => {
        const p = PRODUCTS.find((x) => x.id === i.id); return { ...i, name: p?.name, price: p?.price };
      }),
      total: cartTotal + deliveryFee,
      status: 'pending', fullName: fullname, phone, wilaya, address, note,
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, order]); setCart([]); setView('account'); showToast('Commande confirmée ! 🎉', 'success');
  };

  const accountOrders = orders.filter((o) => o.userId === currentUser?.id);

  return (
    <>
      <Head>
        <title>RKN — La Mode Selon Votre Personnalité</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <nav id="navbar">
        <div className="brand" onClick={() => setView('home')}>RKN</div>
        <div className="nav-links">
          <a onClick={() => { setView('catalog'); setCatalogFilter('all'); }}>Catalogue</a>
          <a onClick={() => { setView('catalog'); setCatalogFilter('tenues'); }}>Tenues</a>
          <a onClick={() => setView('home')}>À propos</a>
        </div>
        <div className="nav-right">
          <div className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Mode clair/sombre">
            <span id="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </div>
          <div className="icon-btn" onClick={() => setView('cart')}>🛒
            <span className="cart-badge" id="cart-badge" style={{ display: cartCount > 0 ? 'flex' : 'none' }}>{cartCount}</span>
          </div>
          <div id="nav-user-section">
            {!currentUser && <div className="icon-btn" onClick={() => { setView('auth'); setAuthMode('login'); }} title="Connexion">👤</div>}
            {currentUser && <div className="icon-btn" onClick={() => setView('account')} title="Mon compte">👤</div>}
          </div>
          {currentUser?.isAdmin && <div id="nav-admin-btn"><div className="icon-btn" onClick={() => setView('admin')} title="Admin">⚙️</div></div>}
        </div>
      </nav>

      <div id="toast-container">
        {toast && <div className={`toast ${toastType}`}><span>{toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : 'ℹ'}</span>{toast}</div>}
      </div>

      {view === 'home' && (
        <div id="home-view" className="view active">
          <section id="hero">
            <div className="hero-bg" />
            <div className="hero-content">
              <div className="hero-label">La Mode Personnalisée</div>
              <h1 className="hero-title">Habillé selon<br /><em>votre âme</em></h1>
              <p className="hero-desc">Découvrez des vêtements qui vous ressemblent vraiment. Un quiz, un profil, un style — entièrement à vous.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => { if (!currentUser) { setView('auth'); setAuthMode('register'); } else { setView('quiz'); } }}>Découvrir mon style</button>
                <button className="btn btn-outline" onClick={() => { setView('catalog'); }}>Explorer le catalogue</button>
              </div>
              <div className="hero-stats">
                <div><div className="stat-num">6</div><div className="stat-label">Profils de style</div></div>
                <div><div className="stat-num">200+</div><div className="stat-label">Pièces disponibles</div></div>
                <div><div className="stat-num">48h</div><div className="stat-label">Livraison express</div></div>
              </div>
            </div>
          </section>

          <div className="section">
            <div className="section-header">
              <div className="section-label">Comment ça marche</div>
              <h2 className="section-title">Mode intelligente,<br /><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>choix naturels</em></h2>
            </div>
            <div className="feature-grid">
              <div className="feature-card"><div className="feature-icon">🧬</div><div className="feature-title">Quiz de personnalité</div><div className="feature-desc">10 questions sur vos goûts, votre style de vie et vos couleurs préférées. Un profil généré en quelques minutes.</div></div>
              <div className="feature-card"><div className="feature-icon">✨</div><div className="feature-title">Recommandations sur mesure</div><div className="feature-desc">Le catalogue se filtre automatiquement selon votre profil. Chaque pièce affiche son pourcentage de compatibilité avec vous.</div></div>
              <div className="feature-card"><div className="feature-icon">📦</div><div className="feature-title">Paiement à la livraison</div><div className="feature-desc">Aucun risque, aucun paiement en ligne. Vous payez uniquement quand votre commande arrive chez vous.</div></div>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div><div className="section-label">Sélection</div><h2 className="section-title" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>Nouvelles arrivées</h2></div>
              <button className="btn btn-outline btn-sm" onClick={() => setView('catalog')}>Voir tout →</button>
            </div>
            <div className="grid-4">
              {PRODUCTS.slice(0, 8).map((p) => (
                <div key={p.id} className="card product-card" onClick={() => { setSelectedProduct(p); setView('product'); }}>
                  <div className="product-img"><img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} /></div>
                  <div className="product-info"><div className="product-style-tag">{p.styles.map((s) => PROFILES[s]?.name || s).join(' · ')}</div><div className="product-name">{p.name}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}><div className="product-price">{p.price.toLocaleString('fr-DZ')} DA</div></div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', maxWidth: '100%', padding: '80px 32px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div className="section-header" style={{ textAlign: 'center' }}>
                <div className="section-label">Vos profils</div>
                <h2 className="section-title">Quel style êtes-vous ?</h2>
                <p className="section-sub" style={{ margin: '12px auto 0', textAlign: 'center' }}>Six archétypes de mode, chacun avec sa philosophie, ses couleurs, ses pièces emblématiques.</p>
              </div>
              <div id="profiles-grid" className="grid-3">
                {Object.entries(PROFILES).map(([k, p]) => (
                  <div key={k} className="card" style={{ padding: '28px', cursor: 'pointer' }} onClick={() => { setCatalogFilter(k); setView('catalog'); }}>
                    <div style={{ fontSize: 36, marginBottom: 16 }}>{p.emoji}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 8, color: p.color }}>{p.name}</div>
                    <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{p.traits.map((t) => <span key={t} className="trait-tag" style={{ color: p.color, borderColor: `${p.color}44` }}>{t}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <footer>
            <div className="footer-inner">
              <div><div className="footer-brand">RKN</div><div className="footer-tagline">La mode selon votre personnalité · Alger, Algérie</div></div>
              <div className="footer-copy">© 2025 RKN. Tous droits réservés.</div>
            </div>
          </footer>
        </div>
      )}

      {view === 'auth' && (
        <div id="auth-view" className="view active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 440, padding: '32px 16px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32, cursor: 'pointer' }} onClick={() => setView('home')}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 4, color: 'var(--accent)' }}>RKN</div>
            </div>
            <div className="auth-box">
              {authMode === 'login' ? (
                <>
                  <div className="auth-title">Connexion</div>
                  <p className="auth-sub">Retrouvez vos recommandations personnalisées</p>
                  <div className="auth-form">
                    <div className="field"><label>Email</label><input type="email" value={authEmail} onChange={(e)=>setAuthEmail(e.target.value)} placeholder="votre@email.com" /></div>
                    <div className="field"><label>Mot de passe</label><input type="password" value={authPassword} onChange={(e)=>setAuthPassword(e.target.value)} placeholder="••••••••" /></div>
                    <button className="btn btn-primary btn-full" onClick={() => doLogin(authEmail.trim(), authPassword)}>Se connecter</button>
                  </div>
                  <div className="auth-switch">Pas encore de compte ? <span onClick={() => { setAuthMode('register'); setAuthEmail(''); setAuthPassword(''); }}>Créer un compte</span></div>
                </>
              ) : (
                <>
                  <div className="auth-title">Créer un compte</div>
                  <p className="auth-sub">Commencez votre parcours de style personnalisé</p>
                  <div className="auth-form">
                    <div className="field"><label>Nom complet</label><input type="text" value={regName} onChange={(e)=>setRegName(e.target.value)} placeholder="Votre nom" /></div>
                    <div className="field"><label>Email</label><input type="email" value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} placeholder="votre@email.com" /></div>
                    <div className="field"><label>Sexe</label><div style={{ display: 'flex', gap: 16 }}><label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="radio" name="gender" value="Homme" checked={regGender === 'Homme'} onChange={(e)=>setRegGender(e.target.value)} /> Homme</label><label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="radio" name="gender" value="Femme" checked={regGender === 'Femme'} onChange={(e)=>setRegGender(e.target.value)} /> Femme</label></div></div>
                    <div className="field"><label>Mot de passe</label><input type="password" value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} placeholder="Minimum 6 caractères" /></div>
                    <button className="btn btn-primary btn-full" onClick={() => { doRegister(regName.trim(), regEmail.trim(), regPassword, regGender); setRegName(''); setRegEmail(''); setRegPassword(''); }}>Créer mon compte</button>
                  </div>
                  <div className="auth-switch">Déjà un compte ? <span onClick={() => { setAuthMode('login'); setAuthEmail(''); setAuthPassword(''); }}>Se connecter</span></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'quiz' && (
        <div id="quiz-view" className="view active">
          <div className="quiz-progress"><div className="quiz-progress-bar" style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
          <div className="quiz-container">
            <div className="quiz-step active">
              <div className="quiz-q-num">Question {quizStep + 1} / {QUIZ_QUESTIONS.length}</div>
              <div className="quiz-question">{QUIZ_QUESTIONS[quizStep]?.q}</div>
              <div className="quiz-options">
                {QUIZ_QUESTIONS[quizStep]?.opts.map((opt, idx) => (
                  <div key={idx} className={`quiz-option ${selectedAnswerIndex === idx ? 'selected' : ''}`} onClick={() => setSelectedAnswerIndex(idx)}>
                    <div className="quiz-option-letter">{String.fromCharCode(65 + idx)}</div>
                    <div className="quiz-option-text">{opt.text}</div>
                  </div>
                ))}
              </div>
              <div className="quiz-nav">
                {quizStep > 0 ? <button className="btn btn-ghost btn-sm" onClick={() => { setQuizStep(quizStep - 1); setSelectedAnswerIndex(null); }}>← Précédent</button> : <div />}
                <button className="btn btn-primary btn-sm" onClick={proceedQuiz} style={{ opacity: selectedAnswerIndex === null ? 0.5 : 1, pointerEvents: selectedAnswerIndex === null ? 'none' : 'auto' }}>
                  {quizStep < QUIZ_QUESTIONS.length - 1 ? 'Suivant →' : 'Voir mon profil ✦'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'catalog' && (
        <div id="catalog-view" className="view active">
          <div className="catalog-header">
            <div className="breadcrumb"><span onClick={() => setView('home')}>Accueil</span><span style={{ color: 'var(--border)' }}>/</span><span style={{ color: 'var(--text)' }}>Catalogue</span></div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400 }}>Catalogue</h1>
            <div className="catalog-controls">
              <div className="filter-chips">
                {['all','hauts','bas','vestes','robes'].map((cat) => (
                  <div key={cat} className={`chip ${catalogFilter === cat ? 'active' : ''}`} onClick={() => setCatalogFilter(cat)}>{cat === 'all' ? 'Tout' : cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                ))}
                <div style={{ width: '1px', background: 'var(--border)', height: '24px', margin: '0 4px' }} />
                {Object.entries(PROFILES).map(([key, pf]) => (
                  <div key={key} className={`chip ${catalogFilter === key ? 'active' : ''}`} style={{ color: pf.color, borderColor: `${pf.color}44` }} onClick={() => setCatalogFilter(key)}>{pf.emoji} {pf.name}</div>
                ))}
              </div>
              <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="compat">Compatibilité ↓</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A→Z</option>
              </select>
            </div>
          </div>
          <div className="catalog-body">
            {selectedProfile ? (
              <div className="profile-banner">
                <div className="profile-banner-icon">{selectedProfile.emoji}</div>
                <div className="profile-banner-text"><h3>Votre style : {selectedProfile.name}</h3><p>Le catalogue est filtré selon votre profil.</p></div>
                <button className="btn btn-outline btn-sm" onClick={() => { setView('quiz'); setQuizStep(0); }}>Modifier mon profil</button>
              </div>
            ) : currentUser ? (
              <div className="no-profile-banner"><div><strong>Personnalisez votre catalogue</strong><br /><span style={{ fontSize: 13, color: 'var(--text2)' }}>Passez le quiz.</span></div><button className="btn btn-primary btn-sm" onClick={() => { setView('quiz'); setQuizStep(0); }}>Passer le quiz ✦</button></div>
            ) : null}
            <div className="grid-4">
              {catalogProducts.length ? catalogProducts.map((p) => {
                const compat = currentUser?.styleProfile ? getCompat(p, currentUser.styleProfile) : null;
                return (
                  <div key={p.id} className="card product-card" onClick={() => { setSelectedProduct(p); setSelectedSize(p.sizes?.[0] || null); setView('product'); }}>
                    <div className="product-img"><img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} /></div>
                    <div className="product-info"><div className="product-style-tag">{p.styles.map((s) => PROFILES[s]?.name || s).join(' · ')}</div><div className="product-name">{p.name}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}><div className="product-price">{p.price.toLocaleString('fr-DZ')} DA</div>{compat !== null && <div className="compat-badge">✦ {compat}%</div>}</div>{compat !== null && <div className="compat-bar"><div className="compat-bar-fill" style={{ width: `${compat}%` }} /></div>}</div>
                  </div>
                );
              }) : <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">Aucun produit</div><p style={{ color: 'var(--text2)' }}>Essayez un autre filtre.</p></div>}
            </div>
          </div>
        </div>
      )}

      {view === 'product' && selectedProduct && (
        <div id="detail-view" className="view active">
          <div className="detail-container">
            <div className="detail-img-wrap">
              <div className="detail-main-img"><img src={selectedProduct.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={selectedProduct.name} /></div>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>{[1,2,3].map((v) => <img key={v} src={selectedProduct.imageUrl} style={{ width: 80, height: 100, flexShrink:0, borderRadius:2, border:'1px solid var(--border)', objectFit: 'cover', opacity:0.7 }} alt="" />)}</div>
            </div>
            <div>
              <div className="back-btn" onClick={() => setView('catalog')}>← Retour au catalogue</div>
              <div className="detail-brand">{selectedProduct.styles.map((s) => PROFILES[s]?.name || s).join(' · ')}</div>
              <h1 className="detail-title">{selectedProduct.name}</h1>
              <div className="detail-price">{selectedProduct.price.toLocaleString('fr-DZ')} DA</div>
              {selectedProfile && <div className="detail-compat">✦ Compatibilité {getCompat(selectedProduct, selectedProfileKey)}% avec votre profil {selectedProfile.name}</div>}
              <p className="detail-desc">{selectedProduct.description}</p>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 12 }}>Sélectionner la taille</div>
                <div className="size-grid">{selectedProduct.sizes.map((s) => <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>)}</div>
              </div>
              <div className="detail-actions">
                <button className="btn btn-primary btn-full" onClick={() => addToCart(selectedProduct, selectedSize)}>Ajouter au panier</button>
                <button className="btn btn-outline btn-full" onClick={() => toggleFavorite(selectedProduct.id)}>{currentUser?.favorites?.includes(selectedProduct.id) ? '❤️ Dans les favoris' : '🤍 Ajouter aux favoris'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'cart' && (
        <div id="cart-view" className="view active">
          <div className="cart-container">
            <div className="back-btn" onClick={() => setView('catalog')}>← Continuer les achats</div>
            <h1 className="cart-title">Mon Panier</h1>
            <div id="cart-content">
              {cart.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">🛒</div><div className="empty-title">Votre panier est vide</div><p style={{ color: 'var(--text2)', margin: '8px 0 24px' }}>Explorez notre catalogue pour trouver vos pièces parfaites.</p><button className="btn btn-primary" onClick={() => setView('catalog')}>Découvrir le catalogue</button></div>
              ) : (
                <>
                  {cart.map((item, idx) => {
                    const p = PRODUCTS.find((x) => x.id === item.id);
                    if (!p) return null;
                    return (
                      <div key={`${item.id}-${item.size}-${idx}`} className="cart-item">
                        <div className="cart-item-img"><img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} /></div>
                        <div className="cart-item-info"><div className="cart-item-name">{p.name}</div><div className="cart-item-meta">Taille: {item.size}</div><div className="cart-item-price">{p.price.toLocaleString('fr-DZ')} DA</div><div className="qty-control"><div className="qty-btn" onClick={() => changeQuantity(item, -1)}>−</div><div className="qty-num">{item.qty}</div><div className="qty-btn" onClick={() => changeQuantity(item, 1)}>+</div><span style={{ marginLeft: 8, fontSize: 12, color: 'var(--red)', cursor: 'pointer' }} onClick={() => removeFromCart(item)}>Supprimer</span></div></div><div style={{ fontWeight: 500, color: 'var(--accent)', fontSize: 15 }}>{(p.price * item.qty).toLocaleString('fr-DZ')} DA</div>
                      </div>
                    );
                  })}
                  <div className="cart-summary"><div className="cart-row"><span>Sous-total</span><span>{cartTotal.toLocaleString('fr-DZ')} DA</span></div><div className="cart-row"><span>Livraison</span><span>{deliveryFee === 0 ? 'Gratuite' : `${deliveryFee} DA`}</span></div><div className="cart-row total"><span>Total</span><span>{(cartTotal + deliveryFee).toLocaleString('fr-DZ')} DA</span></div><button className="btn btn-primary btn-full" style={{ marginTop: 20 }} onClick={() => { if (!currentUser) { showToast('Connectez-vous pour commander', 'error'); setView('auth'); setAuthMode('login'); return; } setView('checkout'); }}>{cart.length ? 'Commander →' : 'Panier vide'}</button><div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text2)' }}>💳 Paiement à la livraison uniquement</div></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'checkout' && (
        <div id="checkout-view" className="view active">
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 32px' }}>
            <div className="back-btn" onClick={() => setView('cart')}>← Retour au panier</div>
            <h1 className="checkout-title">Finaliser la commande</h1>
            <div className="checkout-container">
              <div className="checkout-form-section">
                <div className="field"><label>Nom complet</label><input type="text" value={checkoutFullName} onChange={(e) => setCheckoutFullName(e.target.value)} placeholder="Prénom Nom" /></div>
                <div className="field"><label>Téléphone</label><input type="tel" value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} placeholder="+213 XX XX XX XX" /></div>
                <div className="field"><label>Wilaya</label><select value={checkoutWilaya} onChange={(e) => setCheckoutWilaya(e.target.value)} className="sort-select"><option>Alger</option><option>Oran</option><option>Constantine</option><option>Annaba</option><option>Béjaïa</option><option>Sétif</option><option>Tlemcen</option><option>Blida</option><option>Batna</option><option>Autre</option></select></div>
                <div className="field"><label>Adresse complète</label><input type="text" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} placeholder="Rue, numéro, quartier..." /></div>
                <div className="field"><label>Note (optionnel)</label><textarea rows={3} value={checkoutNote} onChange={(e) => setCheckoutNote(e.target.value)} placeholder="Instructions spéciales..." /></div>
                <button className="btn btn-primary btn-full" onClick={() => submitOrder(checkoutFullName, checkoutPhone, checkoutWilaya, checkoutAddress, checkoutNote)}>Confirmer la commande →</button>
              </div>
              <div className="checkout-summary">
                <div className="cart-row"><span>Produits ({cart.length})</span><span>{cartTotal.toLocaleString('fr-DZ')} DA</span></div>
                <div className="cart-row"><span>Livraison</span><span>{deliveryFee === 0 ? 'Gratuite' : `${deliveryFee} DA`}</span></div>
                <div className="cart-row total"><span>Total</span><span>{(cartTotal + deliveryFee).toLocaleString('fr-DZ')} DA</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'account' && (
        <div id="account-view" className="view active">
          <div className="account-layout">
            <aside className="account-sidebar">
              <div className="account-avatar">{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</div>
              <div className="account-name">{currentUser?.name}</div>
              <div className="account-email">{currentUser?.email}</div>
              <div className="account-menu">
                {['orders', 'profile', 'favorites', 'settings'].map((tab) => (
                  <div key={tab} className={`account-menu-item ${accountTab === tab ? 'active' : ''}`} onClick={() => setAccountTab(tab)}>{tab === 'orders' ? '📦 Commandes' : tab === 'profile' ? '👤 Profil & Style' : tab === 'favorites' ? '❤️ Favoris' : '⚙️ Paramètres'}</div>
                ))}
                <div className="account-menu-item" style={{ marginTop: 16, color: 'var(--red)' }} onClick={() => doLogout()}>↩️ Déconnexion</div>
              </div>
            </aside>
            <main id="account-main">
              {accountTab === 'orders' && (
                <div className="account-tab active">
                  <div className="account-tab-title">Mes Commandes</div>
                  {accountOrders.length === 0 ? <div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">Aucune commande</div><p style={{ color: 'var(--text2)' }}>Vos commandes apparaîtront ici.</p><button className="btn btn-primary" onClick={() => setView('catalog')}>Commencer mes achats</button></div> : accountOrders.slice().reverse().map((o) => <div key={o.id} className="order-card"><div className="order-header"><div><div className="order-id"># {o.id}</div><div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div></div><span className={`order-status status-${o.status}`}>{o.status}</span></div><div className="order-items">{o.items.map((it)=>`${it.name} ×${it.qty} (${it.size})`).join(', ')}</div><div className="order-total">{o.total.toLocaleString('fr-DZ')} DA · {o.wilaya} · {o.fullName}</div></div>)}
                </div>
              )}
              {accountTab === 'profile' && (
                <div className="account-tab active">
                  <div className="account-tab-title">Mon Profil & Style</div>
                  {selectedProfile ? (<div style={{ textAlign: 'center', padding: 40, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 24 }}><div style={{ fontSize: 48, marginBottom: 12 }}>{selectedProfile.emoji}</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: selectedProfile.color, marginBottom: 8 }}>{selectedProfile.name}</div><div style={{ color: 'var(--text2)', maxWidth: 400, margin: '0 auto 20px', fontSize: 13, lineHeight: 1.7 }}>{selectedProfile.desc}</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 }}>{selectedProfile.traits.map((t) => <span key={t} className="trait-tag" style={{ color: selectedProfile.color, borderColor: `${selectedProfile.color}44` }}>{t}</span>)}</div><button className="btn btn-outline btn-sm" onClick={() => { setView('quiz'); setQuizStep(0); }}>Modifier mon profil</button></div>) : (<div className="no-profile-banner" style={{ flexDirection: 'column', textAlign: 'center', padding: 40 }}><div style={{ fontSize: 48, marginBottom: 16 }}>🧬</div><div className="account-tab-title" style={{ fontSize: 22, marginBottom: 8 }}>Aucun profil</div><p style={{ color: 'var(--text2)', marginBottom: 20 }}>Passez le quiz pour obtenir recommandations personnalisées.</p><button className="btn btn-primary" onClick={() => { setView('quiz'); setQuizStep(0); }}>Passer le quiz ✦</button></div>) }
                </div>
              )}
              {accountTab === 'favorites' && (
                <div className="account-tab active">
                  <div className="account-tab-title">Mes Favoris</div>
                  {(!currentUser?.favorites?.length) ? <div className="empty-state"><div className="empty-icon">❤️</div><div className="empty-title">Aucun favori</div><p style={{ color: 'var(--text2)' }}>Ajoutez des produits à vos favoris.</p></div> : <div className="grid-3">{PRODUCTS.filter((p) => currentUser.favorites.includes(p.id)).map((p) => <div key={p.id} className="card product-card" onClick={() => { setSelectedProduct(p); setSelectedSize(p.sizes?.[0]||null); setView('product'); }}>{/* same card content */}<div className="product-img"><img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} /></div><div className="product-info"><div className="product-style-tag">{p.styles.map((s)=>PROFILES[s]?.name||s).join(' · ')}</div><div className="product-name">{p.name}</div><div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px' }}><div className="product-price">{p.price.toLocaleString('fr-DZ')} DA</div></div></div></div>)}</div>}
                </div>
              )}
              {accountTab === 'settings' && (
                <div className="account-tab active"><div className="account-tab-title">Paramètres</div><div className="card" style={{ padding: 28, maxWidth: 480 }}><div style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 20 }}>Informations personnelles</div><div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}><div className="field"><label>Nom complet</label><input type="text" value={currentUser?.name || ''} onChange={(e)=>{ const u={...currentUser,name:e.target.value}; setCurrentUser(u); setUsers(users.map((x)=>x.id===u.id?u:x)); }} /></div><div className="field"><label>Email</label><input type="email" value={currentUser?.email || ''} disabled style={{ opacity: 0.6 }} /></div><div className="field"><label>Téléphone</label><input type="text" value={currentUser?.phone || ''} onChange={(e)=>{ const u={...currentUser,phone:e.target.value}; setCurrentUser(u); setUsers(users.map((x)=>x.id===u.id?u:x)); }} placeholder="+213 XX XX XX XX" /></div><button className="btn btn-primary btn-sm" onClick={() => showToast('Paramètres enregistrés','success')}>Enregistrer</button></div></div></div>
              )}
            </main>
          </div>
        </div>
      )}

      {view === 'admin' && currentUser?.isAdmin && (
        <div id="admin-view" className="view active">
          <div className="admin-layout">
            <aside className="admin-sidebar">
              <div className="admin-sidebar-title">Panneau Admin</div>
              {['dashboard','products','orders','users','stats'].map((tab) => (<div key={tab} className={`admin-nav-item ${accountTab === tab ? 'active' : ''}`} onClick={() => setAccountTab(tab)}>{tab === 'dashboard' ? '📊 Tableau de bord' : tab === 'products' ? '👗 Produits' : tab === 'orders' ? '📦 Commandes' : tab === 'users' ? '👥 Clients' : '📈 Statistiques'}</div>))}
            </aside>
            <main className="admin-content">
              <div className="admin-tab active">Tableau de bord admin simplifié (démo).</div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
