import {api } from '~/utils/api';


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