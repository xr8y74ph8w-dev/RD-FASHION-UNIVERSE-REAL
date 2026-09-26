import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  bio: string;
  joinedAt: number;
  role?: 'customer' | 'seller' | 'admin';
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
  mrp?: number;
  stock?: number;
  sellerId?: string;
  collectionId?: string;
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
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  paymentId?: string;
  items: CartItem[];
  total: number;
  status: string;
  deliveryStatus?: string;
  date: number;
  address?: any;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];

  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;

  signInWithGoogle: () => Promise<{
    success: boolean;
    message: string;
  }>;

  signOut: () => Promise<void>;

  updateProfile: (data: Partial<User>) => Promise<void>;

  collections: UserCollection[];

  addCollection: (
    col: Omit<UserCollection, 'id' | 'createdAt' | 'likes' | 'likedBy'>
  ) => Promise<void>;

  deleteCollection: (id: string) => Promise<void>;

  updateCollection: (
    id: string,
    data: Partial<UserCollection>
  ) => Promise<void>;

  likeCollection: (id: string) => Promise<void>;

  getUserCollections: (userId: string) => UserCollection[];

  cart: CartItem[];

  addToCart: (item: Omit<CartItem, 'qty'>) => void;

  removeFromCart: (
    productId: string,
    collectionId: string,
    size: string
  ) => void;

  updateCartQty: (
    productId: string,
    collectionId: string,
    size: string,
    qty: number
  ) => void;

  clearCart: () => void;

  cartTotal: number;
  cartCount: number;

  wishlist: string[];

  toggleWishlist: (productId: string) => Promise<void>;

  isInWishlist: (productId: string) => boolean;

  orders: Order[];

  placeOrder: (address: any) => Promise<string>;

  toast: string;
  toastType: 'success' | 'info' | 'error';

  notify: (
    msg: string,
    type?: 'success' | 'info' | 'error'
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const avatar = (name: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    name || 'User'
  )}`;

export function AppProvider({
  children
}: {
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  const [collections, setCollections] = useState<UserCollection[]>(
    []
  );

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [toast, setToast] = useState('');

  const [toastType, setToastType] = useState<
    'success' | 'info' | 'error'
  >('success');

  /* ---------------- NOTIFICATION ---------------- */

  const notify = useCallback(
    (
      msg: string,
      type: 'success' | 'info' | 'error' = 'success'
    ) => {
      setToast(msg);
      setToastType(type);

      window.setTimeout(() => {
        setToast('');
      }, 2800);
    },
    []
  );

  /* ---------------- PROFILE ---------------- */

  const profile = useCallback(
    async (id: string): Promise<User | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name || 'User',
        email: data.email || '',
        avatar:
          data.avatar ||
          data.avatar_url ||
          avatar(data.name || 'User'),
        bio: data.bio || '',
        joinedAt: data.created_at
          ? new Date(data.created_at).getTime()
          : Date.now(),
        role: data.role || 'customer'
      };
    },
    []
  );

  /* ---------------- LOAD COLLECTIONS ---------------- */

  const loadCollections = useCallback(async () => {
    const { data, error } = await supabase
      .from('collections')
      .select(
        '*, profiles:seller_id(id,name,avatar), products(*)'
      )
      .order('created_at', {
        ascending: false
      });

    if (error) {
      notify(error.message, 'error');
      return;
    }

    const formatted: UserCollection[] = (data || []).map(
      (c: any) => ({
        id: c.id,
        userId: c.seller_id,
        userName: c.profiles?.name || 'Seller',
        userAvatar:
          c.profiles?.avatar ||
          avatar(c.profiles?.name || 'Seller'),
        name: c.name || '',
        description: c.description || '',
        coverImage: c.cover_image || '',
        createdAt: c.created_at
          ? new Date(c.created_at).getTime()
          : Date.now(),
        likes: Number(c.likes || 0),
        likedBy: c.liked_by || [],
        products: (c.products || []).map(
          (p: any): UserProduct => ({
            id: p.id,
            name: p.name || '',
            price: Number(p.price || 0),
            mrp:
              p.mrp !== null && p.mrp !== undefined
                ? Number(p.mrp)
                : undefined,
            sizes: p.sizes || [],
            colors: p.colors || [],
            images: p.images || [],
            description: p.description || '',
            category: p.category || '',
            stock:
              p.stock !== null && p.stock !== undefined
                ? Number(p.stock)
                : undefined,
            sellerId: p.seller_id,
            collectionId: p.collection_id
          })
        )
      })
    );

    setCollections(formatted);
  }, [notify]);

  /* ---------------- AUTH SESSION ---------------- */

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session?.user) {
        const p = await profile(session.user.id);

        if (mounted) {
          setCurrentUser(p);
        }
      }

      await loadCollections();
    };

    initialize();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const p = await profile(session.user.id);

          if (mounted) {
            setCurrentUser(p);
          }
        } else if (mounted) {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [profile, loadCollections]);

  /* ---------------- WISHLIST + ORDERS ---------------- */

  useEffect(() => {
    if (!currentUser) {
      setWishlist([]);
      setOrders([]);
      return;
    }

    let mounted = true;

    const loadUserData = async () => {
      const { data: wishlistData } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', currentUser.id);

      if (mounted) {
        setWishlist(
          (wishlistData || []).map(
            (item: any) => item.product_id
          )
        );
      }

      let { data: orderData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', {
          ascending: false
        });

      if (currentUser.role !== 'admin') {
        orderData = (orderData || []).filter(
          (order: any) => order.user_id === currentUser.id
        );
      }

      const userIds = [
        ...new Set(
          (orderData || [])
            .map((order: any) => order.user_id)
            .filter(Boolean)
        )
      ];

      const { data: profileData } = userIds.length
        ? await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', userIds)
        : { data: [] };

      const profileMap = new Map(
        (profileData || []).map((profile: any) => [
          profile.id,
          profile
        ])
      );

      if (!mounted) {
        return;
      }

      const formattedOrders: Order[] = (orderData || []).map(
        (order: any) => {
          const profile = profileMap.get(order.user_id);

          return {
          id: order.id,
          userId: order.user_id,
          customerName: profile?.name || 'Unknown customer',
          customerEmail: profile?.email || '',
          paymentMethod: order.payment_method || '',
          paymentId: order.payment_id || '',
          total: Number(order.total || 0),
          status: order.status || 'pending',
          deliveryStatus: order.delivery_status || 'PLACED',
          date: order.created_at
            ? new Date(order.created_at).getTime()
            : Date.now(),
          address: order.address,
          items: (order.order_items || []).map(
            (item: any): CartItem => ({
              productId: item.product_id,
              collectionId: item.collection_id || '',
              sellerId: item.seller_id || '',
              product: {
                id: item.product_id,
                name: item.product_name || '',
                price: Number(item.price || 0),
                images: item.image
                  ? [item.image]
                  : [],
                sizes: [],
                colors: [],
                description: '',
                category: ''
              },
              size: item.size || '',
              color: item.color || '',
              qty: Number(item.quantity || 1),
              isUserCollection: true
            })
          )
          };
        }
      );

      setOrders(formattedOrders);
    };

    loadUserData();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  /* ---------------- SIGN UP ---------------- */

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ) => {
      const cleanEmail = email.trim().toLowerCase();

      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name,
            avatar_url: avatar(name)
          },
          emailRedirectTo:
            import.meta.env.VITE_SITE_URL ||
            window.location.origin
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message:
          'Account created. Check your email to verify your account.'
      };
    },
    []
  );

  /* ---------------- SIGN IN ---------------- */

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Login successful.'
      };
    },
    []
  );

  /* ---------------- GOOGLE LOGIN ---------------- */

  const signInWithGoogle = useCallback(async () => {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            import.meta.env.VITE_SITE_URL ||
            window.location.origin
        }
      });

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: true,
      message: 'Redirecting to Google...'
    };
  }, []);

  /* ---------------- SIGN OUT ---------------- */

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      notify(error.message, 'error');
      return;
    }

    setCurrentUser(null);
    setWishlist([]);
    setOrders([]);

    notify('Logged out successfully.', 'success');
  }, [notify]);

  /* ---------------- UPDATE PROFILE ---------------- */

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!currentUser) {
        notify('Please login first.', 'error');
        return;
      }

      const updateData: any = {};

      if (data.name !== undefined) {
        updateData.name = data.name;
      }

      if (data.avatar !== undefined) {
        updateData.avatar = data.avatar;
      }

      if (data.bio !== undefined) {
        updateData.bio = data.bio;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', currentUser.id);

      if (error) {
        notify(error.message, 'error');
        return;
      }

      setCurrentUser({
        ...currentUser,
        ...data
      });

      notify('Profile updated.', 'success');
    },
    [currentUser, notify]
  );

  /* ---------------- ADD COLLECTION ---------------- */

  const addCollection = useCallback(
    async (
      col: Omit<
        UserCollection,
        'id' | 'createdAt' | 'likes' | 'likedBy'
      >
    ) => {
      if (!currentUser) {
        notify('Please login first.', 'error');
        return;
      }

      const { data, error } = await supabase
        .from('collections')
        .insert({
          seller_id: currentUser.id,
          name: col.name,
          description: col.description,
          cover_image: col.coverImage,
          likes: 0
        })
        .select()
        .single();

      if (error) {
        notify(error.message, 'error');
        return;
      }

      const newCollection: UserCollection = {
        ...col,
        id: data.id,
        createdAt: Date.now(),
        likes: 0,
        likedBy: []
      };

      setCollections(prev => [
        newCollection,
        ...prev
      ]);

      notify('Collection created successfully.', 'success');
    },
    [currentUser, notify]
  );

  /* ---------------- DELETE COLLECTION ---------------- */

  const deleteCollection = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) {
        notify(error.message, 'error');
        return;
      }

      setCollections(prev =>
        prev.filter(item => item.id !== id)
      );

      notify('Collection deleted.', 'success');
    },
    [notify]
  );

  /* ---------------- UPDATE COLLECTION ---------------- */

  const updateCollection = useCallback(
    async (
      id: string,
      data: Partial<UserCollection>
    ) => {
      const updateData: any = {};

      if (data.name !== undefined) {
        updateData.name = data.name;
      }

      if (data.description !== undefined) {
        updateData.description =
          data.description;
      }

      if (data.coverImage !== undefined) {
        updateData.cover_image =
          data.coverImage;
      }

      const { error } = await supabase
        .from('collections')
        .update(updateData)
        .eq('id', id);

      if (error) {
        notify(error.message, 'error');
        return;
      }

      setCollections(prev =>
        prev.map(collection =>
          collection.id === id
            ? {
                ...collection,
                ...data
              }
            : collection
        )
      );

      notify('Collection updated.', 'success');
    },
    [notify]
  );

  /* ---------------- LIKE COLLECTION ---------------- */

  const likeCollection = useCallback(
    async (id: string) => {
      if (!currentUser) {
        notify('Please login to like.', 'error');
        return;
      }

      const collection = collections.find(
        item => item.id === id
      );

      if (!collection) {
        return;
      }

      const alreadyLiked =
        collection.likedBy.includes(
          currentUser.id
        );

      const newLikedBy = alreadyLiked
        ? collection.likedBy.filter(
            userId =>
              userId !== currentUser.id
          )
        : [
            ...collection.likedBy,
            currentUser.id
          ];

      const newLikes = Math.max(
        0,
        newLikedBy.length
      );

      const { error } = await supabase
        .from('collections')
        .update({
          likes: newLikes,
          liked_by: newLikedBy
        })
        .eq('id', id);

      if (error) {
        notify(error.message, 'error');
        return;
      }

      setCollections(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                likes: newLikes,
                likedBy: newLikedBy
              }
            : item
        )
      );
    },
    [collections, currentUser, notify]
  );

  /* ---------------- USER COLLECTIONS ---------------- */

  const getUserCollections = useCallback(
    (userId: string) => {
      return collections.filter(
        collection =>
          collection.userId === userId
      );
    },
    [collections]
  );

  /* ---------------- CART ---------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        'rd_cart',
        JSON.stringify(cart)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [cart]);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'qty'>) => {
      setCart(prev => {
        const existingIndex = prev.findIndex(
          cartItem =>
            cartItem.productId ===
              item.productId &&
            cartItem.collectionId ===
              item.collectionId &&
            cartItem.size === item.size &&
            cartItem.color === item.color
        );

        if (existingIndex !== -1) {
          return prev.map(
            (cartItem, index) =>
              index === existingIndex
                ? {
                    ...cartItem,
                    qty: cartItem.qty + 1
                  }
                : cartItem
          );
        }

        return [
          ...prev,
          {
            ...item,
            qty: 1
          }
        ];
      });

      notify('Added to cart.', 'success');
    },
    [notify]
  );

  /* ---------------- REMOVE CART ITEM ---------------- */

  const removeFromCart = useCallback(
    (
      productId: string,
      collectionId: string,
      size: string
    ) => {
      setCart(prev =>
        prev.filter(
          item =>
            !(
              item.productId === productId &&
              item.collectionId ===
                collectionId &&
              item.size === size
            )
        )
      );
    },
    []
  );

  /* ---------------- UPDATE CART QTY ---------------- */

  const updateCartQty = useCallback(
    (
      productId: string,
      collectionId: string,
      size: string,
      qty: number
    ) => {
      if (qty <= 0) {
        removeFromCart(
          productId,
          collectionId,
          size
        );
        return;
      }

      setCart(prev =>
        prev.map(item =>
          item.productId === productId &&
          item.collectionId ===
            collectionId &&
          item.size === size
            ? {
                ...item,
                qty
              }
            : item
        )
      );
    },
    [removeFromCart]
  );

  /* ---------------- CLEAR CART ---------------- */

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('rd_cart');
  }, []);

  /* ---------------- CART TOTAL ---------------- */

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.product?.price || 0) *
        item.qty,
    0
  );

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.qty || 0),
    0
  );

  /* ---------------- WISHLIST ---------------- */

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!currentUser) {
        notify(
          'Please login to use wishlist.',
          'error'
        );
        return;
      }

      const exists =
        wishlist.includes(productId);

      if (exists) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('product_id', productId);

        if (error) {
          notify(error.message, 'error');
          return;
        }

        setWishlist(prev =>
          prev.filter(id => id !== productId)
        );
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: currentUser.id,
            product_id: productId
          });

        if (error) {
          notify(error.message, 'error');
          return;
        }

        setWishlist(prev => [
          ...prev,
          productId
        ]);
      }
    },
    [currentUser, wishlist, notify]
  );

  const isInWishlist = useCallback(
    (productId: string) =>
      wishlist.includes(productId),
    [wishlist]
  );

  /* ---------------- PLACE ORDER ---------------- */

const updateOrderDeliveryStatus = useCallback(
  async (orderId: string, deliveryStatus: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Admin access required.');
    }

    const { error } = await supabase
      .from('orders')
      .update({ delivery_status: deliveryStatus })
      .eq('id', orderId);

    if (error) {
      throw new Error(error.message);
    }

    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, deliveryStatus }
          : order
      )
    );
  },
  [currentUser]
);

const placeOrder = useCallback(
  async (orderData: any): Promise<string> => {
    if (!currentUser) {
      throw new Error(
        'Please login before placing an order.'
      );
    }

    if (cart.length === 0) {
      throw new Error(
        'Your cart is empty.'
      );
    }

    const paymentId =
      orderData?.paymentId || null;

    const paymentMethod =
      orderData?.paymentMethod ||
      (paymentId ? 'razorpay' : null);

    const isCod =
      paymentMethod === 'cod';

    const orderTotal =
      isCod
        ? cartTotal + 100
        : cartTotal;

    const orderStatus =
      isCod
        ? 'pending'
        : paymentId
          ? 'success'
          : 'pending';

    const { data: order, error } =
      await supabase
        .from('orders')
        .insert({
          user_id: currentUser.id,
          total: orderTotal,
          status: orderStatus,
          payment_method: paymentMethod,
          payment_id: paymentId,
          address: orderData
        })
        .select()
        .single();

    if (error || !order) {
      throw new Error(
        error?.message ||
          'Unable to create order.'
      );
    }

    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id:
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          item.productId || ''
        )
          ? item.productId
          : null,
      seller_id:
        item.sellerId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          item.sellerId
        )
          ? item.sellerId
          : item.product?.sellerId &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
              item.product.sellerId
            )
            ? item.product.sellerId
            : null,
      product_name:
        item.product?.name || '',
      price:
        Number(item.product?.price || 0),
      image:
        item.product?.images?.[0] ||
        null,
      size: item.size || '',
      color: item.color || '',
      quantity: item.qty
    }));

    const { error: itemError } =
      await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemError) {
  console.error("ORDER ITEMS INSERT ERROR:", itemError);
  console.error("ORDER ITEMS DATA:", orderItems);
  throw new Error(itemError.message);
}

    setOrders(prev => [
      {
        id: order.id,
        userId: currentUser.id,
        items: cart,
        total: orderTotal,
        status: orderStatus,
        date: Date.now(),
        address: orderData
      },
      ...prev
    ]);

    clearCart();

    notify(
      'Order placed successfully.',
      'success'
    );

    return order.id;
  },
  [
    currentUser,
    cart,
    cartTotal,
    clearCart,
    notify
  ]
);
  /* ---------------- CONTEXT VALUE ---------------- */

  const value: AppContextType = {
    currentUser,
    users,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,

    collections,
    addCollection,
    deleteCollection,
    updateCollection,
    likeCollection,
    getUserCollections,

    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartTotal,
    cartCount,

    wishlist,
    toggleWishlist,
    isInWishlist,

    orders,
    placeOrder,
    updateOrderDeliveryStatus,

    toast,
    toastType,
    notify
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/* ---------------- USE APP CONTEXT ---------------- */

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used inside AppProvider'
    );
  }

  return context;
}

export default AppContext;