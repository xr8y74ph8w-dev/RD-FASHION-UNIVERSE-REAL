import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ============ TYPES ============
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  joinedAt: number;
}

export interface UserProduct {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  category: string;
}

export interface UserCollection {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  name: string;
  description: string;
  coverImage: string;
  products: UserProduct[];
  createdAt: number;
  likes: number;
  likedBy: string[];
}

export interface CartItem {
  productId: string;
  collectionId: string;
  sellerId: string;
  product: UserProduct | any;
  size: string;
  color: string;
  qty: number;
  isUserCollection: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: string;
  date: number;
}

interface AppContextType {
  // Auth
  currentUser: User | null;
  users: User[];
  signUp: (name: string, email: string, password: string) => { success: boolean; message: string };
  signIn: (email: string, password: string) => { success: boolean; message: string };
  signOut: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Collections
  collections: UserCollection[];
  addCollection: (col: Omit<UserCollection, "id" | "createdAt" | "likes" | "likedBy">) => void;
  deleteCollection: (id: string) => void;
  updateCollection: (id: string, data: Partial<UserCollection>) => void;
  likeCollection: (id: string) => void;
  getUserCollections: (userId: string) => UserCollection[];

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (productId: string, collectionId: string, size: string) => void;
  updateCartQty: (productId: string, collectionId: string, size: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (address: any) => string;

  // Toast
  toast: string;
  toastType: "success" | "info" | "error";
  notify: (msg: string, type?: "success" | "info" | "error") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const getAvatar = (name: string) => `https://api.dicebear.com/7.0/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=111111&textColor=ffffff`;

// ============ PROVIDER ============
export function AppProvider({ children }: { children: ReactNode }) {
  // Load from localStorage
  const [users, setUsers] = useState<User[]>(() => {
    try { return JSON.parse(localStorage.getItem("rd_users") || "[]"); } catch { return []; }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try { const u = localStorage.getItem("rd_current_user"); return u ? JSON.parse(u) : null; } catch { return null; }
  });
  const [collections, setCollections] = useState<UserCollection[]>(() => {
    try { return JSON.parse(localStorage.getItem("rd_collections") || "[]"); } catch { return []; }
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("rd_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("rd_wishlist") || "[]"); } catch { return []; }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try { return JSON.parse(localStorage.getItem("rd_orders") || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "info" | "error">("success");

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("rd_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("rd_current_user", JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem("rd_collections", JSON.stringify(collections)); }, [collections]);
  useEffect(() => { localStorage.setItem("rd_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("rd_wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("rd_orders", JSON.stringify(orders)); }, [orders]);

  const notify = useCallback((msg: string, type: "success" | "info" | "error" = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 2500);
  }, []);

  // Auth
  const signUp = useCallback((name: string, email: string, password: string) => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already registered" };
    }
    const newUser: User = {
      id: genId(),
      name,
      email,
      password,
      avatar: getAvatar(name),
      bio: "",
      joinedAt: Date.now(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: "Welcome to RD Universe!" };
  }, [users]);

  const signIn = useCallback((email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, message: "Invalid email or password" };
    setCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.name}!` };
  }, [users]);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    notify("Signed out successfully", "info");
  }, [notify]);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    notify("Profile updated");
  }, [currentUser, notify]);

  // Collections
  const addCollection = useCallback((col: Omit<UserCollection, "id" | "createdAt" | "likes" | "likedBy">) => {
    const newCol: UserCollection = { ...col, id: genId(), createdAt: Date.now(), likes: 0, likedBy: [] };
    setCollections(prev => [newCol, ...prev]);
    notify("Collection published! 🎉");
  }, [notify]);

  const deleteCollection = useCallback((id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    notify("Collection deleted", "info");
  }, [notify]);

  const updateCollection = useCallback((id: string, data: Partial<UserCollection>) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const likeCollection = useCallback((id: string) => {
    if (!currentUser) { notify("Please sign in to like", "info"); return; }
    setCollections(prev => prev.map(c => {
      if (c.id !== id) return c;
      const liked = c.likedBy.includes(currentUser.id);
      return {
        ...c,
        likedBy: liked ? c.likedBy.filter(uid => uid !== currentUser.id) : [...c.likedBy, currentUser.id],
        likes: liked ? c.likes - 1 : c.likes + 1,
      };
    }));
  }, [currentUser, notify]);

  const getUserCollections = useCallback((userId: string) => {
    return collections.filter(c => c.userId === userId);
  }, [collections]);

  // Cart
  const addToCart = useCallback((item: Omit<CartItem, "qty">) => {
    setCart(prev => {
      const found = prev.find(x =>
        x.productId === item.productId &&
        x.collectionId === item.collectionId &&
        x.size === item.size &&
        x.color === item.color
      );
      if (found) {
        return prev.map(x => x === found ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    notify("Added to bag ✓");
  }, [notify]);

  const removeFromCart = useCallback((productId: string, collectionId: string, size: string) => {
    setCart(prev => prev.filter(x => !(x.productId === productId && x.collectionId === collectionId && x.size === size)));
  }, []);

  const updateCartQty = useCallback((productId: string, collectionId: string, size: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId, collectionId, size); return; }
    setCart(prev => prev.map(x =>
      x.productId === productId && x.collectionId === collectionId && x.size === size
        ? { ...x, qty } : x
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((a, x) => a + x.product.price * x.qty, 0);
  const cartCount = cart.reduce((a, x) => a + x.qty, 0);

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) { notify("Removed from wishlist", "info"); return prev.filter(id => id !== productId); }
      notify("Saved to wishlist ❤️");
      return [...prev, productId];
    });
  }, [notify]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Orders
  const placeOrder = useCallback((address: any) => {
    if (!currentUser) return "";
    const order: Order = {
      id: "RD" + Date.now().toString(36).toUpperCase(),
      userId: currentUser.id,
      items: [...cart],
      total: cartTotal + (cartTotal < 2999 ? 99 : 0),
      status: "Confirmed",
      date: Date.now(),
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    return order.id;
  }, [currentUser, cart, cartTotal]);

  return (
    <AppContext.Provider value={{
      currentUser, users, signUp, signIn, signOut, updateProfile,
      collections, addCollection, deleteCollection, updateCollection, likeCollection, getUserCollections,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist,
      orders, placeOrder,
      toast, toastType, notify,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
