"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DeliveryFee } from "@/lib/types";

export type CartLine = {
  productId: string;
  nameFr: string;
  nameAr: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  ready: boolean;
  wilayaCode: number | null;
  fees: DeliveryFee[];
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartLine, "quantity">) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setWilayaCode: (code: number | null) => void;
  clear: () => void;
  subtotal: number;
  deliveryFee: number | null;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "loula-via-cart";
const WILAYA_KEY = "loula-via-wilaya";

export function CartProvider({
  fees,
  children,
}: {
  fees: DeliveryFee[];
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [wilayaCode, setWilayaCodeState] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartLine[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
      const storedWilaya = localStorage.getItem(WILAYA_KEY);
      if (storedWilaya) setWilayaCodeState(Number(storedWilaya));
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!ready) return;
    if (wilayaCode) localStorage.setItem(WILAYA_KEY, String(wilayaCode));
    else localStorage.removeItem(WILAYA_KEY);
  }, [wilayaCode, ready]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const feeRow = fees.find((fee) => fee.code === wilayaCode);
    const deliveryFee = feeRow ? feeRow.fee : null;
    return {
      items,
      ready,
      wilayaCode,
      fees,
      open,
      setOpen,
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((line) => line.productId === item.productId);
          if (!existing) return [...current, { ...item, quantity: 1 }];
          return current.map((line) =>
            line.productId === item.productId
              ? { ...line, quantity: Math.min(20, line.quantity + 1) }
              : line,
          );
        });
        setOpen(true);
      },
      setQuantity: (productId, quantity) => {
        setItems((current) =>
          current
            .map((line) =>
              line.productId === productId
                ? { ...line, quantity: Math.min(20, Math.max(0, quantity)) }
                : line,
            )
            .filter((line) => line.quantity > 0),
        );
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((line) => line.productId !== productId));
      },
      setWilayaCode: setWilayaCodeState,
      clear: () => setItems([]),
      subtotal,
      deliveryFee,
      total: subtotal + (deliveryFee ?? 0),
    };
  }, [fees, items, open, ready, wilayaCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider.");
  return context;
}
