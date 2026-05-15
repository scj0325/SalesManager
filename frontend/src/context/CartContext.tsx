"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface CartItem {
  id: string; // This is the product UUID
  name: string;
  price: number;
  quantity: number;
  product_number: string;
  grade: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (product_number: string) => Promise<void>;
  updateQuantity: (product_number: string, delta: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Fetch cart items from DB when user logs in
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        quantity,
        products (
          id,
          name,
          price,
          product_number,
          grade
        )
      `,
      )
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart items:", error);
      return;
    }

    if (data) {
      const mappedItems: CartItem[] = data.map((item: any) => ({
        id: item.products.id,
        name: item.products.name,
        price: item.products.price,
        quantity: item.quantity,
        product_number: item.products.product_number,
        grade: item.products.grade,
      }));
      setCartItems(mappedItems);
    }
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    if (user) {
      // DB Sync
      const existing = cartItems.find(
        (item) => item.product_number === product.product_number,
      );

      if (existing) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("user_id", user.id)
          .eq("product_id", product.product_number);

        if (error) console.error("Error updating cart item:", error);
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: product.product_number,
          quantity: quantity,
        });

        if (error) console.error("Error adding cart item:", error);
      }
      // Refresh from DB to ensure sync
      fetchCartItems();
    } else {
      // Local only for guests
      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.product_number === product.product_number,
        );
        if (existing) {
          return prev.map((item) =>
            item.product_number === product.product_number
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            product_number: product.product_number,
            grade: product.grade,
          },
        ];
      });
    }
  };

  const updateQuantity = async (product_number: string, delta: number) => {
    const item = cartItems.find((i) => i.product_number === product_number);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);

    if (user) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("user_id", user.id)
        .eq("product_id", item.product_number);

      if (error) {
        console.error("Error updating quantity:", error);
      } else {
        fetchCartItems();
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_number === product_number
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  const removeFromCart = async (product_number: string) => {
    const item = cartItems.find((i) => i.product_number === product_number);
    if (!item) return;

    if (user) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", item.product_number);

      if (error) {
        console.error("Error removing cart item:", error);
      } else {
        fetchCartItems();
      }
    } else {
      setCartItems((prev) =>
        prev.filter((item) => item.product_number !== product_number),
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // In a real app, you might want to clear DB too if user is logged in
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
