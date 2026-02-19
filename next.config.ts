import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      // allow Supabase storage hosts (any project subdomain)
      { protocol: "https", hostname: "**.supabase.co", pathname: "/**" },
    ],
  },
};

export default nextConfig;
