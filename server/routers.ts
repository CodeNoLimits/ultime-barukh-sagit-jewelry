import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Categories
  categories: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
  }),

  // Products
  products: router({
    getAll: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        isFeatured: z.boolean().optional(),
        isNew: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
        sortBy: z.enum(['price-asc', 'price-desc', 'newest', 'popular']).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllProducts(input);
      }),

    getAllPaginated: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        isFeatured: z.boolean().optional(),
        isNew: z.boolean().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(20),
        sortBy: z.enum(['price-asc', 'price-desc', 'newest', 'popular']).optional(),
      }))
      .query(async ({ input }) => {
        const { page, pageSize, ...filters } = input;
        const offset = (page - 1) * pageSize;
        const result = await db.getProductsWithCount({
          ...filters,
          limit: pageSize,
          offset,
        });
        return {
          products: result.products,
          total: result.total,
          page,
          pageSize,
          totalPages: Math.ceil(result.total / pageSize),
        };
      }),

    getBySlug: publicProcedure
      .input(z.object({
        slug: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getProductBySlug(input.slug);
      }),

    getFeatured: publicProcedure
      .input(z.object({
        limit: z.number().default(8),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllProducts({
          isFeatured: true,
          limit: input?.limit || 8,
        });
      }),
  }),

  // Cart (for future server-side cart management)
  cart: router({
    // Placeholder for future implementation
  }),
});

export type AppRouter = typeof appRouter;
