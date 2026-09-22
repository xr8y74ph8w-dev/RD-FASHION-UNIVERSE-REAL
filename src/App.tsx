import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Search, Heart, ShoppingBag, Menu, X, Plus, Minus, Trash2,
  ChevronRight, ChevronLeft, Star, Truck, RotateCcw, Shield,
  ArrowRight, ArrowUpRight, Sparkles, Check, Eye, Filter,
  ChevronDown, MapPin, CreditCard, Package
} from "lucide-react";

// ============ DATA ============
const categories = [
  { id: "all", name: "All", icon: "✦" },
  { id: "men", name: "Men", icon: "♂" },
  { id: "women", name: "Women", icon: "♀" },
  { id: "sneakers", name: "Sneakers", icon: "👟" },
  { id: "streetwear", name: "Streetwear", icon: "⚡" },
  { id: "accessories", name: "Accessories", icon: "◆" },
];

const products = [
  { id: 1, name: "RD Phantom Runner", category: "sneakers", price: 8999, oldPrice: 11999, sizes: ["7", "8", "9", "10", "11", "12"], colors: ["Black", "White", "Red"], images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=85"], tag: "BESTSELLER", rating: 4.8, reviews: 234, description: "Premium performance runner with responsive cushioning and breathable mesh upper. Designed for both athletic performance and street style." },
  { id: 2, name: "RD Oversized Essential Tee", category: "men", price: 1499, oldPrice: 1999, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "White", "Grey", "Navy"], images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85"], tag: "NEW", rating: 4.6, reviews: 156, description: "Heavyweight cotton oversized tee with dropped shoulders. Premium quality fabric with a relaxed modern fit." },
  { id: 3, name: "RD Cargo Utility Pants", category: "men", price: 3499, sizes: ["30", "32", "34", "36", "38"], colors: ["Black", "Olive", "Khaki"], images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85"], tag: "TRENDING", rating: 4.7, reviews: 89, description: "Multi-pocket cargo pants with articulated knees and tapered fit. Made from durable ripstop cotton." },
  { id: 4, name: "RD Silk Drape Blouse", category: "women", price: 3999, oldPrice: 5499, sizes: ["XS", "S", "M", "L"], colors: ["Ivory", "Blush", "Black"], images: ["https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=85"], tag: "SALE", rating: 4.9, reviews: 312, description: "Luxurious silk blouse with elegant drape and mother-of-pearl buttons. Perfect for day-to-night styling." },
  { id: 5, name: "RD Wide Leg Denim", category: "women", price: 3299, sizes: ["24", "26", "28", "30", "32"], colors: ["Light Wash", "Dark Indigo", "Black"], images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=85"], tag: "NEW", rating: 4.5, reviews: 178, description: "Vintage-inspired wide leg jeans with premium Japanese selvedge denim. High rise with a flattering silhouette." },
  { id: 6, name: "RD Varsity Bomber", category: "streetwear", price: 5499, oldPrice: 6999, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy", "Grey"], images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85"], tag: "LIMITED", rating: 4.8, reviews: 67, description: "Premium bomber jacket with satin lining and embroidered patches. Water-resistant outer shell." },
  { id: 7, name: "RD Court Classic Sneaker", category: "sneakers", price: 5999, sizes: ["6", "7", "8", "9", "10", "11"], colors: ["White/Green", "White/Black", "Cream"], images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=85"], tag: "BESTSELLER", rating: 4.9, reviews: 445, description: "Handcrafted Italian leather court sneakers. Minimalist design with premium materials." },
  { id: 8, name: "RD Heavyweight Hoodie", category: "streetwear", price: 3499, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Cream", "Sage"], images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=85"], tag: "BESTSELLER", rating: 4.7, reviews: 289, description: "Heavyweight fleece hoodie with oversized fit and bold graphic. Kangaroo pocket with ribbed hem." },
  { id: 9, name: "RD Crossbody Bag", category: "accessories", price: 2499, sizes: ["ONE SIZE"], colors: ["Black", "Tan", "Olive"], images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85"], tag: "NEW", rating: 4.6, reviews: 93, description: "Compact crossbody bag with adjustable strap and multiple compartments. Water-resistant nylon construction." },
  { id: 10, name: "RD Tailored Wool Blazer", category: "women", price: 7999, oldPrice: 9999, sizes: ["XS", "S", "M", "L"], colors: ["Charcoal", "Camel", "Black"], images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85"], tag: "SALE", rating: 4.8, reviews: 156, description: "Impeccably tailored blazer in premium Italian wool. Relaxed shoulder with modern oversized fit." },
  { id: 11, name: "RD Retro High Top", category: "sneakers", price: 6499, sizes: ["7", "8", "9", "10", "11", "12"], colors: ["Black/Red", "White/Blue", "Green"], images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=85"], tag: "LIMITED", rating: 4.7, reviews: 201, description: "Retro-inspired high top sneaker with premium leather and suede. Cushioned insole for all-day comfort." },
  { id: 12, name: "RD Graphic Print Tee", category: "streetwear", price: 1799, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Washed Black", "Off-White", "Sage"], images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85"], tag: "NEW", rating: 4.4, reviews: 134, description: "Ultra-soft cotton tee with boxy oversized cut. Features exclusive artist collaboration print." },
  { id: 13, name: "RD Leather Belt", category: "accessories", price: 1999, sizes: ["S", "M", "L"], colors: ["Black", "Brown", "Tan"], images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=85"], tag: "ESSENTIAL", rating: 4.5, reviews: 78, description: "Full-grain leather belt with brushed metal buckle. Handcrafted with precision stitching." },
  { id: 14, name: "RD Ribbed Tank Top", category: "women", price: 1299, sizes: ["XS", "S", "M", "L"], colors: ["Black", "White", "Pink"], images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85"], tag: "ESSENTIAL", rating: 4.3, reviews: 167, description: "Soft ribbed tank with a flattering fitted silhouette. Perfect for layering or standalone wear." },
  { id: 15, name: "RD Distressed Denim Jacket", category: "streetwear", price: 4499, oldPrice: 5999, sizes: ["S", "M", "L", "XL"], colors: ["Light Wash", "Medium", "Black"], images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=85"], tag: "SALE", rating: 4.6, reviews: 112, description: "Vintage-wash denim jacket with hand-distressed details. A timeless streetwear essential." },
  { id: 16, name: "RD Performance Shorts", category: "men", price: 2299, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy", "Grey"], images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f69?w=800&q=85"], tag: "NEW", rating: 4.5, reviews: 95, description: "Lightweight performance shorts with moisture-wicking fabric. Built-in brief liner for comfort." },
];

const heroSlides = [
  { title: "WEAR YOUR\nIDENTITY.", subtitle: "DROP 01 / 2026", cta: "SHOP THE DROP", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=2400&q=90", link: "sneakers" },
  { title: "BUILT FOR\nTHE STREETS.", subtitle: "STREETWEAR COLLECTION", cta: "EXPLORE NOW", image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=2400&q=90", link: "streetwear" },
  { title: "DEFINE\nYOURSELF.", subtitle: "WOMEN'S NEW SEASON", cta: "DISCOVER", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2400&q=90", link: "women" },
];

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ============ MAIN APP ============
export default function App() {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [selSize, setSelSize] = useState("");
  const [selColor, setSelColor] = useState("");
  const [selImage, setSelImage] = useState(0);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "info">("success");
  const [email, setEmail] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const [page, setPage] = useState<"home" | "shop" | "product">("home");
  const [quickView, setQuickView] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (category === "all" || p.category === category) &&
      `${p.name} ${p.category} ${p.tag}`.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "new") list = [...list].sort((a, b) => (a.tag === "NEW" ? -1 : 1));
    return list;
  }, [query, category, sort]);

  const cartCount = cart.reduce((a, x) => a + x.qty, 0);
  const subtotal = cart.reduce((a, x) => a + x.price * x.qty, 0);

  const notify = useCallback((msg: string, type: "success" | "info" = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const addToCart = useCallback((product: any, chosenSize?: string, chosenColor?: string) => {
    const sz = chosenSize || product.sizes[0];
    const cl = chosenColor || product.colors[0];
    setCart(prev => {
      const found = prev.find(x => x.id === product.id && x.size === sz && x.color === cl);
      if (found) return prev.map(x => x === found ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...product, size: sz, color: cl, qty: 1 }];
    });
    notify("Added to bag ✓");
  }, [notify]);

  const toggleWish = useCallback((id: number) => {
    setWishlist(w => {
      if (w.includes(id)) { notify("Removed from wishlist", "info"); return w.filter(x => x !== id); }
      notify("Saved to wishlist ❤️");
      return [...w, id];
    });
  }, [notify]);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // ESC key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false); setMenuOpen(false); setSelected(null); setQuickView(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when modals open
  useEffect(() => {
    if (searchOpen || menuOpen || selected || quickView || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, menuOpen, selected, quickView, cartOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      {/* ANNOUNCEMENT BAR */}
      <div className="fixed top-0 left-0 right-0 z-[80] bg-white text-black">
        <div className="overflow-hidden py-2">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap w-max">
            {[0, 1, 2].map(i => (
              <span key={i} className="text-[10px] tracking-[.22em] font-medium px-8">
                FREE SHIPPING ON ORDERS OVER ₹2,999 &nbsp;✦&nbsp; EASY 7-DAY RETURNS &nbsp;✦&nbsp; SECURE CHECKOUT &nbsp;✦&nbsp; NEW DROPS EVERY WEEK &nbsp;✦&nbsp;
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar
        cartCount={cartCount}
        wishCount={wishlist.length}
        onSearch={() => setSearchOpen(true)}
        onCart={() => setCartOpen(true)}
        onMenu={() => setMenuOpen(true)}
        onCategory={(c: string) => { setCategory(c); setPage("shop"); document.getElementById("shop-section")?.scrollIntoView({ behavior: "smooth" }); }}
        onHome={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      />

      {/* MAIN CONTENT */}
      <main className="pt-[72px]">
        {page === "home" && (
          <>
            <HeroSection slides={heroSlides} index={heroIndex} setIndex={setHeroIndex} onShop={(link: string) => { setCategory(link); setPage("shop"); }} />
            <MarqueeSection />
            <IntroSection />
            <CollectionsSection onCategory={(c: string) => { setCategory(c); setPage("shop"); document.getElementById("shop-section")?.scrollIntoView({ behavior: "smooth" }); }} />
            <FeaturedProducts products={products.slice(0, 8)} onProduct={(p: any) => { setSelected(p); setSelSize(""); setSelColor(p.colors[0]); setSelImage(0); }} onWish={toggleWish} wishlist={wishlist} />
            <AIStylistSection onNotify={notify} />
            <BenefitsSection />
            <NewsletterSection email={email} setEmail={setEmail} onNotify={notify} />
          </>
        )}

        {page === "shop" && (
          <ShopSection
            products={filtered}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
            query={query}
            setQuery={setQuery}
            onProduct={(p: any) => { setSelected(p); setSelSize(""); setSelColor(p.colors[0]); setSelImage(0); }}
            onWish={toggleWish}
            wishlist={wishlist}
            onQuickView={(p: any) => { setQuickView(p); setSelSize(p.sizes[0]); setSelColor(p.colors[0]); }}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
        )}
      </main>

      {/* FOOTER */}
      <FooterSection onHome={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />

      {/* OVERLAYS */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay query={query} setQuery={setQuery} results={filtered} onClose={() => setSearchOpen(false)} onProduct={(p: any) => { setSearchOpen(false); setSelected(p); setSelSize(""); setSelColor(p.colors[0]); setSelImage(0); }} />}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} onCategory={(c: string) => { setCategory(c); setMenuOpen(false); setPage("shop"); }} />}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <ProductDetail
            product={selected}
            size={selSize}
            setSize={setSelSize}
            color={selColor}
            setColor={setSelColor}
            imageIndex={selImage}
            setImageIndex={setSelImage}
            onClose={() => setSelected(null)}
            onAdd={(sz: string, cl: string) => { addToCart(selected, sz, cl); setCartOpen(true); }}
            onWish={() => toggleWish(selected.id)}
            isWished={wishlist.includes(selected.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickView && (
          <QuickViewModal
            product={quickView}
            size={selSize}
            setSize={setSelSize}
            onClose={() => setQuickView(null)}
            onAdd={(sz: string) => { addToCart(quickView, sz); setQuickView(null); setCartOpen(true); }}
            onWish={() => toggleWish(quickView.id)}
            isWished={wishlist.includes(quickView.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            cart={cart}
            subtotal={subtotal}
            cartCount={cartCount}
            onClose={() => setCartOpen(false)}
            onRemove={(i: number) => setCart(prev => prev.filter((_, idx) => idx !== i))}
            onChangeQty={(i: number, d: number) => setCart(prev => prev.map((x, idx) => idx === i ? { ...x, qty: Math.max(1, x.qty + d) } : x))}
            onCheckout={() => { setCartOpen(false); setCheckoutStep(1); notify("Checkout initiated"); }}
            onShop={() => { setCartOpen(false); setPage("shop"); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutStep > 0 && (
          <CheckoutModal
            step={checkoutStep}
            setStep={setCheckoutStep}
            cart={cart}
            subtotal={subtotal}
            onClose={() => { setCheckoutStep(0); setCart([]); notify("Order placed successfully! 🎉"); }}
          />
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-[200] bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-xl text-[11px] tracking-[.12em] font-medium ${
              toastType === "success" ? "bg-white text-black" : "bg-white/10 text-white border border-white/20"
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
function Navbar({ cartCount, wishCount, onSearch, onCart, onMenu, onCategory, onHome }: any) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-[32px] left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className={`rounded-full border transition-all duration-500 px-5 md:px-7 py-3 flex items-center justify-between ${
          scrolled ? "bg-black/80 backdrop-blur-2xl border-white/10 shadow-2xl" : "bg-black/40 backdrop-blur-xl border-white/5"
        }`}>
          <button onClick={onHome} className="leading-none group">
            <div className="text-2xl md:text-3xl font-black tracking-[-.09em] group-hover:text-white/80 transition">RD</div>
            <div className="text-[6px] tracking-[.43em] text-white/50 mt-0.5">FASHION UNIVERSE</div>
          </button>

          <div className="hidden lg:flex items-center gap-7 text-[10px] tracking-[.18em]">
            {categories.slice(1).map(c => (
              <button key={c.id} onClick={() => onCategory(c.id)} className="text-white/65 hover:text-white transition relative group">
                {c.name.toUpperCase()}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onSearch} className="p-2 hover:text-white/60 transition" aria-label="Search"><Search size={18} strokeWidth={1.5} /></button>
            <button className="p-2 hover:text-white/60 transition relative hidden sm:block" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
              {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-[7px] bg-white text-black rounded-full min-w-[16px] h-4 grid place-items-center font-bold">{wishCount}</span>}
            </button>
            <button onClick={onCart} className="p-2 hover:text-white/60 transition relative" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 text-[7px] bg-white text-black rounded-full min-w-[16px] h-4 grid place-items-center font-bold">{cartCount}</motion.span>}
            </button>
            <button onClick={onMenu} className="p-2 lg:hidden" aria-label="Menu"><Menu size={20} /></button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============ HERO ============
function HeroSection({ slides, index, setIndex, onShop }: any) {
  return (
    <section className="relative h-[95vh] min-h-[650px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img src={slides[index].image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-end px-6 md:px-12 pb-16 md:pb-24">
        <div className="max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-[9px] md:text-[11px] tracking-[.42em] text-white/60 mb-5">{slides[index].subtitle}</p>
              <h1 className="text-[16vw] md:text-[11vw] font-black leading-[.76] tracking-[-.09em] whitespace-pre-line">
                {slides[index].title}
              </h1>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => onShop(slides[index].link)}
                  className="group flex items-center gap-4 bg-white text-black px-7 py-4 text-[10px] tracking-[.2em] font-medium hover:bg-white/90 transition-all"
                >
                  {slides[index].cta}
                  <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => onShop("all")}
                  className="px-7 py-4 border border-white/30 text-[10px] tracking-[.2em] hover:bg-white/10 transition-all"
                >
                  VIEW ALL
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="absolute bottom-16 right-6 md:right-12 flex gap-2">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-white" : "w-4 bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ MARQUEE ============
function MarqueeSection() {
  return (
    <div className="border-y border-white/[.06] py-4 overflow-hidden">
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="flex w-max whitespace-nowrap">
        {[0, 1].map(i => (
          <div key={i} className="flex gap-10 px-6 text-[10px] tracking-[.32em] text-white/40">
            <span>RD FASHION UNIVERSE</span><span className="text-white/20">✦</span>
            <span>NEW SEASON 2026</span><span className="text-white/20">✦</span>
            <span>FREE SHIPPING ₹2,999+</span><span className="text-white/20">✦</span>
            <span>YOUR STYLE YOUR UNIVERSE</span><span className="text-white/20">✦</span>
            <span>DROP 01 AVAILABLE NOW</span><span className="text-white/20">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ============ INTRO ============
function IntroSection() {
  return (
    <section className="px-6 md:px-12 py-28 md:py-44">
      <div className="max-w-[1200px] mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[9px] tracking-[.4em] text-white/30 mb-7">THE UNIVERSE</motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-7xl lg:text-[5.5rem] font-light tracking-[-.04em] leading-[.92]"
        >
          Fashion isn't<br />
          <span className="text-white/25">what you wear.</span><br />
          It's who you become.
        </motion.h2>
      </div>
    </section>
  );
}

// ============ COLLECTIONS ============
function CollectionsSection({ onCategory }: any) {
  const cols = [
    { id: "men", title: "MEN", subtitle: "Sharp. Minimal. Powerful.", image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&q=85" },
    { id: "women", title: "WOMEN", subtitle: "Defined by individuality.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85" },
    { id: "sneakers", title: "SNEAKERS", subtitle: "Built for the streets.", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85" },
    { id: "streetwear", title: "STREETWEAR", subtitle: "Own the moment.", image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&q=85" },
  ];

  return (
    <section className="px-4 md:px-8 pb-28">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <p className="text-[9px] tracking-[.4em] text-white/30 mb-2">EXPLORE</p>
            <h2 className="text-3xl md:text-5xl tracking-[-.04em]">Enter your universe.</h2>
          </div>
          <span className="hidden md:block text-[9px] tracking-[.2em] text-white/30">04 COLLECTIONS</span>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {cols.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 0.99 }}
              onClick={() => onCategory(c.id)}
              className="group relative h-[55vh] min-h-[420px] overflow-hidden text-left"
            >
              <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 flex justify-between items-end">
                <div>
                  <p className="text-[9px] tracking-[.3em] text-white/50 mb-2">{c.subtitle}</p>
                  <h3 className="text-5xl md:text-7xl font-black tracking-[-.07em]">{c.title}</h3>
                </div>
                <span className="w-11 h-11 rounded-full border border-white/30 grid place-items-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FEATURED PRODUCTS ============
function FeaturedProducts({ products: prods, onProduct, onWish, wishlist }: any) {
  return (
    <section className="px-4 md:px-8 py-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <p className="text-[9px] tracking-[.4em] text-white/30 mb-2">TRENDING NOW</p>
            <h2 className="text-3xl md:text-5xl tracking-[-.04em]">Most wanted.</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10">
          {prods.map((p: any, i: number) => (
            <ProductCard key={p.id} product={p} index={i} onClick={() => onProduct(p)} onWish={() => onWish(p.id)} isWished={wishlist.includes(p.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ PRODUCT CARD ============
function ProductCard({ product: p, index, onClick, onWish, isWished }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-[#111] overflow-hidden rounded-sm cursor-pointer" onClick={onClick}>
        <motion.img
          src={p.images[0]}
          alt={p.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        />
        {/* Tag */}
        <span className={`absolute left-3 top-3 px-2.5 py-1 text-[8px] tracking-[.15em] font-medium rounded-sm ${
          p.tag === "SALE" ? "bg-red-500 text-white" :
          p.tag === "NEW" ? "bg-white text-black" :
          p.tag === "LIMITED" ? "bg-amber-400 text-black" :
          "bg-white/90 text-black"
        }`}>{p.tag}</span>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onWish(); }}
          className={`absolute right-3 top-3 w-9 h-9 rounded-full grid place-items-center transition-all duration-300 ${
            isWished ? "bg-red-500 text-white scale-100" : "bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={14} fill={isWished ? "currentColor" : "none"} />
        </button>

        {/* Quick view button */}
        <motion.div
          initial={false}
          animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <div className="bg-white text-black py-3 text-[9px] tracking-[.2em] text-center font-medium rounded-sm">
            QUICK VIEW
          </div>
        </motion.div>
      </div>

      <button onClick={onClick} className="text-left w-full mt-3.5 block">
        <div className="flex justify-between gap-2 items-start">
          <h3 className="text-[11px] md:text-xs leading-tight">{p.name}</h3>
          <div className="text-right shrink-0">
            <span className="text-[11px] md:text-xs">{money(p.price)}</span>
            {p.oldPrice && <span className="text-[9px] text-white/30 line-through ml-1.5">{money(p.oldPrice)}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-0.5">
            <Star size={9} fill="white" className="text-white" />
            <span className="text-[9px] text-white/50">{p.rating}</span>
          </div>
          <span className="text-[9px] text-white/25">·</span>
          <span className="text-[9px] text-white/35 uppercase tracking-[.1em]">{p.category}</span>
        </div>
      </button>
    </motion.article>
  );
}

// ============ AI STYLIST ============
function AIStylistSection({ onNotify }: any) {
  return (
    <section className="relative overflow-hidden border-y border-white/[.06] bg-[#0f0f0f] px-6 py-28 md:py-36 text-center">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-white/[.02] blur-[150px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-[900px] mx-auto"
      >
        <Sparkles className="mx-auto text-white/50 mb-6" size={24} strokeWidth={1} />
        <p className="text-[9px] tracking-[.5em] text-white/30">INTRODUCING</p>
        <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-[-.09em] leading-[.76] mt-5">
          RD AI<br />STYLIST
        </h2>
        <p className="max-w-lg mx-auto mt-8 text-sm text-white/40 leading-7">
          Tell us where you're going and the energy you want. Our AI builds a complete look from the universe in seconds.
        </p>
        <button onClick={() => onNotify("AI Stylist coming soon! ✨")} className="mt-9 bg-white text-black px-8 py-4 text-[10px] tracking-[.24em] font-medium hover:bg-white/90 transition-all">
          START STYLING
        </button>
      </motion.div>
    </section>
  );
}

// ============ BENEFITS ============
function BenefitsSection() {
  const items = [
    { icon: Truck, title: "FREE DELIVERY", desc: "On orders above ₹2,999" },
    { icon: RotateCcw, title: "7-DAY RETURNS", desc: "Simple, hassle-free returns" },
    { icon: Shield, title: "SECURE CHECKOUT", desc: "Safe & protected payments" },
  ];
  return (
    <section className="border-b border-white/[.06] grid md:grid-cols-3">
      {items.map(({ icon: Icon, title, desc }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`px-7 py-10 flex gap-4 items-start ${i < 2 ? "border-b md:border-b-0 md:border-r border-white/[.06]" : ""}`}
        >
          <Icon size={20} strokeWidth={1.2} className="text-white/60 mt-0.5" />
          <div>
            <p className="text-[10px] tracking-[.18em] font-medium">{title}</p>
            <p className="text-[11px] text-white/35 mt-1.5">{desc}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

// ============ NEWSLETTER ============
function NewsletterSection({ email, setEmail, onNotify }: any) {
  return (
    <section className="px-6 py-28 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-lg mx-auto">
        <p className="text-[9px] tracking-[.45em] text-white/30">THE INNER CIRCLE</p>
        <h2 className="text-3xl md:text-5xl tracking-[-.05em] mt-4">First access. No noise.</h2>
        <p className="text-xs text-white/35 mt-4">Get early access to drops, exclusive offers and style inspiration.</p>
        <form onSubmit={e => { e.preventDefault(); if (email) { onNotify("You're on the list ✓"); setEmail(""); } }} className="mt-8 flex border-b border-white/20 focus-within:border-white/50 transition">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent py-4 text-[11px] tracking-[.18em] outline-none placeholder:text-white/20" />
          <button className="text-[10px] tracking-[.18em] px-3 hover:text-white/70 transition">JOIN <ArrowRight size={14} className="inline ml-1" /></button>
        </form>
      </motion.div>
    </section>
  );
}

// ============ SHOP SECTION ============
function ShopSection({ products: prods, category, setCategory, sort, setSort, query, setQuery, onProduct, onWish, wishlist, onQuickView, filterOpen, setFilterOpen }: any) {
  return (
    <section id="shop-section" className="px-4 md:px-8 py-10 min-h-[80vh]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] tracking-[.4em] text-white/30 mb-2">SHOP THE UNIVERSE</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl tracking-[-.04em]">
            {category === "all" ? "All Products" : categories.find(c => c.id === category)?.name}
          </motion.h2>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-white/[.06]">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-2 text-[9px] tracking-[.15em] rounded-full border transition-all duration-300 ${
                  category === c.id ? "bg-white text-black border-white" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {c.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search in shop */}
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="bg-white/[.04] border border-white/10 rounded-full pl-9 pr-4 py-2 text-[10px] w-44 outline-none focus:border-white/30 transition placeholder:text-white/20"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white/[.04] border border-white/10 rounded-full text-white/60 text-[9px] px-4 py-2 outline-none appearance-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <span className="text-[9px] text-white/25 tracking-[.1em]">{prods.length} items</span>
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category + sort}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10"
          >
            {prods.map((p: any, i: number) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onClick={() => onProduct(p)}
                onWish={() => onWish(p.id)}
                isWished={wishlist.includes(p.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {!prods.length && (
          <div className="py-24 text-center">
            <p className="text-white/30 text-lg">No products found</p>
            <p className="text-white/20 text-sm mt-2">Try a different category or search term</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ============ SEARCH OVERLAY ============
function SearchOverlay({ query, setQuery, results, onClose, onProduct }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl"
    >
      <div className="max-w-4xl mx-auto px-6 pt-28">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[9px] tracking-[.4em] text-white/30">SEARCH THE UNIVERSE</p>
          <button onClick={onClose} className="p-2 hover:text-white/60 transition"><X size={20} /></button>
        </div>

        <div className="flex items-center border-b border-white/15 pb-4">
          <Search size={22} className="text-white/30 mr-4" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="w-full bg-transparent text-xl md:text-3xl font-light outline-none placeholder:text-white/15"
          />
        </div>

        {query && results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {results.slice(0, 8).map((p: any) => (
              <button key={p.id} onClick={() => onProduct(p)} className="text-left group">
                <div className="aspect-[3/4] overflow-hidden rounded-sm bg-[#111]">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-[11px] mt-2 group-hover:text-white/80 transition">{p.name}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{money(p.price)}</p>
              </button>
            ))}
          </motion.div>
        )}

        {query && results.length === 0 && (
          <p className="text-white/30 text-center mt-16">No results found for "{query}"</p>
        )}

        {!query && (
          <div className="mt-10">
            <p className="text-[9px] tracking-[.3em] text-white/20 mb-4">POPULAR SEARCHES</p>
            <div className="flex flex-wrap gap-2">
              {["Sneakers", "Oversized Tee", "Bomber", "Denim", "Hoodie"].map(term => (
                <button key={term} onClick={() => setQuery(term)} className="px-4 py-2 border border-white/10 rounded-full text-[10px] text-white/50 hover:border-white/30 hover:text-white transition">
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============ MOBILE MENU ============
function MobileMenu({ onClose, onCategory }: any) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a]"
    >
      <div className="p-7">
        <button onClick={onClose} className="absolute top-7 right-7 p-2"><X size={22} /></button>
        <div className="mt-20">
          <p className="text-[9px] tracking-[.4em] text-white/25 mb-8">CATEGORIES</p>
          <div className="space-y-1">
            {categories.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onCategory(c.id)}
                className="block w-full text-left text-3xl md:text-4xl font-black tracking-[-.05em] py-4 border-b border-white/[.06] flex items-center justify-between group"
              >
                <span>{c.name.toUpperCase()}</span>
                <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ PRODUCT DETAIL ============
function ProductDetail({ product: p, size, setSize, color, setColor, imageIndex, setImageIndex, onClose, onAdd, onWish, isWished }: any) {
  const [qty, setQty] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="min-h-full max-w-6xl mx-auto my-4 md:my-8 bg-[#111] rounded-lg overflow-hidden grid md:grid-cols-2"
      >
        {/* Images */}
        <div className="relative">
          <div className="sticky top-0">
            <motion.img
              key={imageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={p.images[imageIndex]}
              alt={p.name}
              className="w-full aspect-square md:aspect-[4/5] object-cover"
            />
            {p.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {p.images.map((_: any, i: number) => (
                  <button key={i} onClick={() => setImageIndex(i)} className={`w-2 h-2 rounded-full transition ${i === imageIndex ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
            )}
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur rounded-full grid place-items-center hover:bg-black/70 transition">
              <X size={18} />
            </button>
            {p.tag && (
              <span className={`absolute top-4 left-4 px-3 py-1.5 text-[9px] tracking-[.15em] font-medium rounded-sm ${
                p.tag === "SALE" ? "bg-red-500" : p.tag === "LIMITED" ? "bg-amber-400 text-black" : "bg-white text-black"
              }`}>{p.tag}</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 md:p-10 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] tracking-[.25em] text-white/30 uppercase">{p.category} · {p.tag}</p>
              <h2 className="text-2xl md:text-3xl font-medium tracking-[-.03em] mt-2">{p.name}</h2>
            </div>
            <button onClick={onWish} className={`w-10 h-10 rounded-full grid place-items-center transition ${isWished ? "bg-red-500 text-white" : "border border-white/15 hover:border-white/40"}`}>
              <Heart size={16} fill={isWished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(p.rating) ? "white" : "none"} className={i < Math.floor(p.rating) ? "text-white" : "text-white/20"} />)}</div>
            <span className="text-[10px] text-white/40">{p.rating} ({p.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-5">
            <span className="text-2xl font-medium">{money(p.price)}</span>
            {p.oldPrice && (
              <>
                <span className="text-sm text-white/25 line-through">{money(p.oldPrice)}</span>
                <span className="text-[10px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded">{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% OFF</span>
              </>
            )}
          </div>

          <p className="text-xs text-white/40 leading-6 mt-6">{p.description}</p>

          {/* Size */}
          <div className="mt-7">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] tracking-[.15em]">SELECT SIZE</p>
              <button className="text-[9px] text-white/35 underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {p.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 text-xs border rounded-sm transition-all duration-200 ${
                    size === s ? "bg-white text-black border-white" : "border-white/10 hover:border-white/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mt-5">
            <p className="text-[10px] tracking-[.15em] mb-3">COLOR: <span className="text-white/50">{color}</span></p>
            <div className="flex flex-wrap gap-2">
              {p.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-3 py-2 text-[10px] border rounded-sm transition ${color === c ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5">
            <p className="text-[10px] tracking-[.15em] mb-3">QUANTITY</p>
            <div className="flex items-center border border-white/15 rounded-sm w-fit">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:text-white/60 transition"><Minus size={13} /></button>
              <span className="text-xs w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:text-white/60 transition"><Plus size={13} /></button>
            </div>
          </div>

          {/* Add to Bag */}
          <button
            onClick={() => { for (let i = 0; i < qty; i++) onAdd(size || p.sizes[0], color); }}
            className="w-full mt-7 bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium hover:bg-white/90 transition rounded-sm"
          >
            ADD TO BAG · {money(p.price * qty)}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 mt-6 text-[9px] text-white/35">
            <span className="flex items-center gap-1.5"><Truck size={12} /> Free shipping ₹2,999+</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={12} /> 7-day returns</span>
            <span className="flex items-center gap-1.5"><Shield size={12} /> Secure checkout</span>
            <span className="flex items-center gap-1.5"><Package size={12} /> Premium packaging</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ QUICK VIEW MODAL ============
function QuickViewModal({ product: p, size, setSize, onClose, onAdd, onWish, isWished }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#111] rounded-lg max-w-3xl w-full max-h-[85vh] overflow-auto grid md:grid-cols-2"
      >
        <div className="relative">
          <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover rounded-l-lg" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full grid place-items-center"><X size={15} /></button>
        </div>
        <div className="p-6">
          <p className="text-[9px] tracking-[.2em] text-white/30">{p.category.toUpperCase()}</p>
          <h3 className="text-xl font-medium mt-1">{p.name}</h3>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg">{money(p.price)}</span>
            {p.oldPrice && <span className="text-xs text-white/25 line-through">{money(p.oldPrice)}</span>}
          </div>
          <p className="text-[11px] text-white/35 mt-3 leading-5">{p.description}</p>

          <div className="mt-5">
            <p className="text-[9px] tracking-[.15em] mb-2">SIZE</p>
            <div className="grid grid-cols-5 gap-1.5">
              {p.sizes.map((s: string) => (
                <button key={s} onClick={() => setSize(s)} className={`py-2.5 text-[10px] border rounded-sm ${size === s ? "bg-white text-black border-white" : "border-white/10"}`}>{s}</button>
              ))}
            </div>
          </div>

          <button onClick={() => onAdd(size)} className="w-full mt-5 bg-white text-black py-3.5 text-[10px] tracking-[.2em] font-medium rounded-sm">
            ADD TO BAG · {money(p.price)}
          </button>
          <button onClick={onWish} className="w-full mt-2 border border-white/15 py-3 text-[10px] tracking-[.15em] rounded-sm hover:border-white/30 transition">
            {isWished ? "♥ SAVED" : "♡ ADD TO WISHLIST"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ CART DRAWER ============
function CartDrawer({ cart, subtotal, cartCount, onClose, onRemove, onChangeQty, onCheckout, onShop }: any) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full sm:max-w-md z-[130] bg-[#0c0c0c] border-l border-white/[.06] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[.06] flex justify-between items-center">
          <div>
            <p className="text-[9px] tracking-[.3em] text-white/30">YOUR BAG</p>
            <h2 className="text-xl font-medium mt-0.5">{cartCount} {cartCount === 1 ? "item" : "items"}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:text-white/60 transition"><X size={20} /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {!cart.length ? (
            <div className="h-full grid place-items-center text-center">
              <div>
                <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-white/15 mb-4" />
                <p className="text-white/30 text-sm">Your bag is empty</p>
                <button onClick={onShop} className="mt-5 bg-white text-black px-6 py-3 text-[9px] tracking-[.2em] font-medium rounded-sm hover:bg-white/90 transition">
                  START SHOPPING
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((x: any, i: number) => (
                  <motion.div
                    key={`${x.id}-${x.size}-${x.color}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="flex gap-4 pb-4 border-b border-white/[.06]"
                  >
                    <img src={x.images[0]} alt={x.name} className="w-20 h-24 object-cover rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="text-[11px] font-medium truncate">{x.name}</p>
                        <button onClick={() => onRemove(i)} className="text-white/25 hover:text-red-400 transition shrink-0"><Trash2 size={13} /></button>
                      </div>
                      <p className="text-[9px] text-white/30 mt-1">Size: {x.size} · {x.color}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-white/10 rounded-sm">
                          <button onClick={() => onChangeQty(i, -1)} className="p-1.5 hover:text-white/60 transition"><Minus size={11} /></button>
                          <span className="text-[10px] w-6 text-center">{x.qty}</span>
                          <button onClick={() => onChangeQty(i, 1)} className="p-1.5 hover:text-white/60 transition"><Plus size={11} /></button>
                        </div>
                        <span className="text-xs">{money(x.price * x.qty)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/[.06] bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-white/40 tracking-[.1em]">SUBTOTAL</span>
              <span className="text-lg font-medium">{money(subtotal)}</span>
            </div>
            {subtotal >= 2999 && (
              <p className="text-[9px] text-green-400/70 flex items-center gap-1 mb-3"><Truck size={10} /> Free shipping applied</p>
            )}
            <p className="text-[8px] text-white/20 mb-4">Shipping & taxes calculated at checkout</p>
            <button onClick={onCheckout} className="w-full bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-sm hover:bg-white/90 transition">
              CHECKOUT · {money(subtotal)}
            </button>
            <button onClick={onShop} className="w-full py-3 mt-2 text-[9px] tracking-[.15em] text-white/40 hover:text-white transition">
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}

// ============ CHECKOUT MODAL ============
function CheckoutModal({ step, setStep, cart, subtotal, onClose }: any) {
  const [formData, setFormData] = useState({ name: "", email: "", address: "", city: "", pin: "", card: "" });

  if (step === 1) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-xl overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium">Checkout</h2>
            <button onClick={() => setStep(0)} className="p-2 hover:text-white/60"><X size={20} /></button>
          </div>

          {/* Steps */}
          <div className="flex gap-2 mb-8">
            {["Shipping", "Payment", "Confirm"].map((s, i) => (
              <div key={s} className={`flex-1 h-0.5 rounded-full transition ${i < step ? "bg-white" : i === step - 1 ? "bg-white/50" : "bg-white/10"}`} />
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">FULL NAME</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">EMAIL</label>
              <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="john@email.com" />
            </div>
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">ADDRESS</label>
              <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="123 Street, Area" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">CITY</label>
                <input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="Mumbai" />
              </div>
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">PIN CODE</label>
                <input value={formData.pin} onChange={e => setFormData({ ...formData, pin: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="400001" />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 p-5 bg-white/[.03] rounded-sm border border-white/[.06]">
            <p className="text-[9px] tracking-[.15em] text-white/40 mb-3">ORDER SUMMARY</p>
            {cart.map((x: any) => (
              <div key={`${x.id}-${x.size}`} className="flex justify-between text-[11px] py-1.5">
                <span className="text-white/60">{x.name} × {x.qty}</span>
                <span>{money(x.price * x.qty)}</span>
              </div>
            ))}
            <div className="border-t border-white/[.06] mt-3 pt-3 flex justify-between">
              <span className="text-sm">Total</span>
              <span className="text-sm font-medium">{money(subtotal + (subtotal < 2999 ? 99 : 0))}</span>
            </div>
          </div>

          <button onClick={() => setStep(2)} className="w-full mt-6 bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-sm hover:bg-white/90 transition">
            CONTINUE TO PAYMENT
          </button>
        </div>
      </motion.div>
    );
  }

  if (step === 2) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-xl overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium">Payment</h2>
            <button onClick={() => setStep(0)} className="p-2 hover:text-white/60"><X size={20} /></button>
          </div>

          <div className="flex gap-2 mb-8">
            {["Shipping", "Payment", "Confirm"].map((s, i) => (
              <div key={s} className={`flex-1 h-0.5 rounded-full transition ${i <= step ? "bg-white" : "bg-white/10"}`} />
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">CARD NUMBER</label>
              <div className="relative">
                <input value={formData.card} onChange={e => setFormData({ ...formData, card: e.target.value })} className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition pr-12" placeholder="4242 4242 4242 4242" />
                <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">EXPIRY</label>
                <input className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="MM/YY" />
              </div>
              <div>
                <label className="text-[9px] tracking-[.15em] text-white/40 block mb-2">CVV</label>
                <input className="w-full bg-white/[.04] border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition" placeholder="123" type="password" />
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/[.03] rounded-sm border border-white/[.06] flex items-center gap-3">
            <Shield size={16} className="text-green-400/60" />
            <p className="text-[10px] text-white/40">Your payment is secured with 256-bit encryption</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 border border-white/15 py-4 text-[10px] tracking-[.2em] rounded-sm hover:border-white/30 transition">
              BACK
            </button>
            <button onClick={onClose} className="flex-[2] bg-white text-black py-4 text-[10px] tracking-[.2em] font-medium rounded-sm hover:bg-white/90 transition">
              PAY {money(subtotal + (subtotal < 2999 ? 99 : 0))}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

// ============ FOOTER ============
function FooterSection({ onHome }: any) {
  return (
    <footer className="border-t border-white/[.06] px-6 md:px-10 py-14">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div>
            <button onClick={onHome}>
              <div className="text-4xl font-black tracking-[-.09em]">RD</div>
              <p className="text-[7px] tracking-[.45em] text-white/30 mt-1.5">FASHION UNIVERSE</p>
            </button>
            <p className="text-[11px] text-white/25 mt-6 max-w-xs leading-5">
              Fashion curated for the way you move, think, and express yourself. Your style. Your universe.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[9px] tracking-[.14em]">
            <div>
              <p className="text-white/25 mb-4 font-medium">SHOP</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">MEN</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">WOMEN</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">SNEAKERS</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">STREETWEAR</p>
            </div>
            <div>
              <p className="text-white/25 mb-4 font-medium">DISCOVER</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">NEW ARRIVALS</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">BESTSELLERS</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">SALE</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">RD AI STYLIST</p>
            </div>
            <div>
              <p className="text-white/25 mb-4 font-medium">HELP</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">CONTACT US</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">SHIPPING INFO</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">RETURNS</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">SIZE GUIDE</p>
            </div>
            <div>
              <p className="text-white/25 mb-4 font-medium">FOLLOW</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">INSTAGRAM</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">YOUTUBE</p>
              <p className="mb-2.5 text-white/50 hover:text-white cursor-pointer transition">PINTEREST</p>
              <p className="text-white/50 hover:text-white cursor-pointer transition">TWITTER / X</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[.06] mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-[8px] tracking-[.12em] text-white/20">
          <span>© 2026 RD FASHION UNIVERSE. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <span className="hover:text-white/40 cursor-pointer transition">PRIVACY</span>
            <span className="hover:text-white/40 cursor-pointer transition">TERMS</span>
            <span className="hover:text-white/40 cursor-pointer transition">COOKIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
