import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { env } from '~/env.mjs';
import { buffer } from 'micro';
import { prisma } from '~/server/db';

const stripe = new Stripe(env.STRIPE_PRIVATE_KEY, {
    apiVersion: '2025-01-27.acacia',
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method ==="POST") {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
        // let message = `Unknown Error`;
        // if (err instanceof Error) message = err.message;
      res.status(400).send('Webhook Error: ${err.message}');
      return;
    }

    console.log("event", event);
    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const completedEvent = event.data.object as Stripe.Checkout.Session;
      if (!completedEvent.metadata || !completedEvent.metadata.userId) {
        throw new Error('Metadata or userId is missing in the event data');
      }
        console.log(`Checkout session completed for ${completedEvent.id}`);

      await prisma.user.update({
        where: {
          id: completedEvent.metadata.userId,
        },
        data: {
          credits: {
            increment: 100,
          },
        },
      })
      console.log(`PaymentIntent for ${completedEvent.metadata.userId} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    // case 'payment_method.attached':
    //   const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
    //   break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
// Return a 200 response to acknowledge receipt of the event
res.json({ received: true });

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default webhook;