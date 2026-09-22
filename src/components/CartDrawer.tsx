import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[110] w-full max-w-md bg-[#0a0a0a] border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <span className="text-sm tracking-[0.15em]">YOUR BAG</span>
                <span className="text-[10px] text-white/40">({cart.length} items)</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:text-white/60 transition">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} strokeWidth={1} className="text-white/20 mb-4" />
                  <p className="text-white/40 text-sm">Your bag is empty</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 text-[10px] tracking-[0.2em] border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-3 bg-white/[0.03] rounded-lg"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-white/40 mt-1">Size: {item.size} • {item.color}</p>
                        <p className="text-sm mt-2">₹{(item.product.price * item.quantity).toLocaleString()}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-white/10 rounded">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="p-1.5 hover:text-white/60 transition"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="p-1.5 hover:text-white/60 transition"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-[9px] tracking-[0.15em] text-white/40 hover:text-red-400 transition"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] tracking-[0.2em] text-white/50">SUBTOTAL</span>
                  <span className="text-lg font-medium">₹{cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-white/30 mb-4">Shipping & taxes calculated at checkout</p>
                <button className="w-full py-4 bg-white text-black text-[10px] tracking-[0.25em] font-medium hover:bg-white/90 transition">
                  CHECKOUT
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-3 mt-2 text-[9px] tracking-[0.2em] text-white/40 hover:text-white transition"
                >
                  CLEAR BAG
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
