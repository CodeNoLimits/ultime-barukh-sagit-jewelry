import { eq, and, desc, asc, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  products, 
  categories, 
  carts, 
  cartItems, 
  orders, 
  orderItems, 
  reviews,
  InsertProduct,
  InsertCategory,
  InsertCart,
  InsertCartItem,
  InsertOrder,
  InsertOrderItem,
  InsertReview
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ========== USER HELPERS ==========

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== CATEGORY HELPERS ==========

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(asc(categories.nameFr));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(category);
  return result;
}

// ========== PRODUCT HELPERS ==========

export async function getAllProducts(options?: {
  categoryId?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}) {
  const db = await getDb();
  if (!db) return [];

  // Apply filters
  const conditions = [eq(products.isActive, true)];
  if (options?.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }
  if (options?.isFeatured !== undefined) {
    conditions.push(eq(products.isFeatured, options.isFeatured));
  }
  if (options?.isNew !== undefined) {
    conditions.push(eq(products.isNew, options.isNew));
  }

  let query = db.select().from(products).where(and(...conditions)).$dynamic();

  // Apply sorting
  if (options?.sortBy === 'price-asc') {
    query = query.orderBy(asc(products.priceEurCents));
  } else if (options?.sortBy === 'price-desc') {
    query = query.orderBy(desc(products.priceEurCents));
  } else if (options?.sortBy === 'newest') {
    query = query.orderBy(desc(products.createdAt));
  } else {
    query = query.orderBy(desc(products.isFeatured), desc(products.createdAt));
  }

  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.offset(options.offset);
  }

  return await query;
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(
    and(eq(products.slug, slug), eq(products.isActive, true))
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByIds(ids: number[]) {
  const db = await getDb();
  if (!db) return [];
  if (ids.length === 0) return [];
  return await db.select().from(products).where(inArray(products.id, ids));
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(product);
  return result;
}

// ========== CART HELPERS ==========

export async function getOrCreateCart(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let cart;
  if (userId) {
    const result = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
    cart = result.length > 0 ? result[0] : null;
  } else if (sessionId) {
    const result = await db.select().from(carts).where(eq(carts.sessionId, sessionId)).limit(1);
    cart = result.length > 0 ? result[0] : null;
  }

  if (!cart) {
    const insertResult = await db.insert(carts).values({
      userId: userId || null,
      sessionId: sessionId || null,
    });
    const newCartId = Number(insertResult[0].insertId);
    const newCart = await db.select().from(carts).where(eq(carts.id, newCartId)).limit(1);
    cart = newCart[0];
  }

  return cart;
}

export async function getCartItems(cartId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db.select({
    cartItem: cartItems,
    product: products,
  })
  .from(cartItems)
  .leftJoin(products, eq(cartItems.productId, products.id))
  .where(eq(cartItems.cartId, cartId));

  return items;
}

export async function addToCart(cartId: number, productId: number, quantity: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if item already exists
  const existing = await db.select().from(cartItems).where(
    and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))
  ).limit(1);

  if (existing.length > 0) {
    // Update quantity
    await db.update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    // Insert new item
    await db.insert(cartItems).values({
      cartId,
      productId,
      quantity,
    });
  }

  return true;
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  } else {
    await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId));
  }

  return true;
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  return true;
}

export async function clearCart(cartId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  return true;
}

// ========== ORDER HELPERS ==========

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return Number(result[0].insertId);
}

export async function createOrderItem(orderItem: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orderItems).values(orderItem);
  return true;
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// ========== REVIEW HELPERS ==========

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(
    and(eq(reviews.productId, productId), eq(reviews.isApproved, true))
  ).orderBy(desc(reviews.createdAt));
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(reviews).values(review);
  return true;
}
