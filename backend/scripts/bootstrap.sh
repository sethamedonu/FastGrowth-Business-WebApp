#!/bin/bash
# EC2 Bootstrap Script — Amazon Linux 2023
# Run once on a fresh EC2 instance

set -e

echo "==> Updating system..."
sudo dnf update -y

echo "==> Installing Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

echo "==> Installing git, nginx..."
sudo dnf install -y git nginx

echo "==> Installing PM2..."
sudo npm install -g pm2

echo "==> Creating app directory..."
sudo mkdir -p /var/www/fastgrowth
sudo mkdir -p /var/log/fastgrowth
sudo chown -R ec2-user:ec2-user /var/www/fastgrowth
sudo chown -R ec2-user:ec2-user /var/log/fastgrowth

echo "==> Configuring Nginx..."
sudo tee /etc/nginx/conf.d/fastgrowth.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://127.0.0.1:3000;
    }
}
EOF

sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx

echo "==> Setting up PM2 startup..."
pm2 startup systemd -u ec2-user --hp /home/ec2-user
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo "==> Bootstrap complete!"
echo "Next: clone your repo to /var/www/fastgrowth/backend, add .env, then run:"
echo "  cd /var/www/fastgrowth/backend && npm install && npm run migrate && pm2 start ecosystem.config.js --env production && pm2 save"
