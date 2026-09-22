import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Heart } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { products, collections as collectionData } from "../data/products";

/* ==================== HERO ==================== */
export function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-end">
      <img
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=90"
        alt="Fashion"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />

      <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-[10px] md:text-xs tracking-[0.45em] text-white/70 mb-6">
              RD FASHION UNIVERSE — 2026
            </p>
            <h1 className="text-[17vw] md:text-[13vw] leading-[0.78] font-black tracking-[-0.08em]">
              WEAR<br />YOUR<br />IDENTITY.
            </h1>
            <div className="mt-10 flex flex-col md:flex-row md:items-center gap-6">
              <p className="max-w-md text-sm md:text-base text-white/65 leading-relaxed">
                Fashion curated for the way you move, think and express yourself.
              </p>
              <button
                onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}
                className="group flex items-center gap-4 border border-white/30 px-7 py-4 w-fit hover:bg-white hover:text-black transition-all duration-500"
              >
                <span className="text-[11px] tracking-[0.2em]">EXPLORE COLLECTION</span>
                <ArrowUpRight size={17} className="group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-8 bottom-10 hidden md:block text-[9px] tracking-[0.3em] text-white/50 [writing-mode:vertical-rl]">
        SCROLL TO EXPLORE
      </div>
    </section>
  );
}

/* ==================== MARQUEE ==================== */
export function Marquee() {
  return (
    <div className="border-y border-white/10 py-5 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap w-max"
      >
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-center gap-12 px-6 text-xs md:text-sm tracking-[0.3em] text-white/60">
            <span>RD FASHION UNIVERSE</span><span>✦</span>
            <span>YOUR STYLE. YOUR UNIVERSE.</span><span>✦</span>
            <span>NEW SEASON 2026</span><span>✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ==================== INTRO ==================== */
export function Intro() {
  return (
    <section className="px-6 md:px-12 py-32 md:py-48">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-[10px] tracking-[0.4em] text-white/40 mb-8">THE UNIVERSE</p>
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-light tracking-[-0.05em] leading-[0.95]">
          Fashion isn't<br />
          <span className="text-white/35">what you wear.</span><br />
          It's who you become.
        </h2>
      </div>
    </section>
  );
}

/* ==================== COLLECTIONS ==================== */
export function Collections() {
  const { activeCollection, setActiveCollection } = useStore();

  return (
    <section id="collections" className="px-6 md:px-12 pb-32">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-3">EXPLORE</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Enter your universe.</h2>
          </div>
        </div>

        {/* Collection Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {collectionData.map((col) => (
            <button
              key={col.id}
              onClick={() => {
                setActiveCollection(col.id);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-5 py-2.5 text-[10px] tracking-[0.2em] border rounded-full whitespace-nowrap transition-all ${
                activeCollection === col.id
                  ? "bg-white text-black border-white"
                  : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>

        {/* Collection Grid */}
        <div className="grid md:grid-cols-2 gap-3">
          {collectionData.filter(c => c.id !== "all").map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              onClick={() => {
                setActiveCollection(item.id);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative h-[400px] md:h-[550px] overflow-hidden cursor-pointer"
            >
              <img
                src={
                  item.id === "men"
                    ? "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1400&q=85"
                    : item.id === "women"
                    ? "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85"
                    : item.id === "sneakers"
                    ? "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1400&q=85"
                    : "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=85"
                }
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-[10px] tracking-[0.3em] text-white/60 mb-3">{item.subtitle}</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-5xl md:text-7xl font-black tracking-[-0.06em]">{item.title}</h3>
                  <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight size={19} />
                  </div>
                </div>
                <p className="text-[10px] text-white/40 mt-3">
                  {products.filter(p => p.collection === item.id).length} products
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== AI STYLIST ==================== */
export function AIStylist() {
  return (
    <section className="relative min-h-[700px] flex items-center px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-[#111]" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles className="mx-auto mb-8 text-white/70" size={28} strokeWidth={1} />
          <p className="text-[10px] tracking-[0.5em] text-white/40 mb-7">INTRODUCING</p>
          <h2 className="text-6xl md:text-9xl font-black tracking-[-0.08em] leading-[0.8]">
            RD AI<br />STYLIST
          </h2>
          <p className="max-w-xl mx-auto mt-10 text-white/50 leading-relaxed">
            Tell us where you're going, what you're feeling and how you want to look. RD AI creates your complete outfit in seconds.
          </p>
          <button className="mt-10 px-8 py-4 bg-white text-black text-[10px] tracking-[0.25em] hover:bg-white/80 transition">
            START STYLING
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ==================== PRODUCTS ==================== */
export function Products() {
  const { activeCollection, searchQuery, setSelectedProduct, toggleWishlist, isInWishlist } = useStore();

  const filteredProducts = products.filter((p) => {
    const matchesCollection = activeCollection === "all" || p.collection === activeCollection;
    const matchesSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCollection && matchesSearch;
  });

  return (
    <section id="products" className="px-6 md:px-12 py-32">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.4em] text-white/40 mb-3">CURATED FOR YOU</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl md:text-6xl tracking-[-0.05em]">
              {searchQuery ? `Results for "${searchQuery}"` : "The latest pieces."}
            </h2>
            <span className="text-[10px] text-white/30 tracking-[0.2em]">{filteredProducts.length} ITEMS</span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-lg">No products found</p>
            <p className="text-white/20 text-sm mt-2">Try a different search or collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden bg-[#111] rounded-lg cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {product.isNew && (
                      <span className="bg-white text-black text-[8px] tracking-[0.15em] px-2 py-1 rounded font-medium">NEW</span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-amber-400 text-black text-[8px] tracking-[0.15em] px-2 py-1 rounded font-medium">BESTSELLER</span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-red-500 text-white text-[8px] tracking-[0.15em] px-2 py-1 rounded font-medium">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition ${
                      isInWishlist(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-black/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Quick Add */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                    className="absolute bottom-3 left-3 right-3 py-3 bg-white text-black text-[9px] tracking-[0.2em] font-medium translate-y-20 group-hover:translate-y-0 transition-transform duration-500 rounded"
                  >
                    QUICK VIEW
                  </button>
                </div>

                <div className="mt-3 px-1">
                  <p className="text-[9px] tracking-[0.2em] text-white/30 uppercase">{product.collection}</p>
                  <h3 className="text-xs md:text-sm mt-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-xs md:text-sm">₹{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="text-[10px] text-white/30 line-through">₹{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ==================== NEWSLETTER ==================== */
export function Newsletter() {
  return (
    <section className="px-6 md:px-12 py-20 border-t border-white/10">
      <div className="max-w-[800px] mx-auto text-center">
        <p className="text-[10px] tracking-[0.4em] text-white/40 mb-4">STAY CONNECTED</p>
        <h3 className="text-2xl md:text-4xl font-light tracking-tight mb-3">Join the universe.</h3>
        <p className="text-sm text-white/40 mb-8">Get early access to drops, exclusive offers and style inspiration.</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 bg-white/5 border border-white/10 px-5 py-3.5 text-sm outline-none focus:border-white/30 transition placeholder:text-white/20 rounded"
          />
          <button className="px-6 py-3.5 bg-white text-black text-[10px] tracking-[0.2em] font-medium hover:bg-white/90 transition rounded">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
}

/* ==================== FINAL CTA ==================== */
export function FinalCTA() {
  return (
    <section className="min-h-[650px] flex items-center justify-center px-6 text-center border-t border-white/10">
      <div>
        <p className="text-[10px] tracking-[0.5em] text-white/40 mb-8">RD FASHION UNIVERSE</p>
        <h2 className="text-[15vw] md:text-[11vw] font-black tracking-[-0.09em] leading-[0.75]">
          YOUR<br />UNIVERSE.
        </h2>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-12 border border-white/30 px-9 py-5 text-[10px] tracking-[0.25em] hover:bg-white hover:text-black transition"
        >
          ENTER THE UNIVERSE
        </button>
      </div>
    </section>
  );
}

/* ==================== FOOTER ==================== */
export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 md:px-12 py-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <div className="text-4xl font-black tracking-[-0.08em]">RD</div>
            <p className="text-[8px] tracking-[0.45em] text-white/40 mt-2">FASHION UNIVERSE</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] tracking-[0.15em]">
            <div>
              <p className="text-white/30 mb-4">SHOP</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">MEN</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">WOMEN</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">SNEAKERS</p>
            </div>
            <div>
              <p className="text-white/30 mb-4">DISCOVER</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">NEW ARRIVALS</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">STREETWEAR</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">RD AI</p>
            </div>
            <div>
              <p className="text-white/30 mb-4">HELP</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">CONTACT</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">SHIPPING</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">RETURNS</p>
            </div>
            <div>
              <p className="text-white/30 mb-4">FOLLOW</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">INSTAGRAM</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">YOUTUBE</p>
              <p className="mb-2 text-white/60 hover:text-white cursor-pointer transition">PINTEREST</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[9px] tracking-[0.15em] text-white/30">
          <span>© 2026 RD FASHION UNIVERSE</span>
          <span>YOUR STYLE. YOUR UNIVERSE.</span>
        </div>
      </div>
    </footer>
  );
}
