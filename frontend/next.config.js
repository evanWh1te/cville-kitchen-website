const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: false
    },
    eslint: {
        ignoreDuringBuilds: false
    },
    images: {
        domains: ['localhost']
    },
    env: {
        NEXT_PUBLIC_API_URL:
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    },
    // Enable standalone build for Docker
    output: 'standalone',
    // Optimize for production
    experimental: {
        outputFileTracingRoot: path.join(__dirname, '../')
    }
};

module.exports = nextConfig;
