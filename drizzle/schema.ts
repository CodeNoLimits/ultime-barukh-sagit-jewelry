import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nameFr: varchar("nameFr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameHe: varchar("nameHe", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table with multi-language support
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  
  // Multi-language fields
  nameFr: varchar("nameFr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameHe: varchar("nameHe", { length: 255 }).notNull(),
  
  descriptionFr: text("descriptionFr"),
  descriptionEn: text("descriptionEn"),
  descriptionHe: text("descriptionHe"),
  
  materialsFr: text("materialsFr"),
  materialsEn: text("materialsEn"),
  materialsHe: text("materialsHe"),
  
  culturalSignificanceFr: text("culturalSignificanceFr"),
  culturalSignificanceEn: text("culturalSignificanceEn"),
  culturalSignificanceHe: text("culturalSignificanceHe"),
  
  // Pricing (stored in cents to avoid decimal issues)
  priceEurCents: int("priceEurCents").notNull(),
  priceIlsCents: int("priceIlsCents").notNull(),
  
  // Category
  categoryId: int("categoryId").notNull(),
  
  // Images (JSON array of image URLs)
  images: text("images").notNull(), // JSON string array
  
  // Stock and status
  stock: int("stock").default(0).notNull(),
  isNew: boolean("isNew").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Shopping cart
 */
export const carts = mysqlTable("carts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 255 }), // For guest users
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cart = typeof carts.$inferSelect;
export type InsertCart = typeof carts.$inferInsert;

/**
 * Cart items
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  cartId: int("cartId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 100 }).notNull().unique(),
  userId: int("userId"),
  
  // Customer info
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }),
  
  // Shipping address
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: varchar("shippingCity", { length: 255 }).notNull(),
  shippingPostalCode: varchar("shippingPostalCode", { length: 50 }).notNull(),
  shippingCountry: varchar("shippingCountry", { length: 100 }).notNull(),
  
  // Pricing (in cents)
  subtotalCents: int("subtotalCents").notNull(),
  shippingCents: int("shippingCents").default(0).notNull(),
  taxCents: int("taxCents").default(0).notNull(),
  totalCents: int("totalCents").notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  
  // Status
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  
  // Payment
  paymentMethod: varchar("paymentMethod", { length: 100 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  
  // Snapshot of product at time of order
  productName: varchar("productName", { length: 255 }).notNull(),
  productSku: varchar("productSku", { length: 100 }).notNull(),
  productImage: varchar("productImage", { length: 500 }),
  
  quantity: int("quantity").notNull(),
  pricePerItemCents: int("pricePerItemCents").notNull(),
  totalCents: int("totalCents").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Product reviews
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId"),
  
  customerName: varchar("customerName", { length: 255 }).notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false).notNull(),
  isApproved: boolean("isApproved").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
