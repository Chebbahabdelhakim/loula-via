"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
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
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartLine, "quantity">, options?: { open?: boolean }) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setWilayaCode: (code: number | null) => void;
  clear: () => void;
  subtotal: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "loula-via-cart";
const WILAYA_KEY = "loula-via-wilaya";
const EMPTY_CART = "[]";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyStorageChange() {
  listeners.forEach((listener) => listener());
}

function getStoredCart() {
  return window.localStorage.getItem(CART_KEY) ?? EMPTY_CART;
}

function getServerCart() {
  return EMPTY_CART;
}

function getStoredWilaya() {
  return window.localStorage.getItem(WILAYA_KEY);
}

function getServerWilaya() {
  return null;
}

function parseCart(value: string): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartLine =>
        typeof item === "object" &&
        item !== null &&
        typeof item.productId === "string" &&
        typeof item.nameFr === "string" &&
        typeof item.nameAr === "string" &&
        typeof item.price === "number" &&
        (typeof item.imageUrl === "string" || item.imageUrl === null) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function storeCart(items: CartLine[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  notifyStorageChange();
}

function storeWilaya(code: number | null) {
  if (code) window.localStorage.setItem(WILAYA_KEY, String(code));
  else window.localStorage.removeItem(WILAYA_KEY);
  notifyStorageChange();
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartValue = useSyncExternalStore(subscribe, getStoredCart, getServerCart);
  const wilayaValue = useSyncExternalStore(subscribe, getStoredWilaya, getServerWilaya);
  const items = useMemo(() => parseCart(cartValue), [cartValue]);
  const wilayaCode = wilayaValue === null ? null : Number(wilayaValue);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      ready: true,
      wilayaCode,
      open,
      setOpen,
      addItem: (item, options) => {
        const current = parseCart(getStoredCart());
        const existing = current.find((line) => line.productId === item.productId);
        const next = existing
          ? current.map((line) =>
              line.productId === item.productId
                ? { ...line, quantity: Math.min(20, line.quantity + 1) }
                : line,
            )
          : [...current, { ...item, quantity: 1 }];
        storeCart(next);
        if (options?.open !== false) setOpen(true);
      },
      setQuantity: (productId, quantity) => {
        const next = parseCart(getStoredCart())
          .map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(20, Math.max(0, quantity)) }
              : line,
          )
          .filter((line) => line.quantity > 0);
        storeCart(next);
      },
      removeItem: (productId) => {
        storeCart(parseCart(getStoredCart()).filter((line) => line.productId !== productId));
      },
      setWilayaCode: storeWilaya,
      clear: () => storeCart([]),
      subtotal,
      total: subtotal,
    };
  }, [items, open, wilayaCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider.");
  return context;
}
