import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const color = selectedColor || product.colors[0];
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, color);
    }
    setSelectedProduct(null);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0c0c0c] border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition ${
                  inWishlist ? "bg-red-500 text-white" : "bg-black/40 backdrop-blur-md text-white hover:bg-black/60"
                }`}
              >
                <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
              </button>
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-white text-black text-[9px] tracking-[0.2em] px-3 py-1.5 font-medium">
                  NEW
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">{product.collection}</p>
                  <h2 className="text-xl md:text-2xl font-medium mt-2">{product.name}</h2>
                </div>
                <button onClick={handleClose} className="p-2 hover:text-white/60 transition">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl font-medium">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-sm text-white/30 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
                {product.originalPrice && (
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-sm text-white/50 mt-4 leading-relaxed">{product.description}</p>

              {/* Size Selection */}
              <div className="mt-6">
                <p className="text-[10px] tracking-[0.2em] text-white/40 mb-3">SELECT SIZE</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-10 px-3 text-xs border rounded transition ${
                        selectedSize === size
                          ? "border-white bg-white text-black"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-[9px] text-amber-400/70 mt-2">Please select a size</p>
                )}
              </div>

              {/* Color Selection */}
              <div className="mt-5">
                <p className="text-[10px] tracking-[0.2em] text-white/40 mb-3">COLOR: {selectedColor || product.colors[0]}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 text-[10px] border rounded transition ${
                        (selectedColor || product.colors[0]) === color
                          ? "border-white bg-white/10"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-5">
                <p className="text-[10px] tracking-[0.2em] text-white/40 mb-3">QUANTITY</p>
                <div className="flex items-center gap-3 border border-white/20 rounded w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:text-white/60 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:text-white/60 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`mt-auto pt-6 w-full flex items-center justify-center gap-3 py-4 text-[10px] tracking-[0.25em] font-medium transition ${
                  selectedSize
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/20 text-white/40 cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={16} />
                ADD TO BAG — ₹{(product.price * quantity).toLocaleString()}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
