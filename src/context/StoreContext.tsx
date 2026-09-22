import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: Product[];
  toasts: Toast[];
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  cartOpen: boolean;
  selectedProduct: Product | null;
  activeCollection: string;
  searchQuery: string;
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: number) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setActiveCollection: (collection: string) => void;
  setSearchQuery: (query: string) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCollection, setActiveCollection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, size: string, color: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, size, color }];
    });
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((productId: number, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: number, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast("Cart cleared", "info");
  }, [showToast]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        showToast("Removed from wishlist", "info");
        return prev.filter((p) => p.id !== product.id);
      }
      showToast("Added to wishlist ❤️");
      return [...prev, product];
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some((p) => p.id === productId);
  }, [wishlist]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart, wishlist, toasts, searchOpen, mobileMenuOpen, cartOpen,
        selectedProduct, activeCollection, searchQuery,
        addToCart, removeFromCart, updateQuantity, clearCart,
        toggleWishlist, isInWishlist, showToast, removeToast,
        setSearchOpen, setMobileMenuOpen, setCartOpen,
        setSelectedProduct, setActiveCollection, setSearchQuery,
        cartTotal, cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
