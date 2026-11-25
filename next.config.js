/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./node_modules/.prisma/client/**"],
    },
  },
};

module.exports = nextConfig;

