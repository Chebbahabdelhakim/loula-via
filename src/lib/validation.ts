import { z } from "zod";
import { WILAYAS } from "@/lib/wilayas";

export const cartItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^0[567]\d{8}$/),
  wilayaCode: z.number().int().refine(
    (code) => WILAYAS.some((wilaya) => wilaya.code === code),
    "Choisissez une wilaya valide.",
  ),
  address: z.string().trim().min(5).max(300),
  locale: z.enum(["fr", "ar"]),
  items: z.array(cartItemSchema).min(1).max(30),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  id: z.uuid().optional(),
  nameFr: z.string().trim().min(2).max(120),
  nameAr: z.string().trim().min(2).max(120),
  price: z.number().int().min(0).max(10_000_000),
  descriptionFr: z.string().trim().max(2000).optional().default(""),
  descriptionAr: z.string().trim().max(2000).optional().default(""),
  imageUrl: z.string().trim().url().nullable().optional(),
  active: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const feesSchema = z.array(
  z.object({
    code: z.number().int().min(1).max(58),
    fee: z.number().int().min(0).max(100_000),
  }),
);
