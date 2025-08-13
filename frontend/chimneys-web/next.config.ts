import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
    return [
        { source: '/api/:path*', destination: 'https://YOUR-API.onrender.com/:path*' } // тимчасово пусто
    ];
}
};

export default nextConfig;
