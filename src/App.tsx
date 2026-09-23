import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, ShoppingBag, Menu, X, Plus, Minus, Trash2,
  ArrowRight, ArrowUpRight, Sparkles, Truck, RotateCcw, Shield,
  ChevronRight, Star, User, LogOut, Package, Upload, Image as ImageIcon,
  Edit3, Eye, CreditCard, MapPin, Check
} from "lucide-react";
import { AppProvider, useApp, UserCollection, UserProduct } from "./context/AppContext";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Default featured collections (shown on home)
const defaultCollections: UserCollection[] = [
  {
    id: "default-1", userId: "system", userName: "RD Official", userAvatar: "",
    name: "DROP 01 — ESSENTIALS", description: "The foundation of your wardrobe. Premium basics reimagined.",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85",
    createdAt: Date.now(), likes: 2341, likedBy: [],
    products: [
      { id: "dp1", name: "RD Essential Oversized Tee", price: 1499, sizes: ["S","M","L","XL","XXL"], colors: ["Black","White","Grey"], images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85"], description: "Heavyweight cotton oversized tee with dropped shoulders.", category: "T-Shirts" },
      { id: "dp2", name: "RD Core Cargo Pants", price: 2999, sizes: ["30","32","34","36"], colors: ["Black","Olive","Khaki"], images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85"], description: "Multi-pocket cargo pants with tapered fit.", category: "Bottoms" },
      { id: "dp3", name: "RD Heavyweight Hoodie", price: 3499, sizes: ["S","M","L","XL","XXL"], colors: ["Black","Cream","Sage"], images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=85"], description: "Premium fleece hoodie with oversized fit.", category: "Hoodies" },
      { id: "dp4", name: "RD Varsity Bomber", price: 5499, sizes: ["S","M","L","XL"], colors: ["Black","Navy","Grey"], images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85"], description: "Satin-lined bomber with embroidered patches.", category: "Jackets" },
    ]
  },
  {
    id: "default-2", userId: "system", userName: "RD Official", userAvatar: "",
    name: "SNEAKER UNIVERSE", description: "Built for the streets. Step into the future.",
    coverImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85",
    createdAt: Date.now(), likes: 1892, likedBy: [],
    products: [
      { id: "dp5", name: "RD Phantom Runner", price: 8999, sizes: ["7","8","9","10","11","12"], colors: ["Black","White","Red"], images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85"], description: "Premium performance runner with responsive cushioning.", category: "Sneakers" },
      { id: "dp6", name: "RD Court Classic", price: 5999, sizes: ["6","7","8","9","10","11"], colors: ["White/Green","White/Black"], images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=85"], description: "Italian leather court sneakers.", category: "Sneakers" },
      { id: "dp7", name: "RD Retro High", price: 6499, sizes: ["7","8","9","10","11"], colors: ["Black/Red","White/Blue"], images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=85"], description: "Retro-inspired high top with premium materials.", category: "Sneakers" },
    ]
  },
  {
    id: "default-3", userId: "system", userName: "RD Official", userAvatar: "",
    name: "WOMEN — NEW SEASON", description: "Defined by individuality. Express yourself.",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85",
    createdAt: Date.now(), likes: 1567, likedBy: [],
    products: [
      { id: "dp8", name: "RD Silk Drape Blouse", price: 3999, sizes: ["XS","S","M","L"], colors: ["Ivory","Blush","Black"], images: ["https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=85"], description: "Luxurious silk blouse with elegant drape.", category: "Tops" },
      { id: "dp9", name: "RD Wide Leg Denim", price: 3299, sizes: ["24","26","28","30","32"], colors: ["Light Wash","Dark Indigo","Black"], images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=85"], description: "Japanese selvedge denim with high rise.", category: "Denim" },
      { id: "dp10", name: "RD Tailored Blazer", price: 7999, sizes: ["XS","S","M","L"], colors: ["Charcoal","Camel","Black"], images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85"], description: "Italian wool blazer with modern fit.", category: "Jackets" },
    ]
  },
];

// ============ MAIN APP ============
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { toast, toastType, currentUser, collections, cartCount, wishlist } = useApp();
  const [page, setPage] = useState<string>("home");
  const [authModal, setAuthModal] = useState<"signin" | "signup" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewCollection, setViewCollection] = useState<UserCollection | null>(null);
  const [viewProfile, setViewProfile] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // All collections (default + user)
  const allCollections = useMemo(() => [...collections, ...defaultCollections], [collections]);

  // Body scroll lock
  useEffect(() => {
    if (authModal || searchOpen || cartOpen || menuOpen || selectedProduct || checkoutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [authModal, searchOpen, cartOpen, menuOpen, selectedProduct, checkoutOpen]);

  const navigate = (p: string) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      {/* ANNOUNCEMENT BAR */}
      <div className="fixed top-0 left-0 right-0 z-[80] bg-white text-black">
        <div className="overflow-hidden py-2">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap w-max">
            {[0, 1, 2].map(i => (
              <span key={i} className="text-[10px] tracking-[.22em] font-medium px-8">
                FREE SHIPPING ON ₹2,999+ ✦ UPLOAD YOUR COLLECTIONS ✦ SELL WORLDWIDE ✦ NEW DROPS WEEKLY ✦
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar
        onNavigate={navigate}
        onSearch={() => setSearchOpen(true)}
        onCart={() => setCartOpen(true)}
        onMenu={() => setMenuOpen(true)}
        onAuth={() => setAuthModal("signin")}
        cartCount={cartCount}
        wishCount={wishlist.length}
        page={page}
      />

      {/* PAGES */}
      <main className="pt-[72px]">
        {page === "home" && <HomePage onNavigate={navigate} onViewCollection={setViewCollection} allCollections={allCollections} onAuth={() => setAuthModal("signin")} />}
        {page === "shop" && <ShopPage allCollections={allCollections} onViewCollection={setViewCollection} onAuth={() => setAuthModal("signin")} />}
        {page === "create" && <CreateCollectionPage onNavigate={navigate} />}
        {page === "profile" && <ProfilePage onViewCollection={setViewCollection} onNavigate={navigate} onAuth={() => setAuthModal("signin")} />}
      </main>

      {/* FOOTER */}
      <Footer onNavigate={navigate} />

      {/* MODALS */}
      <AnimatePresence>
        {authModal && <AuthModal mode={authModal} setMode={setAuthModal} onClose={() => setAuthModal(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && <SearchOverlay allCollections={allCollections} onClose={() => setSearchOpen(false)} onViewProduct={setSelectedProduct} />}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && <MobileMenu onNavigate={navigate} onAuth={() => { setMenuOpen(false); setAuthModal("signin"); }} />}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} onShop={() => { setCartOpen(false); navigate("shop"); }} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAuth={() => setAuthModal("signin")} />}
      </AnimatePresence>

      <AnimatePresence>
        {viewCollection && <CollectionDetail collection={viewCollection} onClose={() => setViewCollection(null)} onViewProduct={setSelectedProduct} onProfile={(uid: string) => { setViewCollection(null); setViewProfile(uid); }} />}
      </AnimatePresence>

      <AnimatePresence>
        {viewProfile && <ProfileView userId={viewProfile} onClose={() => setViewProfile(null)} onViewCollection={(c: any) => setViewCollection(c)} />}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} onNavigate={navigate} onAuth={() => { setCheckoutOpen(false); setAuthModal("signin"); }} />}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-[200] bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-xl text-[11px] tracking-[.12em] font-medium whitespace-nowrap ${
              toastType === "success" ? "bg-white text-black" :
              toastType === "error" ? "bg-red-500 text-white" :
              "bg-white/10 text-white border border-white/20"
            }`}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ NAVBAR ============
function Navbar({ onNavigate, onSearch, onCart, onMenu, onAuth, cartCount, wishCount, page }: any) {
  const { currentUser, signOut } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-[32px] left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className={`rounded-full border transition-all duration-500 px-5 md:px-7 py-3 flex items-center justify-between ${
          scrolled ? "bg-black/80 backdrop-blur-2xl border-white/10 shadow-2xl" : "bg-black/40 backdrop-blur-xl border-white/5"
        }`}>
          <button onClick={() => onNavigate("home")} className="leading-none group">
            <div className="text-2xl md:text-3xl font-black tracking-[-.09em]">RD</div>
            <div className="text-[6px] tracking-[.43em] text-white/50 mt-0.5">FASHION UNIVERSE</div>
          </button>

          <div className="hidden lg:flex items-center gap-6 text-[10px] tracking-[.18em]">
            <button onClick={() => onNavigate("home")} className={`transition ${page === "home" ? "text-white" : "text-white/60 hover:text-white"}`}>HOME</button>
            <button onClick={() => onNavigate("shop")} className={`transition ${page === "shop" ? "text-white" : "text-white/60 hover:text-white"}`}>SHOP</button>
            <button onClick={() => onNavigate("create")} className={`transition flex items-center gap-1.5 ${page === "create" ? "text-white" : "text-white/60 hover:text-white"}`}>
              <Upload size={12} /> UPLOAD
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onSearch} className="p-2 hover:text-white/60 transition"><Search size={18} strokeWidth={1.5} /></button>
            <button onClick={() => onNavigate("profile")} className="p-2 hover:text-white/60 transition relative hidden sm:block">
              <Heart size={18} strokeWidth={1.5} />
              {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-[7px] bg-white text-black rounded-full min-w-[16px] h-4 grid place-items-center font-bold">{wishCount}</span>}
            </button>
            <button onClick={onCart} className="p-2 hover:text-white/60 transition relative">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 text-[7px] bg-white text-black rounded-full min-w-[16px] h-4 grid place-items-center font-bold">{cartCount}</motion.span>}
            </button>

            {currentUser ? (
              <div className="relative group">
                <button onClick={() => onNavigate("profile")} className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-white/50 transition">
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                </button>
              </div>
            ) : (
              <button onClick={onAuth} className="hidden sm:block text-[9px] tracking-[.15em] border border-white/20 rounded-full px-4 py-2 hover:bg-white hover:text-black transition">
                SIGN IN
              </button>
            )}

            <button onClick={onMenu} className="p-2 lg:hidden"><Menu size={20} /></button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============ AUTH MODAL ============
function AuthModal({ mode, setMode, onClose }: { mode: "signin" | "signup"; setMode: (m: "signin" | "signup") => void; onClose: () => void }) {
  const { signIn, signUp, signInWithGoogle, notify } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!name || !email || !password) {
        setError("All fields required");
        return;
      }
      if (password.length < 6) {
        setError("Password must be 6+ characters");
        return;
      }

      const res = await signUp(name, email, password);
      if (res.success) {
        notify(res.message);
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      if (!email || !password) {
        setError("All fields required");
        return;
      }

      const res = await signIn(email, password);
      if (res.success) {
        notify(res.message);
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] overflow-y-auto bg-[#02050a]"
      onClick={onClose}
    >
      {/* Cinematic fashion background */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1800&q=90"
          className="w-full h-full object-cover object-center opacity-[0.32]"
          alt=""
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(80,150,210,0.28),transparent_35%),linear-gradient(180deg,rgba(2,5,10,0.45),rgba(2,5,10,0.88))]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 md:py-12">

        {/* Login Card */}
        <motion.div
          initial={{ scale: 0.96, y: 25, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 25, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 180 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-[470px] overflow-hidden rounded-[28px] border border-white/[0.16] bg-black/[0.62] shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
        >

          {/* Blue cinematic glow */}
          <div className="absolute -top-32 right-[-15%] w-72 h-72 rounded-full bg-sky-400/[0.12] blur-3xl pointer-events-none" />

          <div className="relative p-7 sm:p-10">

            {/* Header */}
            <div className="flex justify-between items-start mb-9">
              <div>
                <div className="mb-5">
                  <div className="text-2xl font-black tracking-[-0.08em]">RD</div>
                  <div className="text-[7px] tracking-[0.42em] text-white/40 mt-1">
                    FASHION UNIVERSE
                  </div>
                </div>

                <h2 className="text-[34px] sm:text-[38px] leading-none font-semibold tracking-[-0.045em]">
                  {mode === "signin" ? "Welcome back" : "Join the universe"}
                </h2>

                <p className="text-sm text-white/40 mt-3">
                  {mode === "signin"
                    ? "Sign in to your account"
                    : "Create your RD account"}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] grid place-items-center text-white/60 hover:text-white hover:bg-white/[0.09] transition"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Signup name */}
              {mode === "signup" && (
                <div>
                  <label className="text-[9px] tracking-[.18em] text-white/45 block mb-2.5">
                    FULL NAME
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-14 bg-white/[0.045] border border-white/[0.14] rounded-2xl px-4 text-sm outline-none placeholder:text-white/20 focus:border-sky-300/50 focus:bg-white/[0.065] transition"
                    placeholder="Your name"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-[9px] tracking-[.18em] text-white/45 block mb-2.5">
                  EMAIL
                </label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  className="w-full h-14 bg-white/[0.045] border border-white/[0.14] rounded-2xl px-4 text-sm outline-none placeholder:text-white/20 focus:border-sky-300/50 focus:bg-white/[0.065] transition"
                  placeholder="you@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[9px] tracking-[.18em] text-white/45 block mb-2.5">
                  PASSWORD
                </label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  className="w-full h-14 bg-white/[0.045] border border-white/[0.14] rounded-2xl px-4 text-sm outline-none placeholder:text-white/20 focus:border-sky-300/50 focus:bg-white/[0.065] transition"
                  placeholder="••••••••"
                />
              </div>

              {mode === "signin" && (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => notify("Password recovery coming soon", "info")}
                    className="text-[10px] text-white/40 hover:text-white transition"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-[11px] text-red-300">
                  {error}
                </div>
              )}

              {/* Main button */}
              <button
                type="submit"
                className="group w-full h-14 bg-white text-black rounded-2xl text-[10px] tracking-[.22em] font-semibold hover:bg-white/90 transition flex items-center justify-center gap-3"
              >
                {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
                <span className="text-base group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="h-px bg-white/[0.12] flex-1" />
              <span className="text-[9px] text-white/30 tracking-[.12em]">OR</span>
              <div className="h-px bg-white/[0.12] flex-1" />
            </div>

            {/* Google + Apple */}
            <div className="grid grid-cols-2 gap-3">

              {/* Google */}
              <button
                type="button"
                onClick={async () => {
                  const r = await signInWithGoogle();
                  if (!r.success) setError(r.message);
                }}
                className="h-14 rounded-2xl border border-white/[0.13] bg-white/[0.055] hover:bg-white/[0.10] transition flex items-center justify-center gap-3"
              >
                <span className="text-xl font-medium bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                  G
                </span>
                <span className="text-[10px] tracking-[.12em] text-white/75">
                  GOOGLE
                </span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => notify("Apple sign-in coming soon", "info")}
                className="h-14 rounded-2xl border border-white/[0.13] bg-white/[0.055] hover:bg-white/[0.10] transition flex items-center justify-center gap-3"
              >
                <span className="text-[22px] text-white"></span>
                <span className="text-[10px] tracking-[.12em] text-white/75">
                  APPLE
                </span>
              </button>
            </div>

            {/* Switch account mode */}
            <div className="mt-8 text-center">
              <p className="text-[11px] text-white/40">
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setError("");
                  }}
                  className="text-white ml-2 hover:text-sky-300 transition"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <div className="mt-7 text-center">
              <p className="text-[7px] tracking-[.3em] text-white/20">
                RD FASHION UNIVERSE · EST. 2026
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============ HOME PAGE ============
function HomePage({ onNavigate, onViewCollection, allCollections, onAuth }: any) {
  const { currentUser } = useApp();
  const [heroIdx, setHeroIdx] = useState(0);

  const heroSlides = [
    { title: "YOUR\nUNIVERSE.", subtitle: "CREATE · SELL · SHOP", cta: "UPLOAD COLLECTION", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2400&q=90" },
    { title: "WEAR\nYOUR\nIDENTITY.", subtitle: "DROP 01 / 2026", cta: "SHOP NOW", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=2400&q=90" },
    { title: "CREATE\n& SELL.", subtitle: "YOUR DESIGNS. YOUR BRAND.", cta: "START SELLING", image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=2400&q=90" },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[95vh] min-h-[650px] overflow-hidden flex items-end">
        <AnimatePresence mode="wait">
          <motion.div key={heroIdx} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
            <img src={heroSlides[heroIdx].image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={heroIdx} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <p className="text-[9px] md:text-[11px] tracking-[.42em] text-white/60 mb-5 whitespace-pre-line">{heroSlides[heroIdx].subtitle}</p>
                <h1 className="text-[16vw] md:text-[11vw] font-black leading-[.76] tracking-[-.09em] whitespace-pre-line">
                  {heroSlides[heroIdx].title}
                </h1>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button onClick={() => currentUser ? onNavigate("create") : onAuth()} className="group flex items-center gap-4 bg-white text-black px-7 py-4 text-[10px] tracking-[.2em] font-medium hover:bg-white/90 transition">
                    {heroSlides[heroIdx].cta}
                    <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
                  </button>
                  <button onClick={() => onNavigate("shop")} className="px-7 py-4 border border-white/30 text-[10px] tracking-[.2em] hover:bg-white/10 transition">
                    EXPLORE SHOP
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-16 right-6 md:right-12 flex gap-2">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setHeroIdx(i)} className={`h-1 rounded-full transition-all duration-500 ${i === heroIdx ? "w-8 bg-white" : "w-4 bg-white/30"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-white/[.06] grid md:grid-cols-3">
        {[
          { icon: Upload, title: "UPLOAD COLLECTIONS", desc: "Create & sell your own designs" },
          { icon: Package, title: "GLOBAL SHIPPING", desc: "Deliver worldwide with ease" },
          { icon: Shield, title: "SECURE PAYMENTS", desc: "Safe & protected transactions" },
        ].map(({ icon: Icon, title, desc }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`px-7 py-10 flex gap-4 items-start ${i < 2 ? "border-b md:border-b-0 md:border-r border-white/[.06]" : ""}`}>
            <Icon size={20} strokeWidth={1.2} className="text-white/60 mt-0.5" />
            <div>
              <p className="text-[10px] tracking-[.18em] font-medium">{title}</p>
              <p className="text-[11px] text-white/35 mt-1.5">{desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* COLLECTIONS GRID */}
      <section className="px-4 md:px-8 py-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <p className="text-[9px] tracking-[.4em] text-white/30 mb-2">EXPLORE</p>
              <h2 className="text-3xl md:text-5xl tracking-[-.04em]">All collections.</h2>
            </div>
            <button onClick={() => onNavigate("shop")} className="text-[9px] tracking-[.2em] text-white/50 hover:text-white transition flex items-center gap-1">
              VIEW ALL <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {allCollections.slice(0, 4).map((col: UserCollection, i: number) => (
              <motion.button
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onViewCollection(col)}
                className="group relative h-[55vh] min-h-[400px] overflow-hidden text-left"
              >
                <img src={col.coverImage} alt={col.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute bottom-7 left-7 right-7">
                  <div className="flex items-center gap-2 mb-3">
                    {col.userId !== "system" && (
                      <img src={col.userAvatar} className="w-6 h-6 rounded-full" alt="" />
                    )}
                    <p className="text-[9px] tracking-[.2em] text-white/50">
                      {col.userId === "system" ? "RD OFFICIAL" : col.userName.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl md:text-5xl font-black tracking-[-.06em]">{col.name}</h3>
                      <p className="text-[10px] text-white/40 mt-2">{col.products.length} products · {col.likes} likes</p>
                    </div>
                    <span className="w-11 h-11 rounded-full border border-white/30 grid place-items-center group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Upload */}
      <section className="relative overflow-hidden border-y border-white/[.06] bg-[#0f0f0f] px-6 py-28 text-center">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[.02] blur-[120px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-[800px] mx-auto">
          <Sparkles className="mx-auto text-white/50 mb-6" size={24} strokeWidth={1} />
          <h2 className="text-5xl md:text-8xl font-black tracking-[-.08em] leading-[.78]">
            YOUR<br />DESIGNS.<br /><span className="text-white/25">YOUR RULES.</span>
          </h2>
          <p className="max-w-lg mx-auto mt-8 text-sm text-white/40 leading-7">
            Upload your collections. Set your prices. Sell to the world. Keep 95% of every sale.
          </p>
          <button onClick={() => currentUser ? onNavigate("create") : onAuth()} className="mt-9 bg-white text-black px-8 py-4 text-[10px] tracking-[.24em] font-medium hover:bg-white/90 transition">
            START SELLING NOW
          </button>
        </motion.div>
      </section>
    </>
  );
}

// ============ SHOP PAGE ============
function ShopPage({ allCollections, onViewCollection, onAuth }: any) {
  const { currentUser } = useApp();
  const [filter, setFilter] = useState<"all" | "official" | "community">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = allCollections;
    if (filter === "official") list = list.filter((c: UserCollection) => c.userId === "system");
    if (filter === "community") list = list.filter((c: UserCollection) => c.userId !== "system");
    if (search) list = list.filter((c: UserCollection) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.userName.toLowerCase().includes(search.toLowerCase()) ||
      c.products.some(p => p.name.toLowerCase().includes(search.toLowerCase()))
    );
    return list;
  }, [allCollections, filter, search]);

  return (
    <section className="px-4 md:px-8 py-10 min-h-[80vh]">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <p className="text-[9px] tracking-[.4em] text-white/30 mb-2">MARKETPLACE</p>
          <h2 className="text-3xl md:text-5xl tracking-[-.04em]">All Collections</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-white/[.06]">
          <div className="flex gap-1.5">
            {[
              { id: "all", label: "ALL" },
              { id: "official", label: "RD OFFICIAL" },
              { id: "community", label: "COMMUNITY" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 text-[9px] tracking-[.15em] rounded-full border transition-all ${
                  filter === f.id ? "bg-white text-black border-white" : "border-white/10 text-white/50 hover:border-white/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="ml-auto relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search collections..."
              className="bg-white/[.04] border border-white/10 rounded-full pl-9 pr-4 py-2 text-[10px] w-48 outline-none focus:border-white/30 transition placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((col: UserCollection, i: number) => (
            <motion.button
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onViewCollection(col)}
              className="group relative aspect-[4/5] overflow-hidden text-left rounded-lg"
            >
              <img src={col.coverImage} alt={col.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
                  {col.userId !== "system" ? (
                    <img src={col.userAvatar} className="w-5 h-5 rounded-full" alt="" />
                  ) : (
                    <Sparkles size={12} className="text-white/70" />
                  )}
                  <span className="text-[9px] tracking-[.1em]">{col.userId === "system" ? "OFFICIAL" : col.userName}</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1.5">
                  <Heart size={10} fill="white" />
                  <span className="text-[9px]">{col.likes}</span>
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="text-lg md:text-xl font-bold tracking-[-.02em]">{col.name}</h3>
                <p className="text-[10px] text-white/50 mt-1 line-clamp-1">{col.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[9px] text-white/40">{col.products.length} products</span>
                  <span className="text-[9px] text-white/40">From {money(Math.min(...col.products.map(p => p.price)))}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {!filtered.length && (
          <div className="py-24 text-center">
            <p className="text-white/30">No collections found</p>
            {!currentUser && <button onClick={onAuth} className="mt-4 text-[10px] tracking-[.15em] border border-white/20 px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition">SIGN IN TO UPLOAD</button>}
          </div>
        )}
      </div>
    </section>
  );
}

// ============ CREATE COLLECTION PAGE ============
function CreateCollectionPage({ onNavigate }: any) {
  const { currentUser, addCollection, notify } = useApp();
  const [step, setStep] = useState(1);
  const [colName, setColName] = useState("");
  const [colDesc, setColDesc] = useState("");
  const [colCover, setColCover] = useState("");
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<UserProduct | null>(null);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-[80vh] grid place-items-center text-center px-6">
        <div>
          <Upload size={40} strokeWidth={1} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/40">
            {!currentUser ? "Please sign in to continue" : "Admin access required"}
          </p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { notify("Image too large (max 5MB)", "error"); return; }
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveProduct = () => {
    if (!editingProduct) return;
    if (!editingProduct.name || !editingProduct.price || !editingProduct.images.length) {
      notify("Fill all product fields", "error");
      return;
    }
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === editingProduct.id);
      if (idx >= 0) return prev.map((p, i) => i === idx ? editingProduct : p);
      return [...prev, editingProduct];
    });
    setEditingProduct(null);
    notify("Product saved ✓");
  };

  const publishCollection = () => {
    if (!colName || !colCover) { notify("Add collection name & cover", "error"); return; }
    if (products.length === 0) { notify("Add at least one product", "error"); return; }
    addCollection({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      name: colName,
      description: colDesc,
      coverImage: colCover,
      products,
    });
    onNavigate("profile");
  };

  return (
    <section className="px-4 md:px-8 py-10 min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-[9px] tracking-[.4em] text-white/30 mb-2">CREATE</p>
          <h2 className="text-3xl md:text-4xl tracking-[-.04em]">Upload your collection</h2>
          <p className="text-xs text-white/40 mt-2">Share your designs with the world. Keep 95% of every sale.</p>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition ${s <= step ? "bg-white" : "bg-white/10"}`} />
          ))}
        </div>

        {/* Step 1: Collection Details */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">COLLECTION NAME *</label>
              <input value={colName} onChange={e => setColName(e.target.value)} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="e.g., Summer Essentials 2026" />
            </div>
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">DESCRIPTION</label>
              <textarea value={colDesc} onChange={e => setColDesc(e.target.value)} rows={3} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30 transition resize-none" placeholder="Tell buyers about your collection..." />
            </div>
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">COVER IMAGE *</label>
              <div className="relative">
                {colCover ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img src={colCover} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => setColCover("")} className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full grid place-items-center"><X size={14} /></button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-white/15 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 transition">
                    <ImageIcon size={32} strokeWidth={1} className="text-white/20 mb-3" />
                    <p className="text-[11px] text-white/40">Click to upload cover image</p>
                    <p className="text-[9px] text-white/20 mt-1">JPG, PNG up to 5MB</p>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setColCover)} />
                  </label>
                )}
              </div>
            </div>
            <button onClick={() => { if (!colName || !colCover) { notify("Add name & cover image", "error"); return; } setStep(2); }} className="w-full bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-lg hover:bg-white/90 transition">
              NEXT: ADD PRODUCTS →
            </button>
          </motion.div>
        )}

        {/* Step 2: Add Products */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg">Products ({products.length})</h3>
              <button onClick={() => setEditingProduct({ id: Math.random().toString(36).slice(2), name: "", price: 0, sizes: [], colors: [], images: [], description: "", category: "" })} className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-[10px] tracking-[.1em] font-medium">
                <Plus size={14} /> ADD PRODUCT
              </button>
            </div>

            {/* Product List */}
            {products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {products.map(p => (
                  <div key={p.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-[#111]">
                      {p.images[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />}
                    </div>
                    <div className="mt-2">
                      <p className="text-[11px] truncate">{p.name}</p>
                      <p className="text-[10px] text-white/40">{money(p.price)}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setEditingProduct(p)} className="w-7 h-7 bg-black/70 rounded-full grid place-items-center"><Edit3 size={12} /></button>
                      <button onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))} className="w-7 h-7 bg-red-500/80 rounded-full grid place-items-center"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Editor Modal */}
            <AnimatePresence>
              {editingProduct && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-xl grid place-items-center p-4" onClick={() => setEditingProduct(null)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-[#111] border border-white/10 rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg">{products.find(p => p.id === editingProduct.id) ? "Edit" : "Add"} Product</h3>
                      <button onClick={() => setEditingProduct(null)}><X size={18} /></button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">PRODUCT NAME *</label>
                        <input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="Product name" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">PRICE (₹) *</label>
                          <input type="number" value={editingProduct.price || ""} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="1999" />
                        </div>
                        <div>
                          <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">CATEGORY</label>
                          <input value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="T-Shirts" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">DESCRIPTION</label>
                        <textarea value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={2} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30 resize-none" placeholder="Product description..." />
                      </div>
                      <div>
                        <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">PRODUCT IMAGE *</label>
                        {editingProduct.images[0] ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden max-w-[200px]">
                            <img src={editingProduct.images[0]} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => setEditingProduct({ ...editingProduct, images: [] })} className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full grid place-items-center"><X size={12} /></button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-white/15 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-white/30 transition">
                            <ImageIcon size={24} strokeWidth={1} className="text-white/20 mb-2" />
                            <p className="text-[10px] text-white/40">Upload image</p>
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, (v) => setEditingProduct({ ...editingProduct, images: [v] }))} />
                          </label>
                        )}
                      </div>
                      <div>
                        <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">SIZES (comma separated)</label>
                        <input value={editingProduct.sizes.join(",")} onChange={e => setEditingProduct({ ...editingProduct, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="S, M, L, XL" />
                      </div>
                      <div>
                        <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">COLORS (comma separated)</label>
                        <input value={editingProduct.colors.join(",")} onChange={e => setEditingProduct({ ...editingProduct, colors: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="Black, White, Red" />
                      </div>
                    </div>

                    <button onClick={saveProduct} className="w-full bg-white text-black py-3.5 mt-6 text-[10px] tracking-[.2em] font-medium rounded-lg hover:bg-white/90 transition">
                      SAVE PRODUCT
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/15 py-4 text-[10px] tracking-[.2em] rounded-lg hover:border-white/30 transition">← BACK</button>
              <button onClick={() => { if (products.length === 0) { notify("Add at least one product", "error"); return; } setStep(3); }} className="flex-[2] bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-lg hover:bg-white/90 transition">REVIEW →</button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/[.03] border border-white/[.06] rounded-xl p-6 mb-6">
              <div className="flex gap-5">
                <img src={colCover} className="w-24 h-24 object-cover rounded-lg" alt="" />
                <div className="flex-1">
                  <h3 className="text-xl font-medium">{colName}</h3>
                  <p className="text-[11px] text-white/40 mt-1">{colDesc}</p>
                  <p className="text-[10px] text-white/30 mt-3">{products.length} products · By {currentUser.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/[.03] border border-white/[.06] rounded-xl p-6 mb-6">
              <p className="text-[9px] tracking-[.15em] text-white/40 mb-4">PRODUCTS</p>
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-white/[.04] last:border-0">
                    <div className="flex items-center gap-3">
                      {p.images[0] && <img src={p.images[0]} className="w-10 h-10 object-cover rounded" alt="" />}
                      <div>
                        <p className="text-[11px]">{p.name}</p>
                        <p className="text-[9px] text-white/30">{p.sizes.length} sizes · {p.colors.length} colors</p>
                      </div>
                    </div>
                    <span className="text-sm">{money(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 mb-6">
              <div className="flex gap-3">
                <Check size={18} className="text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-green-400 font-medium">You keep 95% of every sale</p>
                  <p className="text-[10px] text-white/40 mt-1">5% platform fee covers payment processing & hosting</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-white/15 py-4 text-[10px] tracking-[.2em] rounded-lg hover:border-white/30 transition">← EDIT</button>
              <button onClick={publishCollection} className="flex-[2] bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-lg hover:bg-white/90 transition">
                PUBLISH COLLECTION 🚀
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============ PROFILE PAGE ============
function ProfilePage({ onViewCollection, onNavigate, onAuth }: any) {
  const { currentUser, signOut, getUserCollections, orders } = useApp();
  const [tab, setTab] = useState<"collections" | "orders" | "wishlist">("collections");

  if (!currentUser) {
    return (
      <div className="min-h-[80vh] grid place-items-center text-center px-6">
        <div>
          <User size={40} strokeWidth={1} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/40 mb-4">Sign in to view your profile</p>
          <button onClick={onAuth} className="bg-white text-black px-6 py-3 text-[10px] tracking-[.2em] font-medium rounded-lg">SIGN IN</button>
        </div>
      </div>
    );
  }

  const myCollections = getUserCollections(currentUser.id);

  return (
    <section className="px-4 md:px-8 py-10 min-h-[80vh]">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 pb-8 border-b border-white/[.06]">
          <img src={currentUser.avatar} className="w-20 h-20 rounded-full" alt="" />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-medium">{currentUser.name}</h2>
            <p className="text-[11px] text-white/40 mt-1">{currentUser.email}</p>
            <p className="text-[10px] text-white/30 mt-2">Member since {new Date(currentUser.joinedAt).toLocaleDateString()}</p>
            <div className="flex gap-6 mt-4 justify-center md:justify-start">
              <div><span className="text-lg font-medium">{myCollections.length}</span><span className="text-[9px] text-white/30 ml-1.5">Collections</span></div>
              <div><span className="text-lg font-medium">{orders.length}</span><span className="text-[9px] text-white/30 ml-1.5">Orders</span></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate("create")} className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-[10px] tracking-[.1em] font-medium">
              <Plus size={14} /> NEW COLLECTION
            </button>
            <button onClick={signOut} className="flex items-center gap-2 border border-white/15 px-4 py-2.5 rounded-lg text-[10px] tracking-[.1em] hover:border-white/30 transition">
              <LogOut size={14} /> SIGN OUT
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/[.06]">
          {[
            { id: "collections", label: "My Collections", count: myCollections.length },
            { id: "orders", label: "Orders", count: orders.length },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`px-5 py-3 text-[10px] tracking-[.15em] border-b-2 transition ${tab === t.id ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/70"}`}>
              {t.label.toUpperCase()} ({t.count})
            </button>
          ))}
        </div>

        {/* Collections Tab */}
        {tab === "collections" && (
          <div>
            {myCollections.length === 0 ? (
              <div className="py-16 text-center">
                <Upload size={32} strokeWidth={1} className="mx-auto text-white/15 mb-3" />
                <p className="text-white/40 text-sm">No collections yet</p>
                <button onClick={() => onNavigate("create")} className="mt-4 bg-white text-black px-5 py-2.5 rounded-lg text-[10px] tracking-[.15em] font-medium">CREATE YOUR FIRST</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myCollections.map(col => (
                  <motion.button key={col.id} whileHover={{ scale: 0.99 }} onClick={() => onViewCollection(col)} className="group relative aspect-[16/10] overflow-hidden rounded-lg text-left">
                    <img src={col.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-medium">{col.name}</h3>
                      <p className="text-[10px] text-white/50 mt-1">{col.products.length} products · {col.likes} likes</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <Package size={32} strokeWidth={1} className="mx-auto text-white/15 mb-3" />
                <p className="text-white/40 text-sm">No orders yet</p>
                <button onClick={() => onNavigate("shop")} className="mt-4 border border-white/20 px-5 py-2.5 rounded-lg text-[10px] tracking-[.15em] hover:bg-white hover:text-black transition">START SHOPPING</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white/[.03] border border-white/[.06] rounded-xl p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium">Order #{order.id}</p>
                        <p className="text-[10px] text-white/30 mt-1">{new Date(order.date).toLocaleDateString()} · {order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{money(order.total)}</p>
                        <span className="text-[9px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded mt-1 inline-block">{order.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {order.items.map((item, i) => (
                        <img key={i} src={item.product.images?.[0] || ""} className="w-14 h-14 object-cover rounded shrink-0" alt="" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ============ COLLECTION DETAIL ============
function CollectionDetail({ collection: col, onClose, onViewProduct, onProfile }: any) {
  const { currentUser, likeCollection, notify } = useApp();
  const isLiked = currentUser && col.likedBy?.includes(currentUser.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto">
      {/* Header */}
      <div className="relative h-[50vh] min-h-[350px]">
        <img src={col.coverImage} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-black/50" />
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur rounded-full grid place-items-center hover:bg-black/70 transition">
          <X size={18} />
        </button>
        <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12">
          <div className="flex items-center gap-3 mb-4">
            {col.userId !== "system" ? (
              <button onClick={() => onProfile(col.userId)} className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 hover:bg-black/60 transition">
                <img src={col.userAvatar} className="w-6 h-6 rounded-full" alt="" />
                <span className="text-[10px] tracking-[.1em]">{col.userName}</span>
              </button>
            ) : (
              <span className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-[10px] tracking-[.1em] flex items-center gap-1.5">
                <Sparkles size={10} /> RD OFFICIAL
              </span>
            )}
            <button onClick={() => likeCollection(col.id)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] transition ${isLiked ? "bg-red-500 text-white" : "bg-black/40 backdrop-blur-md hover:bg-black/60"}`}>
              <Heart size={12} fill={isLiked ? "currentColor" : "none"} /> {col.likes}
            </button>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-.06em]">{col.name}</h1>
          <p className="text-xs text-white/50 mt-3 max-w-lg">{col.description}</p>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 md:px-8 py-10">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[9px] tracking-[.3em] text-white/30 mb-6">{col.products.length} PRODUCTS</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10">
            {col.products.map((p: UserProduct, i: number) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                <div className="relative aspect-[3/4] bg-[#111] overflow-hidden rounded-sm cursor-pointer" onClick={() => onViewProduct({ ...p, collectionId: col.id, sellerId: col.userId, sellerName: col.userName, isUserCollection: col.userId !== "system" })}>
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-3 left-3 right-3 bg-white text-black py-3 text-[9px] tracking-[.2em] text-center font-medium translate-y-16 group-hover:translate-y-0 transition-transform duration-400 rounded-sm">
                    VIEW PRODUCT
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-[11px] md:text-xs truncate">{p.name}</h3>
                  <p className="text-[11px] md:text-xs mt-1">{money(p.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ PRODUCT MODAL ============
function ProductModal({ product: p, onClose, onAuth }: any) {
  const { currentUser, addToCart, toggleWishlist, isInWishlist, notify } = useApp();
  const [size, setSize] = useState(p.sizes?.[0] || "");
  const [color, setColor] = useState(p.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const inWishlist = isInWishlist(p.id);

  const handleAdd = () => {
    if (!currentUser) { onAuth(); return; }
    if (!size) { notify("Select a size", "error"); return; }
    for (let i = 0; i < qty; i++) {
      addToCart({
        productId: p.id,
        collectionId: p.collectionId || "default",
        sellerId: p.sellerId || "system",
        product: p,
        size,
        color,
        isUserCollection: p.isUserCollection || false,
      });
    }
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-xl overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: "spring", damping: 25 }} onClick={e => e.stopPropagation()} className="min-h-full max-w-5xl mx-auto my-4 md:my-8 bg-[#111] rounded-xl overflow-hidden grid md:grid-cols-2">
        {/* Image */}
        <div className="relative">
          <img src={p.images?.[0]} alt={p.name} className="w-full aspect-square md:aspect-[4/5] object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur rounded-full grid place-items-center"><X size={18} /></button>
        </div>

        {/* Details */}
        <div className="p-6 md:p-8 flex flex-col">
          {p.isUserCollection && (
            <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[.15em] text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full w-fit mb-3">
              <Sparkles size={10} /> COMMUNITY SELLER
            </span>
          )}
          <p className="text-[9px] tracking-[.2em] text-white/30">{p.category || "FASHION"}</p>
          <h2 className="text-2xl md:text-3xl font-medium tracking-[-.03em] mt-2">{p.name}</h2>
          <p className="text-2xl font-medium mt-4">{money(p.price)}</p>
          {p.description && <p className="text-xs text-white/40 leading-6 mt-4">{p.description}</p>}

          {/* Size */}
          {p.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] tracking-[.15em] mb-3">SIZE</p>
              <div className="grid grid-cols-5 gap-2">
                {p.sizes.map((s: string) => (
                  <button key={s} onClick={() => setSize(s)} className={`py-3 text-xs border rounded-sm transition ${size === s ? "bg-white text-black border-white" : "border-white/10 hover:border-white/40"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {p.colors?.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] tracking-[.15em] mb-3">COLOR: <span className="text-white/50">{color}</span></p>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((c: string) => (
                  <button key={c} onClick={() => setColor(c)} className={`px-3 py-2 text-[10px] border rounded-sm transition ${color === c ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="mt-4">
            <p className="text-[10px] tracking-[.15em] mb-3">QUANTITY</p>
            <div className="flex items-center border border-white/15 rounded-sm w-fit">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5"><Minus size={13} /></button>
              <span className="text-xs w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2.5"><Plus size={13} /></button>
            </div>
          </div>

          {/* Actions */}
          <button onClick={handleAdd} className="w-full mt-6 bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-sm hover:bg-white/90 transition">
            ADD TO BAG · {money(p.price * qty)}
          </button>
          <button onClick={() => { if (!currentUser) { onAuth(); return; } toggleWishlist(p.id); }} className="w-full mt-2 border border-white/15 py-3 text-[10px] tracking-[.15em] rounded-sm hover:border-white/30 transition">
            {inWishlist ? "♥ SAVED TO WISHLIST" : "♡ ADD TO WISHLIST"}
          </button>

          <div className="grid grid-cols-2 gap-3 mt-6 text-[9px] text-white/35">
            <span className="flex items-center gap-1.5"><Truck size={11} /> Free shipping ₹2,999+</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={11} /> 7-day returns</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ CART DRAWER ============
function CartDrawer({ onClose, onCheckout, onShop }: any) {
  const { cart, cartTotal, cartCount, removeFromCart, updateCartQty, currentUser } = useApp();

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:max-w-md z-[130] bg-[#0c0c0c] border-l border-white/[.06] flex flex-col">
        <div className="p-6 border-b border-white/[.06] flex justify-between items-center">
          <div>
            <p className="text-[9px] tracking-[.3em] text-white/30">YOUR BAG</p>
            <h2 className="text-xl font-medium mt-0.5">{cartCount} {cartCount === 1 ? "item" : "items"}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:text-white/60"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {!cart.length ? (
            <div className="h-full grid place-items-center text-center">
              <div>
                <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-white/15 mb-4" />
                <p className="text-white/30 text-sm">Your bag is empty</p>
                <button onClick={onShop} className="mt-5 bg-white text-black px-6 py-3 text-[9px] tracking-[.2em] font-medium rounded-sm">START SHOPPING</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((x, i) => (
                <motion.div key={`${x.productId}-${x.size}-${x.color}-${i}`} layout className="flex gap-4 pb-4 border-b border-white/[.06]">
                  <img src={x.product.images?.[0]} alt="" className="w-20 h-24 object-cover rounded-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="text-[11px] font-medium truncate">{x.product.name}</p>
                      <button onClick={() => removeFromCart(x.productId, x.collectionId, x.size)} className="text-white/25 hover:text-red-400 transition shrink-0"><Trash2 size={13} /></button>
                    </div>
                    {x.isUserCollection && <p className="text-[8px] text-amber-400/60 mt-0.5">Community seller</p>}
                    <p className="text-[9px] text-white/30 mt-1">Size: {x.size} · {x.color}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/10 rounded-sm">
                        <button onClick={() => updateCartQty(x.productId, x.collectionId, x.size, x.qty - 1)} className="p-1.5"><Minus size={11} /></button>
                        <span className="text-[10px] w-6 text-center">{x.qty}</span>
                        <button onClick={() => updateCartQty(x.productId, x.collectionId, x.size, x.qty + 1)} className="p-1.5"><Plus size={11} /></button>
                      </div>
                      <span className="text-xs">{money(x.product.price * x.qty)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/[.06] bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-white/40">SUBTOTAL</span>
              <span className="text-lg font-medium">{money(cartTotal)}</span>
            </div>
            {cartTotal < 2999 && <p className="text-[9px] text-white/25 mb-2">Add {money(2999 - cartTotal)} more for free shipping</p>}
            <button onClick={() => { if (!currentUser) { onClose(); return; } onCheckout(); }} className="w-full bg-white text-black py-4 mt-3 text-[10px] tracking-[.2em] font-medium rounded-sm hover:bg-white/90 transition">
              CHECKOUT · {money(cartTotal + (cartTotal < 2999 ? 99 : 0))}
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}

// ============ CHECKOUT MODAL ============
function CheckoutModal({ onClose, onNavigate, onAuth }: any) {
  const { currentUser, cart, cartTotal, placeOrder, notify } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: currentUser?.name || "", email: currentUser?.email || "", address: "", city: "", pin: "", card: "" });
  const [orderId, setOrderId] = useState("");

  if (!currentUser) { onAuth(); return null; }

  const handlePlaceOrder = async () => {
    if (!form.address || !form.city || !form.pin) { notify("Fill all shipping details", "error"); return; }
    const id = await placeOrder(form);
    setOrderId(id);
    setStep(3);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium">{step === 3 ? "Order Confirmed!" : "Checkout"}</h2>
          <button onClick={onClose} className="p-2 hover:text-white/60"><X size={20} /></button>
        </div>

        <div className="flex gap-2 mb-8">
          {["Shipping", "Payment", "Done"].map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition ${i < step ? "bg-white" : "bg-white/10"}`} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">NAME</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">EMAIL</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" />
              </div>
            </div>
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">ADDRESS</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="Street address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">CITY</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">PIN CODE</label>
                <input value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-white text-black py-4 mt-4 text-[10px] tracking-[.2em] font-medium rounded-lg hover:bg-white/90 transition">CONTINUE TO PAYMENT →</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">CARD NUMBER</label>
              <div className="relative">
                <input value={form.card} onChange={e => setForm({ ...form, card: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30 pr-12" placeholder="4242 4242 4242 4242" />
                <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">EXPIRY</label>
                <input className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="MM/YY" />
              </div>
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">CVV</label>
                <input className="w-full bg-white/[.04] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30" placeholder="123" type="password" />
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-white/[.03] rounded-lg border border-white/[.06]">
              <p className="text-[9px] tracking-[.15em] text-white/40 mb-3">ORDER SUMMARY</p>
              {cart.map((x, i) => (
                <div key={i} className="flex justify-between text-[11px] py-1.5">
                  <span className="text-white/60 truncate mr-4">{x.product.name} × {x.qty}</span>
                  <span className="shrink-0">{money(x.product.price * x.qty)}</span>
                </div>
              ))}
              <div className="border-t border-white/[.06] mt-3 pt-3 flex justify-between">
                <span className="text-sm">Total</span>
                <span className="text-sm font-medium">{money(cartTotal + (cartTotal < 2999 ? 99 : 0))}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/15 py-4 text-[10px] tracking-[.2em] rounded-lg hover:border-white/30 transition">← BACK</button>
              <button onClick={handlePlaceOrder} className="flex-[2] bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-lg hover:bg-white/90 transition">PAY {money(cartTotal + (cartTotal < 2999 ? 99 : 0))}</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="w-16 h-16 bg-green-500/15 rounded-full grid place-items-center mx-auto mb-6">
              <Check size={28} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-medium">Thank you!</h3>
            <p className="text-sm text-white/40 mt-2">Your order has been placed successfully</p>
            <p className="text-xs text-white/30 mt-4">Order ID: <span className="text-white font-mono">{orderId}</span></p>
            <div className="flex gap-3 mt-8 justify-center">
              <button onClick={() => { onClose(); onNavigate("profile"); }} className="border border-white/15 px-6 py-3 text-[10px] tracking-[.15em] rounded-lg hover:border-white/30 transition">VIEW ORDERS</button>
              <button onClick={() => { onClose(); onNavigate("shop"); }} className="bg-white text-black px-6 py-3 text-[10px] tracking-[.15em] font-medium rounded-lg">CONTINUE SHOPPING</button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============ SEARCH OVERLAY ============
function SearchOverlay({ allCollections, onClose, onViewProduct }: any) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const prods: any[] = [];
    allCollections.forEach((col: UserCollection) => {
      col.products.forEach(p => {
        if (p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q))) {
          prods.push({ ...p, collectionId: col.id, sellerId: col.userId, sellerName: col.userName, isUserCollection: col.userId !== "system" });
        }
      });
    });
    return prods.slice(0, 12);
  }, [query, allCollections]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl">
      <div className="max-w-4xl mx-auto px-6 pt-28">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[9px] tracking-[.4em] text-white/30">SEARCH</p>
          <button onClick={onClose} className="p-2 hover:text-white/60"><X size={20} /></button>
        </div>
        <div className="flex items-center border-b border-white/15 pb-4">
          <Search size={22} className="text-white/30 mr-4" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="w-full bg-transparent text-xl md:text-3xl font-light outline-none placeholder:text-white/15" />
        </div>
        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {results.map((p, i) => (
              <button key={i} onClick={() => { onViewProduct(p); onClose(); }} className="text-left group">
                <div className="aspect-[3/4] overflow-hidden rounded-sm bg-[#111]">
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-[11px] mt-2 truncate">{p.name}</p>
                <p className="text-[11px] text-white/40">{money(p.price)}</p>
              </button>
            ))}
          </div>
        )}
        {query && !results.length && <p className="text-white/30 text-center mt-16">No results for "{query}"</p>}
      </div>
    </motion.div>
  );
}

// ============ MOBILE MENU ============
function MobileMenu({ onNavigate, onAuth }: any) {
  const { currentUser, signOut } = useApp();
  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-0 z-[100] bg-[#0a0a0a]">
      <div className="p-7">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="text-2xl font-black tracking-[-.09em]">RD</div>
            <div className="text-[6px] tracking-[.43em] text-white/50 mt-0.5">FASHION UNIVERSE</div>
          </div>
        </div>
        <div className="space-y-1">
          {[
            { label: "HOME", action: () => onNavigate("home") },
            { label: "SHOP", action: () => onNavigate("shop") },
            { label: "UPLOAD COLLECTION", action: () => onNavigate("create") },
            { label: currentUser ? "MY PROFILE" : "SIGN IN", action: () => currentUser ? onNavigate("profile") : onAuth() },
          ].map((item, i) => (
            <motion.button key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={item.action} className="block w-full text-left text-3xl font-black tracking-[-.05em] py-4 border-b border-white/[.06] flex items-center justify-between group">
              <span>{item.label}</span>
              <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>
        {currentUser && (
          <button onClick={signOut} className="mt-8 flex items-center gap-2 text-[10px] tracking-[.15em] text-white/40 hover:text-white transition">
            <LogOut size={14} /> SIGN OUT
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============ PROFILE VIEW (Other User) ============
function ProfileView({ userId, onClose, onViewCollection }: any) {
  const { users, collections } = useApp();
  const user = users.find(u => u.id === userId);
  const userCollections = collections.filter(c => c.userId === userId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={onClose} className="mb-8 flex items-center gap-2 text-[10px] tracking-[.15em] text-white/50 hover:text-white transition">← BACK</button>
        {user ? (
          <>
            <div className="flex items-center gap-5 mb-10 pb-8 border-b border-white/[.06]">
              <img src={user.avatar} className="w-16 h-16 rounded-full" alt="" />
              <div>
                <h2 className="text-2xl font-medium">{user.name}</h2>
                <p className="text-[11px] text-white/40 mt-1">{userCollections.length} collections · {userCollections.reduce((a, c) => a + c.likes, 0)} total likes</p>
              </div>
            </div>
            <p className="text-[9px] tracking-[.3em] text-white/30 mb-6">COLLECTIONS</p>
            <div className="grid md:grid-cols-2 gap-4">
              {userCollections.map(col => (
                <motion.button key={col.id} whileHover={{ scale: 0.99 }} onClick={() => { onClose(); onViewCollection(col); }} className="group relative aspect-[16/10] overflow-hidden rounded-lg text-left">
                  <img src={col.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-medium">{col.name}</h3>
                    <p className="text-[10px] text-white/50 mt-1">{col.products.length} products · {col.likes} likes</p>
                  </div>
                </motion.button>
              ))}
            </div>
            {!userCollections.length && <p className="text-white/30 text-center py-10">No collections yet</p>}
          </>
        ) : (
          <p className="text-white/30 text-center py-20">User not found</p>
        )}
      </div>
    </motion.div>
  );
}

// ============ FOOTER ============
function Footer({ onNavigate }: any) {
  return (
    <footer className="border-t border-white/[.06] px-6 md:px-10 py-14">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div>
            <button onClick={() => onNavigate("home")}>
              <div className="text-4xl font-black tracking-[-.09em]">RD</div>
              <p className="text-[7px] tracking-[.45em] text-white/30 mt-1.5">FASHION UNIVERSE</p>
            </button>
            <p className="text-[11px] text-white/25 mt-6 max-w-xs leading-5">Create, sell & shop fashion from creators worldwide. Your style. Your universe.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[9px] tracking-[.14em]">
            <div>
              <p className="text-white/25 mb-4 font-medium">SHOP</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition" onClick={() => onNavigate("shop")}>ALL COLLECTIONS</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">RD OFFICIAL</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">COMMUNITY</p>
            </div>
            <div>
              <p className="text-white/25 mb-4 font-medium">SELL</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition" onClick={() => onNavigate("create")}>UPLOAD COLLECTION</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">SELLER GUIDE</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">PRICING</p>
            </div>
            <div>
              <p className="text-white/25 mb-4 font-medium">HELP</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">CONTACT</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">SHIPPING</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">RETURNS</p>
            </div>
            <div>
              <p className="text-white/25 mb-4 font-medium">FOLLOW</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">INSTAGRAM</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">YOUTUBE</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">TWITTER</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[.06] mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-[8px] tracking-[.12em] text-white/20">
          <span>© 2026 RD FASHION UNIVERSE</span>
          <span>YOUR STYLE. YOUR UNIVERSE.</span>
        </div>
      </div>
    </footer>
  );
}
