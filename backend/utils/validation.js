import { z } from "zod";

export const orderSchema = z.object({
    phoneNumber: z.string().regex(/^\+?[0-9]{10,12}$/, "Невірний формат номера"),
    firstName: z.string().min(2, "Ім'я занадто коротке"),
    lastName: z.string().min(2, "Прізвище занадто коротке"),
    email: z.string().email("Некоректний email"),
    deliveryWay: z.enum(["nova_poshta_branch", "nova_poshta_courier", "ukrposhta", "pickup"]),
    paymentMethod: z.enum(["liqpay", "on_delivery_place", "bank_transfer"]),
    products: z.array(z.object({
        product: z.string(),
        quantity: z.number().int().positive("Кількість має бути більше 0")
    })).min(1, "Кошик порожній"),
    city: z.string().min(2, "Вкажіть місто"),
    address: z.string().min(3, "Вкажіть адресу")
});

export const productSchema = z.object({
    name: z.string().min(3, "Назва занадто коротка"),
    price: z.coerce.number().positive("Ціна має бути додатною"),
    description: z.string().min(10, "Опис занадто короткий"),
    category: z.string().min(1, "Категорія обов'язкова"),
    discount: z.coerce.number().min(0).max(100).optional(),
    stock: z.coerce.number().int().min(0)
});

export const registerSchema = z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    password: z.string()
});

export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const reviewSchema = z.object({
    name: z.string(),
    email: z.string().optional(),
    product: z.string(),
    rating: z.number(),
    comment: z.string()
});

export const pageSchema = z.object({
    slug: z.string(),
    title: z.string(),
    content: z.string()
});

export const favoriteSchema = z.object({
    productId: z.string()
});
