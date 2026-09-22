import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Search,
  Heart,
  ShoppingBag,
  Menu,
  Sparkles,
} from "lucide-react";

const collections = [
  {
    title: "MEN",
    subtitle: "Sharp. Minimal. Powerful.",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "WOMEN",
    subtitle: "Defined by individuality.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "SNEAKERS",
    subtitle: "Built for the streets.",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "STREETWEAR",
    subtitle: "Own the moment.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=85",
  },
];

const products = [
  {
    name: "RD Essential Oversized Tee",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Urban Cargo Collection",
    price: "₹2,999",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "RD Signature Sneakers",
    price: "₹4,999",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">

          <div className="flex items-center gap-12">
            <div className="leading-none">
              <div className="text-3xl md:text-4xl font-black tracking-[-0.08em]">
                RD
              </div>
              <div className="text-[7px] tracking-[0.45em] text-white/60 mt-1">
                FASHION UNIVERSE
              </div>
            </div>

            <div className="hidden lg:flex gap-8 text-[11px] tracking-[0.18em]">
              {["NEW", "MEN", "WOMEN", "SNEAKERS", "STREETWEAR"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white/75 hover:text-white transition"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="hidden md:block hover:text-white/60 transition">
              <Search size={19} strokeWidth={1.5} />
            </button>

            <button className="hidden md:block hover:text-white/60 transition">
              <Heart size={19} strokeWidth={1.5} />
            </button>

            <button className="hover:text-white/60 transition">
              <ShoppingBag size={19} strokeWidth={1.5} />
            </button>

            <button className="lg:hidden">
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
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
                WEAR
                <br />
                YOUR
                <br />
                IDENTITY.
              </h1>

              <div className="mt-10 flex flex-col md:flex-row md:items-center gap-6">
                <p className="max-w-md text-sm md:text-base text-white/65 leading-relaxed">
                  Fashion curated for the way you move, think and express
                  yourself.
                </p>

                <button className="group flex items-center gap-4 border border-white/30 px-7 py-4 w-fit hover:bg-white hover:text-black transition-all duration-500">
                  <span className="text-[11px] tracking-[0.2em]">
                    EXPLORE COLLECTION
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="group-hover:rotate-45 transition-transform"
                  />
                </button>
              </div>
            </motion.div>

          </div>
        </div>

        <div className="absolute right-8 bottom-10 hidden md:block text-[9px] tracking-[0.3em] text-white/50 [writing-mode:vertical-rl]">
          SCROLL TO EXPLORE
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-white/10 py-5 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap w-max"
        >
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-12 px-6 text-xs md:text-sm tracking-[0.3em] text-white/60"
            >
              <span>RD FASHION UNIVERSE</span>
              <span>✦</span>
              <span>YOUR STYLE. YOUR UNIVERSE.</span>
              <span>✦</span>
              <span>NEW SEASON 2026</span>
              <span>✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* INTRO */}
      <section className="px-6 md:px-12 py-32 md:py-48">
        <div className="max-w-[1200px] mx-auto">

          <p className="text-[10px] tracking-[0.4em] text-white/40 mb-8">
            THE UNIVERSE
          </p>

          <h2 className="text-4xl md:text-7xl lg:text-8xl font-light tracking-[-0.05em] leading-[0.95]">
            Fashion isn't
            <br />
            <span className="text-white/35">what you wear.</span>
            <br />
            It's who you become.
          </h2>

        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="px-6 md:px-12 pb-32">

        <div className="max-w-[1600px] mx-auto">

          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-white/40 mb-3">
                EXPLORE
              </p>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
                Enter your universe.
              </h2>
            </div>

            <button className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] text-white/60">
              VIEW ALL <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">

            {collections.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="group relative h-[550px] md:h-[700px] overflow-hidden"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[10px] tracking-[0.3em] text-white/60 mb-3">
                    {item.subtitle}
                  </p>

                  <div className="flex justify-between items-end">
                    <h3 className="text-5xl md:text-7xl font-black tracking-[-0.06em]">
                      {item.title}
                    </h3>

                    <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowUpRight size={19} />
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* AI STYLIST */}
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
            <Sparkles
              className="mx-auto mb-8 text-white/70"
              size={28}
              strokeWidth={1}
            />

            <p className="text-[10px] tracking-[0.5em] text-white/40 mb-7">
              INTRODUCING
            </p>

            <h2 className="text-6xl md:text-9xl font-black tracking-[-0.08em] leading-[0.8]">
              RD AI
              <br />
              STYLIST
            </h2>

            <p className="max-w-xl mx-auto mt-10 text-white/50 leading-relaxed">
              Tell us where you're going, what you're feeling and how you want
              to look. RD AI creates your complete outfit in seconds.
            </p>

            <button className="mt-10 px-8 py-4 bg-white text-black text-[10px] tracking-[0.25em] hover:bg-white/80 transition">
              START STYLING
            </button>
          </motion.div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 md:px-12 py-32">

        <div className="max-w-[1600px] mx-auto">

          <div className="mb-12">
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-3">
              CURATED FOR YOU
            </p>

            <h2 className="text-4xl md:text-6xl tracking-[-0.05em]">
              The latest pieces.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >

                <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                    <Heart size={16} strokeWidth={1.5} />
                  </button>

                  <button className="absolute bottom-4 left-4 right-4 py-4 bg-white text-black text-[10px] tracking-[0.2em] translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    QUICK ADD
                  </button>

                </div>

                <div className="flex justify-between mt-5">
                  <div>
                    <h3 className="text-sm">{product.name}</h3>
                    <p className="text-xs text-white/40 mt-2">
                      RD COLLECTION
                    </p>
                  </div>

                  <p className="text-sm">{product.price}</p>
                </div>

              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="min-h-[650px] flex items-center justify-center px-6 text-center border-t border-white/10">

        <div>

          <p className="text-[10px] tracking-[0.5em] text-white/40 mb-8">
            RD FASHION UNIVERSE
          </p>

          <h2 className="text-[15vw] md:text-[11vw] font-black tracking-[-0.09em] leading-[0.75]">
            YOUR
            <br />
            UNIVERSE.
          </h2>

          <button className="mt-12 border border-white/30 px-9 py-5 text-[10px] tracking-[0.25em] hover:bg-white hover:text-black transition">
            ENTER THE UNIVERSE
          </button>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-12">

        <div className="max-w-[1600px] mx-auto">

          <div className="flex flex-col md:flex-row justify-between gap-10">

            <div>
              <div className="text-4xl font-black tracking-[-0.08em]">
                RD
              </div>

              <p className="text-[8px] tracking-[0.45em] text-white/40 mt-2">
                FASHION UNIVERSE
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] tracking-[0.15em]">

              <div>
                <p className="text-white/30 mb-4">SHOP</p>
                <p className="mb-2">MEN</p>
                <p className="mb-2">WOMEN</p>
                <p className="mb-2">SNEAKERS</p>
              </div>

              <div>
                <p className="text-white/30 mb-4">DISCOVER</p>
                <p className="mb-2">NEW ARRIVALS</p>
                <p className="mb-2">STREETWEAR</p>
                <p className="mb-2">RD AI</p>
              </div>

              <div>
                <p className="text-white/30 mb-4">HELP</p>
                <p className="mb-2">CONTACT</p>
                <p className="mb-2">SHIPPING</p>
                <p className="mb-2">RETURNS</p>
              </div>

              <div>
                <p className="text-white/30 mb-4">FOLLOW</p>
                <p className="mb-2">INSTAGRAM</p>
                <p className="mb-2">YOUTUBE</p>
                <p className="mb-2">PINTEREST</p>
              </div>

            </div>

          </div>

          <div className="border-t border-white/10 mt-12 pt-6 flex justify-between text-[9px] tracking-[0.15em] text-white/30">
            <span>© 2026 RD FASHION UNIVERSE</span>
            <span>YOUR STYLE. YOUR UNIVERSE.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;
