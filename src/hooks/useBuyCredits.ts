import { loadStripe } from '@stripe/stripe-js';
// import { env } from '~/env.mjs';
import {api } from '~/utils/api';

// const stripePromise = loadStripe(`${env.NEXT_PUBLIC_STRIPE_KEY}`);

export function useBuyCredits() {

    const checkout = api.checkout.createCheckout.useMutation();

    return {
        buyCredits: async (successUrl: string) => {
            const response = await checkout.mutateAsync({ successUrl });
            if (response.url) {
                window.location.href = response.url;
              } else {
                console.error('No URL found in the response');
              }
            // const stripe = await stripePromise;
            // await stripe?.redirectToCheckout({
            //     sessionId: response.id,
            //     successUrl: response.url ?? '',
            // });
        },
    };
}