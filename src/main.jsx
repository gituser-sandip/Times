import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const asset = (path) => new URL(path, import.meta.url).href;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://times-oetk.onrender.com/api';

async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
  } catch (error) {
    throw Object.assign(new Error('Laravel API is not reachable.'), { isNetworkError: true, cause: error });
  }

  const data = await response.json().catch(() => ({ message: response.statusText || 'Request failed' }));
  if (!response.ok) {
    throw Object.assign(new Error(data.message || 'Request failed'), {
      errors: data.errors || {},
      status: response.status,
    });
  }
  return data;
}

const getStoredJson = (key, fallback = null) => {
  try {
    const value = globalThis.localStorage?.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // Ignore storage cleanup failures.
    }
    return fallback;
  }
};

const getStoredText = (key, fallback = '') => {
  try {
    return globalThis.localStorage?.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const setStoredValue = (key, value) => {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // The app still works without persistent browser storage.
  }
};

const removeStoredValue = (key) => {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    // Ignore storage cleanup failures.
  }
};

const normalizeProduct = (product) => ({
  ...product,
  oldPrice: Number(product.oldPrice ?? product.old_price ?? product.price ?? 0),
  price: Number(product.price ?? 0),
  rating: Number(product.rating ?? 0),
  stock: Number(product.stock ?? 0),
  image: product.image?.startsWith('/') ? product.image : product.image || initialProducts[0].image,
});

const getErrorMessage = (error) => {
  const firstFieldError = Object.values(error.errors || {})[0]?.[0];
  return firstFieldError || error.message || 'Something went wrong.';
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>The storefront hit an unexpected UI error. Refresh the page to recover.</p>
          <button type="button" onClick={() => window.location.reload()}>Refresh page</button>
        </main>
      );
    }

    return this.props.children;
  }
}

const initialProducts = [
  {
    id: 1,
    name: 'Rolex GMT Master II',
    brand: 'Rolex',
    category: 'Men',
    price: 31000,
    oldPrice: 34500,
    rating: 4.9,
    image: asset('../images/GMT MASTER II.png'),
    tag: 'Best Seller',
    caseSize: '40 mm',
    movement: 'Automatic',
    stock: 6,
    waterResistance: '100 m',
    warranty: '24 months',
    delivery: '2-4 business days',
  },
  {
    id: 2,
    name: 'Patek Philippe Aquanaut',
    brand: 'Patek Philippe',
    category: 'Men',
    price: 15400,
    oldPrice: 16850,
    rating: 4.8,
    image: asset('../pages/product/images/patek-philipe/aquanaut.webp'),
    tag: 'Collector Pick',
    caseSize: '41 mm',
    movement: 'Automatic',
    stock: 4,
    waterResistance: '120 m',
    warranty: '18 months',
    delivery: '3-5 business days',
  },
  {
    id: 3,
    name: 'Cartier Crash',
    brand: 'Cartier',
    category: 'Women',
    price: 21000,
    oldPrice: 23900,
    rating: 4.7,
    image: asset('../pages/product/images/cartier/crash.webp'),
    tag: 'Rare',
    caseSize: '38 mm',
    movement: 'Manual',
    stock: 2,
    waterResistance: '30 m',
    warranty: '12 months',
    delivery: '2-4 business days',
  },
  {
    id: 4,
    name: 'Omega De Ville Prestige',
    brand: 'Omega',
    category: 'Men',
    price: 19000,
    oldPrice: 21000,
    rating: 4.6,
    image: asset('../pages/product/images/omega/de-ville-prestige.webp'),
    tag: 'New Arrival',
    caseSize: '39.5 mm',
    movement: 'Co-Axial',
    stock: 8,
    waterResistance: '30 m',
    warranty: '24 months',
    delivery: '2-3 business days',
  },
  {
    id: 5,
    name: 'Rolex Oyster Perpetual',
    brand: 'Rolex',
    category: 'Women',
    price: 12600,
    oldPrice: 13800,
    rating: 4.8,
    image: asset('../pages/product/images/rolex/oyster-perpetual.webp'),
    tag: 'Everyday',
    caseSize: '36 mm',
    movement: 'Automatic',
    stock: 9,
    waterResistance: '100 m',
    warranty: '24 months',
    delivery: '2-4 business days',
  },
  {
    id: 6,
    name: 'Cartier Tank',
    brand: 'Cartier',
    category: 'Women',
    price: 11800,
    oldPrice: 13000,
    rating: 4.7,
    image: asset('../pages/product/images/cartier/tank.webp'),
    tag: 'Icon',
    caseSize: '33 mm',
    movement: 'Quartz',
    stock: 5,
    waterResistance: '30 m',
    warranty: '18 months',
    delivery: '2-4 business days',
  },
  {
    id: 7,
    name: 'Omega Speedmaster Racing',
    brand: 'Omega',
    category: 'Men',
    price: 17200,
    oldPrice: 18900,
    rating: 4.5,
    image: asset('../pages/product/images/omega/speedmaster-racing.webp'),
    tag: 'Sport',
    caseSize: '44.25 mm',
    movement: 'Chronograph',
    stock: 7,
    waterResistance: '50 m',
    warranty: '24 months',
    delivery: '3-5 business days',
  },
  {
    id: 8,
    name: 'Patek Philippe Twenty~4',
    brand: 'Patek Philippe',
    category: 'Women',
    price: 15000,
    oldPrice: 16700,
    rating: 4.6,
    image: asset('../pages/product/images/patek-philipe/twenty~4.webp'),
    tag: 'Elegant',
    caseSize: '36 mm',
    movement: 'Automatic',
    stock: 3,
    waterResistance: '30 m',
    warranty: '18 months',
    delivery: '3-5 business days',
  },
];

const initialReviews = {
  1: [
    { name: 'Aarav', rating: 5, text: 'Arrived beautifully packed and exactly as described.' },
    { name: 'Maya', rating: 5, text: 'The condition check gave me confidence before buying.' },
  ],
  3: [{ name: 'Lina', rating: 5, text: 'A standout piece and the checkout felt effortless.' }],
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('All');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [compare, setCompare] = useState([]);
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewDraft, setReviewDraft] = useState({ name: '', rating: 5, text: '' });
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeAccountTab, setActiveAccountTab] = useState('signin');
  const [user, setUser] = useState(() => getStoredJson('times_user'));
  const [authToken, setAuthToken] = useState(() => getStoredText('times_token'));
  const [authDraft, setAuthDraft] = useState({ name: '', email: '', password: '' });
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [checkoutDraft, setCheckoutDraft] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    payment: 'Card',
    cardNumber: '',
    expiry: '',
  });
  const [orderMessage, setOrderMessage] = useState('');
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [lastOrderCustomer, setLastOrderCustomer] = useState('');
  const [apiStatus, setApiStatus] = useState('Using local demo data until Laravel API is running.');

  useEffect(() => {
    apiRequest('/products')
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length) {
          const apiProducts = data.products.map(normalizeProduct);
          const apiReviews = apiProducts.reduce((nextReviews, product) => {
            if (Array.isArray(product.reviews)) {
              nextReviews[product.id] = product.reviews.map((review) => ({
                name: review.name,
                rating: Number(review.rating),
                text: review.text,
              }));
            }
            return nextReviews;
          }, {});
          setProducts(apiProducts);
          setReviews((currentReviews) => ({ ...currentReviews, ...apiReviews }));
          setSelectedProduct(apiProducts[0]);
          setApiStatus('Connected to Laravel API.');
        }
      })
      .catch(() => setApiStatus('Using local demo data until Laravel API is running.'));
  }, []);

  const brands = useMemo(() => ['All', ...new Set(products.map((product) => product.brand))], [products]);
  const categories = ['All', 'Men', 'Women'];

  const filteredProducts = useMemo(() => {
    const matches = products.filter((product) => {
      const text = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      return (
        text.includes(query.toLowerCase()) &&
        (brand === 'All' || product.brand === brand) &&
        (category === 'All' || product.category === category)
      );
    });

    return [...matches].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return a.id - b.id;
    });
  }, [brand, category, products, query, sort]);

  const selectedReviews = reviews[selectedProduct.id] || [];
  const modalReviews = reviews[modalProduct?.id] || [];
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));
  const compareProducts = products.filter((product) => compare.includes(product.id));
  const shippingComplete = Boolean(checkoutDraft.fullName && checkoutDraft.email && checkoutDraft.address && checkoutDraft.city);
  const paymentComplete = checkoutDraft.payment !== 'Card' || Boolean(checkoutDraft.cardNumber && checkoutDraft.expiry);
  const checkoutDisplayTotal = checkoutStep === 'confirmation' && lastOrderTotal ? lastOrderTotal : cartTotal;
  const checkoutSteps = [
    { id: 'cart', label: 'Cart' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmation', label: 'Confirm' },
  ];

  const openProduct = (product) => {
    setSelectedProduct(product);
    setModalProduct(product);
  };

  const openAccount = () => {
    setActiveAccountTab(user ? 'account' : 'signin');
    setAccountOpen(true);
  };

  const addToCart = (product) => {
    setSelectedProduct(product);
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setOrderMessage('');
    setCheckoutStep('cart');
    setCartOpen(true);
  };

  const updateQuantity = (id, nextQuantity) => {
    setCart((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, Math.min(nextQuantity, item.stock)) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleWishlist = (id) => {
    setWishlist((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const toggleCompare = (id) => {
    setCompare((items) => {
      if (items.includes(id)) return items.filter((item) => item !== id);
      if (items.length >= 3) return [...items.slice(1), id];
      return [...items, id];
    });
  };

  const submitCheckout = async (event) => {
    event.preventDefault();
    if (!cart.length) {
      setOrderMessage('Add a watch to your cart before checkout.');
      setCheckoutStep('cart');
      return;
    }

    if (!checkoutDraft.fullName || !checkoutDraft.email || !checkoutDraft.address || !checkoutDraft.city) {
      setOrderMessage('Complete shipping details before placing the order.');
      setCheckoutStep('shipping');
      return;
    }

    if (!paymentComplete) {
      setOrderMessage('Complete payment details before placing the order.');
      setCheckoutStep('payment');
      return;
    }

    try {
      await apiRequest('/orders', {
        method: 'POST',
        token: authToken,
        body: JSON.stringify({
          customer: checkoutDraft,
          items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        }),
      });
      setApiStatus('Order saved to Laravel API.');
    } catch (error) {
      setApiStatus(
        error.isNetworkError
          ? 'Laravel API unavailable, so this order stayed in the browser demo.'
          : `Order was not saved: ${getErrorMessage(error)}`,
      );
      if (!error.isNetworkError) return;
    }
    setLastOrderTotal(cartTotal);
    setLastOrderCustomer(checkoutDraft.fullName);
    setOrderMessage(`Order confirmed for ${checkoutDraft.fullName}. Total paid: ${formatCurrency(cartTotal)}.`);
    setCart([]);
    setCheckoutStep('confirmation');
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    const endpoint = activeAccountTab === 'register' ? '/register' : '/login';
    const fallbackName = authDraft.email.split('@')[0] || 'Guest';
    try {
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(authDraft),
      });
      setUser(data.user);
      setAuthToken(data.token);
      setStoredValue('times_user', JSON.stringify(data.user));
      setStoredValue('times_token', data.token);
      setApiStatus('Signed in through Laravel API.');
    } catch (error) {
      if (!error.isNetworkError) {
        setApiStatus(`Sign in failed: ${getErrorMessage(error)}`);
        return;
      }
      const demoUser = { name: authDraft.name || fallbackName, email: authDraft.email || 'guest@times.test' };
      setUser(demoUser);
      setStoredValue('times_user', JSON.stringify(demoUser));
      setApiStatus('Laravel API unavailable, so demo login was used.');
    }
    setAuthDraft({ name: '', email: '', password: '' });
    setActiveAccountTab('account');
  };

  const signOut = () => {
    setUser(null);
    setAuthToken('');
    setActiveAccountTab('signin');
    removeStoredValue('times_user');
    removeStoredValue('times_token');
  };

  const submitReview = async (event, productId = selectedProduct.id) => {
    event.preventDefault();
    if (!reviewDraft.name || !reviewDraft.text) return;
    try {
      await apiRequest(`/products/${productId}/reviews`, {
        method: 'POST',
        token: authToken,
        body: JSON.stringify(reviewDraft),
      });
      setApiStatus('Review saved to Laravel API.');
    } catch (error) {
      setApiStatus(
        error.isNetworkError
          ? 'Laravel API unavailable, so the review stayed in local state.'
          : `Review was not saved: ${getErrorMessage(error)}`,
      );
      if (!error.isNetworkError) return;
    }
    setReviews((current) => ({
      ...current,
      [productId]: [...(current[productId] || []), reviewDraft],
    }));
    setReviewDraft({ name: '', rating: 5, text: '' });
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const continueToPayment = () => {
    if (!cart.length) {
      setOrderMessage('Add a watch to your bag before checkout.');
      setCheckoutStep('cart');
      return;
    }

    if (!shippingComplete) {
      setOrderMessage('Complete all shipping fields before continuing.');
      return;
    }
    setOrderMessage('');
    setCheckoutStep('payment');
  };

  const goToCheckoutStep = (step) => {
    if (step === 'cart') {
      setCheckoutStep('cart');
      return;
    }

    if (step === 'shipping') {
      if (!cart.length && checkoutStep !== 'confirmation') {
        setOrderMessage('Add a watch to your bag before checkout.');
        setCheckoutStep('cart');
        return;
      }
      setOrderMessage('');
      setCheckoutStep('shipping');
      return;
    }

    if (step === 'payment') {
      if (!cart.length) {
        setOrderMessage('Add a watch to your bag before checkout.');
        setCheckoutStep('cart');
        return;
      }

      if (!shippingComplete) {
        setOrderMessage('Complete shipping details before payment.');
        setCheckoutStep('shipping');
        return;
      }
      setOrderMessage('');
      setCheckoutStep('payment');
      return;
    }

    if (step === 'confirmation' && orderMessage) {
      setCheckoutStep('confirmation');
    }
  };

  const resetCheckout = () => {
    setCheckoutStep('cart');
    setOrderMessage('');
    setLastOrderTotal(0);
    setLastOrderCustomer('');
  };

  return (
    <div className="app min-h-screen antialiased selection:bg-amber-200 selection:text-slate-950">
      <header className={mobileMenuOpen ? 'site-header menu-open' : 'site-header'}>
        <a className="brand-mark" href="#home" aria-label="Times home">
          <span className="logo-orbit" aria-hidden="true">
            <span className="logo-hand hour-hand"></span>
            <span className="logo-hand minute-hand"></span>
          </span>
          <span>Times</span>
        </a>
        <button
          className="hamburger-button"
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav id="main-navigation" className="main-nav" aria-label="Main navigation">
          <button type="button" className={currentPage === 'home' ? 'active' : ''} onClick={() => goToPage('home')}>Shop</button>
          <button type="button" className={currentPage === 'saved' ? 'active' : ''} onClick={() => goToPage('saved')}>Saved Watches</button>
          <button type="button" className={currentPage === 'compare' ? 'active' : ''} onClick={() => goToPage('compare')}>Compare</button>
          <button className="mobile-account-link" type="button" onClick={() => { openAccount(); setMobileMenuOpen(false); }}>
            {user ? `Account: ${user.name}` : 'Account'}
          </button>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-actions">
          <button className="ghost-header-button" type="button" onClick={openAccount}>
            {user ? user.name : 'Account'}
          </button>
          <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label="Open cart">
            Bag <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <button className="floating-bag-button" type="button" onClick={() => setCartOpen(true)} aria-label="Open shopping bag">
        <span>Bag</span>
        <strong>{cartCount}</strong>
      </button>

      <main>
        {currentPage === 'home' && (
          <>
        <section className="hero" id="home">
          <div className="hero-motion hero-motion-one" aria-hidden="true"></div>
          <div className="hero-motion hero-motion-two" aria-hidden="true"></div>
          <div className="hero-copy">
            <p className="eyebrow">Luxury watches, verified and ready to ship</p>
            <h1>Find the watch that makes time feel personal.</h1>
            <p>
              Discover Rolex, Omega, Cartier, and Patek Philippe pieces with transparent pricing,
              fast checkout, comparison tools, wishlists, and service support after delivery.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#shop">Shop collection</a>
              <button className="secondary-link" type="button" onClick={() => openProduct(selectedProduct)}>
                View product details
              </button>
            </div>
          </div>
          <div className="hero-watch" aria-label="Featured watch">
            <span className="watch-orbit watch-orbit-one" aria-hidden="true"></span>
            <span className="watch-orbit watch-orbit-two" aria-hidden="true"></span>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="hero-product-strip">
              <span>{selectedProduct.brand}</span>
              <strong>{selectedProduct.name}</strong>
              <button type="button" onClick={() => addToCart(selectedProduct)}>Add to bag</button>
            </div>
          </div>
        </section>

        <section className="stats-band" aria-label="Store benefits">
          <div className="reveal-card"><strong>2 day</strong><span>insured dispatch</span></div>
          <div className="reveal-card"><strong>100%</strong><span>verified listings</span></div>
          <div className="reveal-card"><strong>{wishlist.length}</strong><span>saved watches</span></div>
          <div className="reveal-card"><strong>{compare.length}/3</strong><span>comparison slots</span></div>
        </section>

        <section className="api-status" aria-live="polite">
          <strong>Backend status</strong>
          <span>{apiStatus}</span>
        </section>

        <section className="featured" id="featured">
          <div className="section-heading">
            <p className="eyebrow">Featured selection</p>
            <h2>Curated pieces with clear value.</h2>
          </div>
          <div className="feature-grid">
            {products.slice(0, 3).map((product) => (
              <button className="feature-tile" type="button" key={product.id} onClick={() => openProduct(product)}>
                <img src={product.image} alt={product.name} />
                <span>{product.tag}</span>
                <strong>{product.name}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <p className="eyebrow">Shop watches</p>
            <h2>Filter the catalog in seconds.</h2>
          </div>

          <div className="shop-layout">
            <aside className="filters" aria-label="Product filters">
              <label>
                Search
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search brand or model"
                />
              </label>

              <div className="filter-group">
                <span>Category</span>
                <div className="segmented">
                  {categories.map((item) => (
                    <button type="button" className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <span>Brand</span>
                <div className="chip-list">
                  {brands.map((item) => (
                    <button type="button" className={brand === item ? 'active' : ''} key={item} onClick={() => setBrand(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label>
                Sort by
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </label>
            </aside>

            <div className="product-area">
              <div className="catalog-toolbar">
                <span>{filteredProducts.length} watches available</span>
                <button type="button" onClick={() => { setQuery(''); setBrand('All'); setCategory('All'); setSort('featured'); }}>
                  Reset filters
                </button>
              </div>

              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <button className="image-button" type="button" onClick={() => openProduct(product)}>
                      <img src={product.image} alt={product.name} />
                    </button>
                    <div className="product-info">
                      <div className="card-title-row">
                        <div>
                          <span>{product.brand}</span>
                          <h3>{product.name}</h3>
                        </div>
                        <button className={wishlist.includes(product.id) ? 'icon-action active' : 'icon-action'} type="button" onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist">
                          ♥
                        </button>
                      </div>
                      <p>{product.caseSize} · {product.movement}</p>
                      <div className="price-row">
                        <strong>{formatCurrency(product.price)}</strong>
                        <s>{formatCurrency(product.oldPrice)}</s>
                      </div>
                      <div className="card-actions card-actions-wrap">
                        <span>{product.rating} rating</span>
                        <button type="button" onClick={() => toggleCompare(product.id)}>
                          {compare.includes(product.id) ? 'Compared' : 'Compare'}
                        </button>
                        <button type="button" onClick={() => addToCart(product)}>Add</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="detail-panel" aria-label="Selected watch details">
          <div>
            <p className="eyebrow">Quick view</p>
            <h2>{selectedProduct.name}</h2>
            <p>
              A verified {selectedProduct.category.toLowerCase()} collection watch from {selectedProduct.brand},
              checked for condition, authenticity, and shipping readiness.
            </p>
            <dl>
              <div><dt>Case</dt><dd>{selectedProduct.caseSize}</dd></div>
              <div><dt>Movement</dt><dd>{selectedProduct.movement}</dd></div>
              <div><dt>Warranty</dt><dd>{selectedProduct.warranty}</dd></div>
            </dl>
            <div className="panel-actions">
              <button type="button" onClick={() => addToCart(selectedProduct)}>Add selected watch</button>
              <button type="button" onClick={() => openProduct(selectedProduct)}>Details</button>
            </div>
          </div>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </section>

        <section className="workflow-section reviews-section">
          <div className="section-heading">
            <p className="eyebrow">Reviews</p>
            <h2>Verified buyer feedback.</h2>
          </div>
          <div className="reviews-layout">
            <div className="review-list">
              {selectedReviews.map((review, index) => (
                <article className="review-card" key={`${review.name}-${index}`}>
                  <strong>{review.name}</strong>
                  <span>{'★'.repeat(Number(review.rating))}</span>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
            <form className="review-form" onSubmit={(event) => submitReview(event)}>
              <h3>Review {selectedProduct.name}</h3>
              <input value={reviewDraft.name} onChange={(event) => setReviewDraft({ ...reviewDraft, name: event.target.value })} placeholder="Your name" />
              <select value={reviewDraft.rating} onChange={(event) => setReviewDraft({ ...reviewDraft, rating: Number(event.target.value) })}>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
              </select>
              <textarea value={reviewDraft.text} onChange={(event) => setReviewDraft({ ...reviewDraft, text: event.target.value })} placeholder="Share your experience" rows="4" />
              <button type="submit">Post review</button>
            </form>
          </div>
        </section>

        <section className="service-grid" id="service">
          {[
            ['Free Shipping', 'Insured delivery with tracking on every order.'],
            ['Secure Payment', 'Checkout flow with clear totals before confirmation.'],
            ['Order Tracking', 'Instant order status updates after purchase.'],
            ['Easy Returns', '30 day returns for unworn, eligible watches.'],
          ].map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </section>
          </>
        )}

        {currentPage === 'saved' && (
          <section className="page-view" id="saved-watches">
            <div className="section-heading">
              <p className="eyebrow">Saved watches</p>
              <h2>Your saved collection.</h2>
              <button className="secondary-link" type="button" onClick={() => setCurrentPage('home')}>Back to shop</button>
            </div>
            <div className="mini-grid">
              {wishlistProducts.length === 0 && <p className="empty-state">No saved watches yet. Go to the shop and use the heart button on a product card.</p>}
              {wishlistProducts.map((product) => (
                <article className="mini-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                  <div className="mini-card-actions">
                    <button type="button" onClick={() => openProduct(product)}>Details</button>
                    <button type="button" onClick={() => addToCart(product)}>Add</button>
                    <button type="button" onClick={() => toggleWishlist(product.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {currentPage === 'compare' && (
          <section className="page-view" id="compare-watches">
            <div className="section-heading">
              <p className="eyebrow">Compare watches</p>
              <h2>Compare up to three watches.</h2>
              <button className="secondary-link" type="button" onClick={() => setCurrentPage('home')}>Back to shop</button>
            </div>
            {compareProducts.length === 0 ? (
              <p className="empty-state">Choose Compare on product cards to build a side-by-side table.</p>
            ) : (
              <div className="compare-table">
                {compareProducts.map((product) => (
                  <article key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{formatCurrency(product.price)}</p>
                    <span>Case: {product.caseSize}</span>
                    <span>Movement: {product.movement}</span>
                    <span>Water: {product.waterResistance}</span>
                    <span>Rating: {product.rating}</span>
                    <span>Warranty: {product.warranty}</span>
                    <button type="button" onClick={() => openProduct(product)}>Details</button>
                    <button type="button" onClick={() => toggleCompare(product.id)}>Remove</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer" id="contact">
        <div>
          <h2>Times</h2>
          <p>Premium watches with a calmer, clearer shopping experience.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); }}>
          <label>Email<input type="email" placeholder="you@example.com" required /></label>
          <label>Message<textarea placeholder="Tell us what you are looking for" rows="3" required /></label>
          <button type="submit">Send message</button>
        </form>
      </footer>

      {modalProduct && (
        <div className="modal-shell" role="dialog" aria-modal="true" aria-label={`${modalProduct.name} details`}>
          <button className="drawer-backdrop" type="button" onClick={() => setModalProduct(null)} aria-label="Close details" />
          <section className="product-modal">
            <button className="modal-close" type="button" onClick={() => setModalProduct(null)}>x</button>
            <div className="modal-gallery">
              <img src={modalProduct.image} alt={modalProduct.name} />
              <div className="gallery-thumbs">
                {[modalProduct.image, selectedProduct.image, products[0]?.image].filter(Boolean).map((image, index) => (
                  <img src={image} alt="" key={`${image}-${index}`} />
                ))}
              </div>
            </div>
            <div className="modal-copy">
              <p className="eyebrow">{modalProduct.tag}</p>
              <h2>{modalProduct.name}</h2>
              <div className="price-row">
                <strong>{formatCurrency(modalProduct.price)}</strong>
                <s>{formatCurrency(modalProduct.oldPrice)}</s>
              </div>
              <p>Verified, condition-checked, and shipped with tracking. Delivery estimate: {modalProduct.delivery}.</p>
              <dl>
                <div><dt>Brand</dt><dd>{modalProduct.brand}</dd></div>
                <div><dt>Case</dt><dd>{modalProduct.caseSize}</dd></div>
                <div><dt>Movement</dt><dd>{modalProduct.movement}</dd></div>
                <div><dt>Water resistance</dt><dd>{modalProduct.waterResistance}</dd></div>
                <div><dt>Warranty</dt><dd>{modalProduct.warranty}</dd></div>
                <div><dt>Stock</dt><dd>{modalProduct.stock} available</dd></div>
              </dl>
              <div className="modal-actions">
                <button type="button" onClick={() => addToCart(modalProduct)}>Add to bag</button>
                <button type="button" onClick={() => toggleWishlist(modalProduct.id)}>
                  {wishlist.includes(modalProduct.id) ? 'Saved' : 'Save to wishlist'}
                </button>
                <button type="button" onClick={() => toggleCompare(modalProduct.id)}>Compare</button>
              </div>
              <div className="modal-reviews">
                <h3>Customer reviews</h3>
                {modalReviews.length === 0 && <p>No reviews yet.</p>}
                {modalReviews.map((review, index) => (
                  <article key={`${review.name}-${index}`}>
                    <strong>{review.name}</strong>
                    <span>{'★'.repeat(Number(review.rating))}</span>
                    <p>{review.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {accountOpen && (
        <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Account">
          <button className="drawer-backdrop" type="button" onClick={() => setAccountOpen(false)} aria-label="Close account" />
          <section className="account-modal">
            <button className="modal-close" type="button" onClick={() => setAccountOpen(false)}>x</button>
            {user ? (
              <div className="account-summary">
                <h2>Welcome, {user.name}</h2>
                <p>{user.email}</p>
                <div><strong>{wishlist.length}</strong><span>Wishlist items</span></div>
                <div><strong>{cartCount}</strong><span>Items in bag</span></div>
                <button type="button" onClick={signOut}>Logout</button>
              </div>
            ) : (
              <>
                <div className="tabs">
                  {['signin', 'register'].map((tabName) => (
                    <button type="button" className={activeAccountTab === tabName ? 'active' : ''} key={tabName} onClick={() => setActiveAccountTab(tabName)}>
                      {tabName === 'signin' ? 'Sign in' : 'Register'}
                    </button>
                  ))}
                </div>
              <form className="account-form" onSubmit={submitAuth}>
                {activeAccountTab === 'register' && <input value={authDraft.name} onChange={(event) => setAuthDraft({ ...authDraft, name: event.target.value })} placeholder="Full name" required />}
                <input value={authDraft.email} onChange={(event) => setAuthDraft({ ...authDraft, email: event.target.value })} placeholder="Email" type="email" required />
                <input value={authDraft.password} onChange={(event) => setAuthDraft({ ...authDraft, password: event.target.value })} placeholder="Password" type="password" required />
                <button type="submit">{activeAccountTab === 'signin' ? 'Sign in' : 'Create account'}</button>
              </form>
              </>
            )}
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <button className="drawer-backdrop" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" />
          <aside className="drawer-panel checkout-panel">
            <div className="drawer-header">
              <div>
                <span>Checkout</span>
                <h2>{cartCount} item{cartCount === 1 ? '' : 's'}</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">x</button>
            </div>

            <div className="checkout-steps">
              {checkoutSteps.map((step, index) => (
                <button
                  type="button"
                  className={checkoutStep === step.id ? 'active' : ''}
                  key={step.id}
                  onClick={() => goToCheckoutStep(step.id)}
                  disabled={
                    (step.id === 'shipping' && !cart.length) ||
                    (step.id === 'payment' && (!cart.length || !shippingComplete)) ||
                    (step.id === 'confirmation' && !orderMessage)
                  }
                >
                  <span className="step-index">{index + 1}</span>
                  <span className="step-label">{step.label}</span>
                </button>
              ))}
            </div>

            {checkoutStep === 'cart' && (
              <div className="checkout-stage cart-items">
                {!cart.length && (
                  <div className="empty-cart">
                    <strong>Your bag is empty.</strong>
                    <span>Add a watch to start checkout.</span>
                  </div>
                )}
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{formatCurrency(item.price)}</span>
                      <div className="quantity-control">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form className="checkout-form" onSubmit={submitCheckout}>
              {checkoutStep === 'shipping' && (
                <div className="checkout-stage checkout-form-section">
                  <h3>Shipping details</h3>
                  <input value={checkoutDraft.fullName} onChange={(event) => setCheckoutDraft({ ...checkoutDraft, fullName: event.target.value })} placeholder="Full name" required />
                  <input value={checkoutDraft.email} onChange={(event) => setCheckoutDraft({ ...checkoutDraft, email: event.target.value })} placeholder="Email" type="email" required />
                  <input value={checkoutDraft.address} onChange={(event) => setCheckoutDraft({ ...checkoutDraft, address: event.target.value })} placeholder="Address" required />
                  <input value={checkoutDraft.city} onChange={(event) => setCheckoutDraft({ ...checkoutDraft, city: event.target.value })} placeholder="City" required />
                </div>
              )}
              {checkoutStep === 'payment' && (
                <div className="checkout-stage checkout-form-section">
                  <h3>Payment method</h3>
                  <select value={checkoutDraft.payment} onChange={(event) => setCheckoutDraft({ ...checkoutDraft, payment: event.target.value })}>
                    <option>Card</option>
                    <option>Cash on delivery</option>
                    <option>Bank transfer</option>
                  </select>
                  {checkoutDraft.payment === 'Card' ? (
                    <div className="payment-grid">
                      <input value={checkoutDraft.cardNumber} onChange={(event) => setCheckoutDraft({ ...checkoutDraft, cardNumber: event.target.value })} placeholder="Card number" inputMode="numeric" required />
                      <input value={checkoutDraft.expiry} onChange={(event) => setCheckoutDraft({ ...checkoutDraft, expiry: event.target.value })} placeholder="MM/YY" required />
                    </div>
                  ) : (
                    <p className="payment-note">We will share payment instructions after confirming your order.</p>
                  )}
                </div>
              )}
              {checkoutStep === 'confirmation' && (
                <div className="checkout-stage confirmation-card">
                  <p className="success-message">{orderMessage || 'Your order summary will appear here.'}</p>
                  <div><span>Customer</span><strong>{lastOrderCustomer || checkoutDraft.fullName || 'Guest'}</strong></div>
                  <div><span>Payment</span><strong>{checkoutDraft.payment}</strong></div>
                  <button className="checkout-secondary" type="button" onClick={resetCheckout}>Start new order</button>
                </div>
              )}

              <div className="cart-summary">
                {orderMessage && checkoutStep !== 'confirmation' && <p>{orderMessage}</p>}
                <div><span>Subtotal</span><strong>{formatCurrency(checkoutDisplayTotal)}</strong></div>
                <div><span>Shipping</span><strong>Free</strong></div>
                <div className="summary-total"><span>Total</span><strong>{formatCurrency(checkoutDisplayTotal)}</strong></div>
                {checkoutStep === 'cart' && <button className="checkout-primary" type="button" onClick={() => goToCheckoutStep('shipping')} disabled={!cart.length}>Continue to shipping</button>}
                {checkoutStep === 'shipping' && <button type="button" onClick={continueToPayment}>Continue to payment</button>}
                {checkoutStep === 'payment' && <button type="submit" disabled={!paymentComplete}>Place order</button>}
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
