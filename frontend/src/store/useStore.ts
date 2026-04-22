import { create } from "zustand";
import type { User, Cart, Product } from "../types";
import api from "../services/api";

interface StoreState {
  // Auth
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;

  // Cart
  cart: Cart | null;
  getCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Products
  products: Product[];
  loading: boolean;
  getProducts: (page?: number, category?: string, search?: string) => Promise<void>;

  // UI
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  cartOpen: false,

  setUser: (user) => set({ user }),
  setCartOpen: (open) => set({ cartOpen: open }),

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ token, user, isLoggedIn: true });
      await get().getCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  register: async (email, password, name) => {
    try {
      await api.post("/auth/register", { email, password, name });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isLoggedIn: false, cart: null });
  },

  getCart: async () => {
    try {
      const response = await api.get("/cart");
      set({ cart: response.data.data });
    } catch (error) {
      console.error("Failed to get cart:", error);
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      const response = await api.post("/cart", { productId, quantity });
      set({ cart: response.data.data });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add to cart");
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      set({ cart: response.data.data });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to remove from cart");
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/${productId}`, { quantity });
      set({ cart: response.data.data });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update cart");
    }
  },

  clearCart: async () => {
    try {
      await api.delete("/cart");
      set({ cart: null });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to clear cart");
    }
  },

  products: [],
  loading: false,

  getProducts: async (page = 1, category = "", search = "") => {
    set({ loading: true });
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (category) params.append("category", category);
      if (search) params.append("search", search);

      const response = await api.get(`/products?${params.toString()}`);
      set({ products: response.data.data.products });
    } catch (error) {
      console.error("Failed to get products:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
