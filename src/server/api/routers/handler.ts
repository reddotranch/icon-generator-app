import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ stripePublicKey: process.env.STRIPE_PUBLIC_KEY });
}