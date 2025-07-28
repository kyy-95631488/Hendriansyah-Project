/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ktsnlzvjhqxfuuznzvkh.supabase.co",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
