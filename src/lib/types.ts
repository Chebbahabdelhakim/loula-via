export type Product = {
  id: string;
  name_fr: string;
  name_ar: string;
  price: number;
  image_url: string | null;
  description_fr: string | null;
  description_ar: string | null;
  active: boolean;
  created_at: string;
};

export type DeliveryFee = {
  code: number;
  name: string;
  fee: number;
};

export const ORDER_STATUSES = [
  "nouvelle",
  "confirmée",
  "expédiée",
  "livrée",
  "annulée",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  phone: string;
  wilaya: string;
  address: string;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItem[];
};
