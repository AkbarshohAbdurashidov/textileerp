#!/bin/bash
# EC2 instanceda ishga tushirish uchun (Amazon Linux 2023)
# Bu skriptni EC2 ga ssh orqali kirib ishga tushiring

set -e

echo "=== Docker o'rnatilmoqda ==="
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

echo "=== Docker Compose o'rnatilmoqda ==="
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo ""
echo "O'rnatish tugadi!"
echo "Endi logout qilib qayta kiring, keyin:"
echo ""
echo "  git clone <sizning-repo-url> app"
echo "  cd app"
echo "  docker-compose up -d"
echo ""
echo "Yoki papkani scp orqali ko'chirsangiz:"
echo "  docker-compose up -d --build"
