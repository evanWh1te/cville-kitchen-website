#!/bin/bash

# Deployment script for Digital Ocean droplet
set -e

echo "🚀 Starting deployment..."

# Build and start the application
echo "📦 Building Docker image..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "📊 Checking service status..."
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at http://your-domain.com"

# Optional: Show logs
echo "📝 Recent logs:"
docker-compose logs --tail=50