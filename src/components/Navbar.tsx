import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const {
    searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen,
    setCartOpen, cartCount, wishlist, searchQuery, setSearchQuery,
    setActiveCollection,
  } = useStore();

  const navItems = ["NEW", "MEN", "WOMEN", "SNEAKERS", "STREETWEAR"];

  const handleNavClick = (item: string) => {
    const collectionMap: Record<string, string> = {
      "NEW": "all",
      "MEN": "men",
      "WOMEN": "women",
      "SNEAKERS": "sneakers",
      "STREETWEAR": "streetwear",
    };
    setActiveCollection(collectionMap[item] || "all");
    setMobileMenuOpen(false);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="leading-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="text-3xl md:text-4xl font-black tracking-[-0.08em]">RD</div>
              <div className="text-[7px] tracking-[0.45em] text-white/60 mt-1">FASHION UNIVERSE</div>
            </div>

            <div className="hidden lg:flex gap-8 text-[11px] tracking-[0.18em]">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-white/75 hover:text-white transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:block hover:text-white/60 transition p-2"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            <button
              onClick={() => {
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden md:block hover:text-white/60 transition p-2 relative"
            >
              <Heart size={19} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[8px] rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="hover:text-white/60 transition p-2 relative"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[8px] rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-start justify-center pt-32 px-6"
          >
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-4 border-b border-white/20 pb-4">
                <Search size={24} strokeWidth={1.5} className="text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 bg-transparent text-2xl md:text-4xl font-light outline-none placeholder:text-white/20"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                  <X size={24} />
                </button>
              </div>
              <p className="text-[10px] tracking-[0.3em] text-white/30 mt-6">
                PRESS ESC TO CLOSE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#080808] pt-24 px-6"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(item)}
                  className="text-left text-4xl font-black tracking-[-0.04em] py-4 border-b border-white/5 flex items-center justify-between group"
                >
                  <span>{item}</span>
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition" />
                </motion.button>
              ))}
            </div>

            <div className="mt-12 flex gap-6">
              <button
                onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
                className="text-[11px] tracking-[0.2em] text-white/50 hover:text-white transition"
              >
                SEARCH
              </button>
              <button
                onClick={() => { setCartOpen(true); setMobileMenuOpen(false); }}
                className="text-[11px] tracking-[0.2em] text-white/50 hover:text-white transition"
              >
                CART ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
