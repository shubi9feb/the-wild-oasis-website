/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eocsxsywmwmppkafypdp.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
        search: "",
      },
    ],
  },
  eslint: {
    // This tells Next.js to respect your custom ESLint config during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
