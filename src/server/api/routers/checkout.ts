import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import Stripe from 'stripe';
import { env } from "~/env.mjs";
import { z } from 'zod';
import { $schema } from ".eslintrc.cjs";

console.log("Stripe API Key:", env.STRIPE_PRIVATE_KEY);

const stripe = new Stripe(env.STRIPE_PRIVATE_KEY, {
    apiVersion: '2025-01-27.acacia',
});

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure
  .input(z.object({
    successUrl: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
      return stripe.checkout.sessions.create({
        payment_method_types: ['card', 'us_bank_account'],
        metadata: {
          userId: ctx.session.user.id,
        },
        line_items: [{price: env.PRICE_ID, quantity: 1}],
        mode: "payment",
        // success_url: input.successUrl,
        success_url: `${env.HOST_NAME}/generate`,
        cancel_url: `${env.HOST_NAME}/generate`,
      });
    }),
});
