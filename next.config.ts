import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dkbasehdogcujqhzishd.supabase.co/rest/v1/',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'www.sau.ac.th',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: "https",
        hostname: "dkbasehdogcujqhzishd.supabase.co",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
