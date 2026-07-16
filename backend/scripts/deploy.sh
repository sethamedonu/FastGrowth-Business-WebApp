#!/bin/bash
# EC2 Deploy Script
# Usage: bash scripts/deploy.sh

set -e

APP_DIR="/var/www/fastgrowth/backend"

echo "==> Pulling latest code..."
cd $APP_DIR
git pull origin main

echo "==> Installing dependencies..."
npm install --omit=dev

echo "==> Running migrations..."
npm run migrate

echo "==> Restarting app..."
pm2 reload ecosystem.config.js --env production

echo "==> Deploy complete."
pm2 status
