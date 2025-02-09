// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'smokeybear.adcouncilkit.org',
        pathname: '/wp-content/uploads/sites/70/2021/12/Thomas-Wimberly_Smokey-Bear_hi-res-scaled.jpg',
      },
    ],
    domains: ['https://api.openai.com/v1/engines/davinci-codex/completions',
      'ranch-generator-app.s3.us-west-2.amazonaws.com',
    ],
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
