import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Search, Heart, ShoppingBag, Menu, X,
  Plus, Minus, Sparkles, Trash2, Truck, RotateCcw, Check
} from "lucide-react";

const products = [
  { id:1, name:"RD Essential Oversized Tee", category:"Men", type:"T-Shirts", price:1499, oldPrice:1899, sizes:["S","M","L","XL","XXL"], colors:["Black","White"], image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=88", tag:"BESTSELLER" },
  { id:2, name:"Monochrome Utility Cargo", category:"Men", type:"Bottoms", price:2999, sizes:["30","32","34","36"], colors:["Black","Olive"], image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=88", tag:"NEW" },
  { id:3, name:"RD Signature Runner", category:"Sneakers", type:"Sneakers", price:4999, oldPrice:5499, sizes:["7","8","9","10","11"], colors:["Black","Red"], image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=88", tag:"LIMITED" },
  { id:4, name:"Studio Oversized Shirt", category:"Women", type:"Shirts", price:2499, sizes:["XS","S","M","L"], colors:["White","Blue"], image:"https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1000&q=88", tag:"NEW" },
  { id:5, name:"Core Wide Leg Denim", category:"Women", type:"Denim", price:3299, sizes:["26","28","30","32"], colors:["Blue","Black"], image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=88", tag:"TRENDING" },
  { id:6, name:"RD Varsity Bomber", category:"Streetwear", type:"Jackets", price:4499, sizes:["S","M","L","XL"], colors:["Black","Grey"], image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=88", tag:"DROP 01" },
  { id:7, name:"Essential Rib Tank", category:"Women", type:"Tops", price:1299, sizes:["XS","S","M","L"], colors:["Black","White"], image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=88", tag:"ESSENTIAL" },
  { id:8, name:"Heavyweight Logo Hoodie", category:"Streetwear", type:"Hoodies", price:3499, sizes:["S","M","L","XL","XXL"], colors:["Black","Cream"], image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=88", tag:"BESTSELLER" },
];

const collections = [
  { title:"MEN", subtitle:"Sharp. Minimal. Powerful.", image:"https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1600&q=88" },
  { title:"WOMEN", subtitle:"Defined by individuality.", image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=88" },
  { title:"SNEAKERS", subtitle:"Built for the streets.", image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=88" },
  { title:"STREETWEAR", subtitle:"Own the moment.", image:"https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=88" },
];

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function App() {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("featured");
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (category === "ALL" || p.category.toUpperCase() === category) &&
      `${p.name} ${p.category} ${p.type}`.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, category, sort]);

  const cartCount = cart.reduce((a, x) => a + x.qty, 0);
  const subtotal = cart.reduce((a, x) => a + x.price * x.qty, 0);

  function notify(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2200); }

  function addToCart(product: any, chosenSize: string = size || product.sizes[0]) {
    setCart(prev => {
      const found = prev.find((x: any) => x.id === product.id && x.size === chosenSize);
      if (found) return prev.map((x: any) => x === found ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...product, size: chosenSize, qty: 1 }];
    });
    setCartOpen(true);
    setSelected(null);
    notify("Added to bag");
  }

  function changeQty(index: number, delta: number) {
    setCart(prev => prev.map((x, i) => i === index ? { ...x, qty: Math.max(1, x.qty + delta) } : x));
  }

  function removeCart(index: number) { setCart(prev => prev.filter((_, i) => i !== index)); }

  function toggleWish(id: number) {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    notify(wishlist.includes(id) ? "Removed from wishlist" : "Saved to wishlist");
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-white selection:text-black">
      <style>{`
        html { scroll-behavior:smooth; }
        body { margin:0; background:#070707; }
        ::selection { background:#fff; color:#000; }
      `}</style>

      {/* announcement */}
      <div className="fixed top-0 left-0 right-0 z-[70] bg-white text-black text-[10px] tracking-[.22em] text-center py-2">
        FREE SHIPPING ON ORDERS OVER ₹2,999 · EASY 7-DAY RETURNS
      </div>

      {/* nav */}
      <nav className="fixed top-7 left-0 right-0 z-50 px-4 md:px-8 py-5">
        <div className="max-w-[1600px] mx-auto rounded-full border border-white/10 bg-black/45 backdrop-blur-xl px-5 md:px-7 py-3 flex items-center justify-between">
          <a href="#" className="leading-none">
            <div className="text-2xl md:text-3xl font-black tracking-[-.09em]">RD</div>
            <div className="text-[6px] tracking-[.43em] text-white/50 mt-1">FASHION UNIVERSE</div>
          </a>

          <div className="hidden lg:flex items-center gap-7 text-[10px] tracking-[.18em]">
            {["NEW", "MEN", "WOMEN", "SNEAKERS", "STREETWEAR"].map(x =>
              <button key={x} onClick={() => { setCategory(x); document.getElementById("shop")?.scrollIntoView(); }} className="text-white/70 hover:text-white transition">{x}</button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={18} strokeWidth={1.5} /></button>
            <button onClick={() => notify(`${wishlist.length} saved item${wishlist.length === 1 ? "" : "s"}`)} className="relative hidden sm:block" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />{wishlist.length > 0 && <span className="absolute -top-2 -right-2 text-[8px] bg-white text-black rounded-full min-w-4 h-4 grid place-items-center">{wishlist.length}</span>}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative" aria-label="Bag">
              <ShoppingBag size={18} strokeWidth={1.5} />{cartCount > 0 && <span className="absolute -top-2 -right-2 text-[8px] bg-white text-black rounded-full min-w-4 h-4 grid place-items-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden" aria-label="Menu"><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section className="relative h-[92vh] min-h-[700px] overflow-hidden flex items-end">
        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2400&q=92" className="absolute inset-0 w-full h-full object-cover" alt="RD fashion campaign" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20">
          <div className="max-w-[1600px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}>
              <p className="text-[9px] md:text-xs tracking-[.42em] text-white/65 mb-5">RD FASHION UNIVERSE · DROP 01 / 2026</p>
              <h1 className="text-[18vw] md:text-[12vw] font-black leading-[.76] tracking-[-.09em]">WEAR<br />YOUR<br />IDENTITY.</h1>
              <div className="mt-9 flex flex-col md:flex-row gap-4 md:items-center">
                <button onClick={() => document.getElementById("shop")?.scrollIntoView()} className="group flex items-center justify-center gap-5 bg-white text-black px-7 py-4 text-[10px] tracking-[.2em]">
                  SHOP THE DROP <ArrowUpRight size={16} className="group-hover:rotate-45 transition" />
                </button>
                <button onClick={() => document.getElementById("collections")?.scrollIntoView()} className="px-7 py-4 border border-white/35 text-[10px] tracking-[.2em] hover:bg-white hover:text-black transition">EXPLORE COLLECTIONS</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="border-y border-white/10 py-4 overflow-hidden">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="flex w-max whitespace-nowrap">
          {[0, 1].map(i => <div key={i} className="flex gap-12 px-6 text-[10px] tracking-[.32em] text-white/50"><span>RD FASHION UNIVERSE</span><span>✦</span><span>NEW SEASON</span><span>✦</span><span>FREE SHIPPING ₹2,999+</span><span>✦</span><span>YOUR STYLE. YOUR UNIVERSE.</span><span>✦</span></div>)}
        </motion.div>
      </div>

      {/* intro */}
      <section className="px-6 md:px-12 py-28 md:py-40">
        <div className="max-w-[1250px] mx-auto">
          <p className="text-[9px] tracking-[.4em] text-white/35 mb-7">THE UNIVERSE</p>
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-light tracking-[-.055em] leading-[.93]">Fashion isn't<br /><span className="text-white/30">what you wear.</span><br />It's who you become.</h2>
        </div>
      </section>

      {/* collections */}
      <section id="collections" className="px-4 md:px-8 pb-28">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-8 px-2">
            <div><p className="text-[9px] tracking-[.4em] text-white/35 mb-2">EXPLORE</p><h2 className="text-3xl md:text-5xl tracking-[-.04em]">Enter your universe.</h2></div>
            <span className="hidden md:block text-[9px] tracking-[.2em] text-white/40">04 COLLECTIONS</span>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {collections.map((c) =>
              <motion.button key={c.title} whileHover={{ scale: .995 }} onClick={() => { setCategory(c.title); document.getElementById("shop")?.scrollIntoView(); }} className="group relative h-[58vh] min-h-[470px] overflow-hidden text-left">
                <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.3s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute bottom-7 left-7 right-7 flex justify-between items-end">
                  <div><p className="text-[9px] tracking-[.3em] text-white/55 mb-2">{c.subtitle}</p><h3 className="text-5xl md:text-7xl font-black tracking-[-.07em]">{c.title}</h3></div>
                  <span className="w-11 h-11 rounded-full border border-white/40 grid place-items-center group-hover:bg-white group-hover:text-black transition"><ArrowUpRight size={18} /></span>
                </div>
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* AI stylist */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#101010] px-6 py-28 md:py-36 text-center">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[.035] blur-[120px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-[1000px] mx-auto">
          <Sparkles className="mx-auto text-white/60 mb-6" size={25} strokeWidth={1} />
          <p className="text-[9px] tracking-[.5em] text-white/35">INTRODUCING</p>
          <h2 className="text-6xl md:text-9xl font-black tracking-[-.09em] leading-[.78] mt-5">RD AI<br />STYLIST</h2>
          <p className="max-w-xl mx-auto mt-8 text-sm text-white/45 leading-7">Tell us where you're going and the energy you want. RD AI builds a complete look from the universe.</p>
          <button onClick={() => notify("AI Stylist is ready for your style brief")} className="mt-9 bg-white text-black px-8 py-4 text-[10px] tracking-[.24em] hover:bg-white/80 transition">START STYLING</button>
        </div>
      </section>

      {/* shop */}
      <section id="shop" className="px-4 md:px-8 py-28">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-7 mb-10">
            <div><p className="text-[9px] tracking-[.4em] text-white/35 mb-2">SHOP THE UNIVERSE</p><h2 className="text-4xl md:text-6xl tracking-[-.055em]">Latest pieces.</h2></div>
            <div className="flex flex-wrap items-center gap-2">
              {["ALL", "MEN", "WOMEN", "SNEAKERS", "STREETWEAR"].map(x => <button key={x} onClick={() => setCategory(x)} className={`px-3 py-2 text-[9px] tracking-[.16em] border ${category === x ? "bg-white text-black border-white" : "border-white/15 text-white/55 hover:text-white"}`}>{x}</button>)}
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-[#111] border border-white/15 text-white/60 text-[9px] px-3 py-2 outline-none">
                <option value="featured">Featured</option><option value="low">Price: Low</option><option value="high">Price: High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-12">
            {filtered.map((p, i) =>
              <motion.article key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .04 }} className="group">
                <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
                  <button onClick={() => toggleWish(p.id)} className="absolute z-10 right-3 top-3 w-9 h-9 rounded-full bg-black/45 backdrop-blur grid place-items-center">
                    <Heart size={15} fill={wishlist.includes(p.id) ? "white" : "none"} />
                  </button>
                  <button onClick={() => setSelected(p)} className="absolute inset-0 w-full">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </button>
                  <span className="absolute left-3 top-3 bg-white text-black px-2 py-1 text-[8px] tracking-[.16em]">{p.tag}</span>
                  <button onClick={() => { setSelected(p); setSize(p.sizes[0]); }} className="absolute bottom-3 left-3 right-3 bg-white text-black py-3 text-[9px] tracking-[.2em] translate-y-16 group-hover:translate-y-0 transition-transform duration-400">QUICK ADD</button>
                </div>
                <button onClick={() => setSelected(p)} className="text-left w-full mt-4">
                  <div className="flex justify-between gap-2"><h3 className="text-xs md:text-sm">{p.name}</h3><span className="text-xs">{money(p.price)}</span></div>
                  <p className="text-[9px] text-white/35 mt-2 tracking-[.12em]">{p.type.toUpperCase()} · RD COLLECTION</p>
                  {p.oldPrice && <p className="text-[9px] text-white/30 line-through mt-1">{money(p.oldPrice)}</p>}
                </button>
              </motion.article>
            )}
          </div>
          {!filtered.length && <div className="py-24 text-center text-white/40">No pieces found. Try another search or category.</div>}
        </div>
      </section>

      {/* benefits */}
      <section className="border-y border-white/10 grid md:grid-cols-3">
        {[
          { title: "FREE DELIVERY", desc: "On orders above ₹2,999", Icon: Truck },
          { title: "7-DAY RETURNS", desc: "Simple, hassle-free returns", Icon: RotateCcw },
          { title: "SECURE CHECKOUT", desc: "Safe and protected payments", Icon: Check },
        ].map(({ title, desc, Icon }) =>
          <div key={title} className="px-7 py-10 border-b md:border-b-0 md:border-r border-white/10 last:border-0 flex gap-4 items-start"><Icon size={18} strokeWidth={1} /><div><p className="text-[10px] tracking-[.18em]">{title}</p><p className="text-xs text-white/35 mt-2">{desc}</p></div></div>
        )}
      </section>

      {/* newsletter */}
      <section className="px-6 py-28 text-center">
        <p className="text-[9px] tracking-[.45em] text-white/35">THE INNER CIRCLE</p>
        <h2 className="text-4xl md:text-6xl tracking-[-.06em] mt-5">First access. No noise.</h2>
        <form onSubmit={e => { e.preventDefault(); if (email) { notify("You're on the list"); setEmail(""); } }} className="max-w-lg mx-auto mt-9 flex border-b border-white/25">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent py-4 text-[10px] tracking-[.18em] outline-none placeholder:text-white/25" />
          <button className="text-[10px] tracking-[.18em] px-3">JOIN <ArrowRight size={14} className="inline ml-2" /></button>
        </form>
      </section>

      <footer className="border-t border-white/10 px-6 md:px-10 py-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div><div className="text-4xl font-black tracking-[-.09em]">RD</div><p className="text-[7px] tracking-[.45em] text-white/35 mt-2">FASHION UNIVERSE</p></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-[9px] tracking-[.14em]">
            <div><p className="text-white/30 mb-4">SHOP</p><p className="mb-2">MEN</p><p className="mb-2">WOMEN</p><p>SNEAKERS</p></div>
            <div><p className="text-white/30 mb-4">DISCOVER</p><p className="mb-2">NEW ARRIVALS</p><p className="mb-2">STREETWEAR</p><p>RD AI</p></div>
            <div><p className="text-white/30 mb-4">HELP</p><p className="mb-2">CONTACT</p><p className="mb-2">SHIPPING</p><p>RETURNS</p></div>
            <div><p className="text-white/30 mb-4">FOLLOW</p><p className="mb-2">INSTAGRAM</p><p className="mb-2">YOUTUBE</p><p>PINTEREST</p></div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-5 flex justify-between text-[8px] tracking-[.12em] text-white/25"><span>© 2026 RD FASHION UNIVERSE</span><span>YOUR STYLE. YOUR UNIVERSE.</span></div>
      </footer>

      {/* search overlay */}
      <AnimatePresence>
        {searchOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-6 md:p-12">
          <button onClick={() => setSearchOpen(false)} className="absolute top-7 right-7"><X /></button>
          <div className="max-w-4xl mx-auto mt-24">
            <p className="text-[9px] tracking-[.4em] text-white/35">SEARCH THE UNIVERSE</p>
            <div className="flex items-center border-b border-white/25 mt-5"><Search size={22} className="text-white/40" /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, categories..." className="w-full bg-transparent p-5 text-2xl md:text-4xl outline-none" /></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">{filtered.slice(0, 4).map(p => <button key={p.id} onClick={() => { setSearchOpen(false); setSelected(p); }} className="text-left"><img src={p.image} className="aspect-[4/5] object-cover w-full" alt={p.name} /><p className="text-xs mt-2">{p.name}</p><p className="text-xs text-white/40 mt-1">{money(p.price)}</p></button>)}</div>
          </div>
        </motion.div>}
      </AnimatePresence>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-[100] bg-[#080808] p-7">
          <button onClick={() => setMenuOpen(false)} className="absolute top-7 right-7"><X /></button>
          <div className="mt-24 text-5xl font-black tracking-[-.06em] space-y-5">{["NEW", "MEN", "WOMEN", "SNEAKERS", "STREETWEAR"].map(x => <button key={x} onClick={() => { setCategory(x); setMenuOpen(false); document.getElementById("shop")?.scrollIntoView(); }} className="block">{x}</button>)}</div>
        </motion.div>}
      </AnimatePresence>

      {/* product modal */}
      <AnimatePresence>
        {selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md p-3 md:p-8 grid place-items-center" onClick={() => setSelected(null)}>
          <motion.div initial={{ y: 25 }} animate={{ y: 0 }} onClick={e => e.stopPropagation()} className="bg-[#101010] max-w-4xl w-full max-h-[94vh] overflow-auto grid md:grid-cols-2">
            <div className="relative"><img src={selected.image} className="w-full h-full min-h-[430px] object-cover" alt={selected.name} /><button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/60 rounded-full grid place-items-center"><X size={17} /></button></div>
            <div className="p-7 md:p-10">
              <p className="text-[9px] tracking-[.25em] text-white/35">{selected.category.toUpperCase()} · {selected.type.toUpperCase()}</p>
              <h2 className="text-3xl md:text-4xl tracking-[-.04em] mt-3">{selected.name}</h2>
              <div className="flex items-center gap-3 mt-5"><span className="text-lg">{money(selected.price)}</span>{selected.oldPrice && <span className="text-sm text-white/30 line-through">{money(selected.oldPrice)}</span>}</div>
              <p className="text-xs text-white/40 leading-6 mt-6">Designed for everyday movement with a premium finish and an easy modern silhouette. Part of the RD Fashion Universe.</p>
              <div className="mt-8"><div className="flex justify-between text-[9px] tracking-[.15em] mb-3"><span>SELECT SIZE</span><span className="text-white/35">SIZE GUIDE</span></div><div className="grid grid-cols-5 gap-2">{selected.sizes.map((s: string) => <button key={s} onClick={() => setSize(s)} className={`py-3 border text-xs ${size === s ? "bg-white text-black border-white" : "border-white/15"}`}>{s}</button>)}</div></div>
              <button onClick={() => addToCart(selected, size || selected.sizes[0])} className="w-full mt-7 bg-white text-black py-4 text-[10px] tracking-[.2em]">ADD TO BAG · {money(selected.price)}</button>
              <div className="grid grid-cols-2 gap-3 mt-7 text-[9px] text-white/45"><span>✓ Premium packaging</span><span>✓ 7-day returns</span><span>✓ Secure checkout</span><span>✓ Authentic RD product</span></div>
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>

      {/* cart drawer */}
      <AnimatePresence>
        {cartOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/60" onClick={() => setCartOpen(false)}>
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} onClick={e => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-[#0c0c0c] border-l border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between"><div><p className="text-[9px] tracking-[.3em] text-white/35">YOUR BAG</p><h2 className="text-2xl mt-1">{cartCount} {cartCount === 1 ? "item" : "items"}</h2></div><button onClick={() => setCartOpen(false)}><X /></button></div>
            <div className="flex-1 overflow-auto p-5 space-y-5">
              {!cart.length ? <div className="h-full grid place-items-center text-center text-white/35"><ShoppingBag className="mx-auto mb-4" size={35} strokeWidth={1} /><p>Your bag is empty.</p><button onClick={() => { setCartOpen(false); document.getElementById("shop")?.scrollIntoView(); }} className="mt-5 bg-white text-black px-6 py-3 text-[9px] tracking-[.2em]">START SHOPPING</button></div> :
                cart.map((x, i) => <div key={`${x.id}-${x.size}`} className="flex gap-4 border-b border-white/10 pb-5"><img src={x.image} className="w-24 h-28 object-cover" alt={x.name} /><div className="flex-1"><div className="flex justify-between gap-3"><p className="text-sm">{x.name}</p><button onClick={() => removeCart(i)}><Trash2 size={14} className="text-white/35" /></button></div><p className="text-[9px] text-white/35 mt-2">SIZE {x.size}</p><div className="flex items-center justify-between mt-5"><div className="flex items-center border border-white/15"><button onClick={() => changeQty(i, -1)} className="p-2"><Minus size={12} /></button><span className="text-xs w-7 text-center">{x.qty}</span><button onClick={() => changeQty(i, 1)} className="p-2"><Plus size={12} /></button></div><span className="text-sm">{money(x.price * x.qty)}</span></div></div></div>)}
            </div>
            {!!cart.length && <div className="p-6 border-t border-white/10"><div className="flex justify-between text-sm"><span className="text-white/45">Subtotal</span><span>{money(subtotal)}</span></div><p className="text-[9px] text-white/30 mt-2">Shipping and taxes calculated at checkout.</p><button onClick={() => notify("Checkout flow ready to connect")} className="w-full bg-white text-black py-4 mt-5 text-[10px] tracking-[.2em]">PROCEED TO CHECKOUT · {money(subtotal)}</button></div>}
          </motion.aside>
        </motion.div>}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed z-[150] bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-3 text-[10px] tracking-[.15em] shadow-2xl">{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
