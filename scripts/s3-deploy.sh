#!/bin/bash
# S3 ga admin va market panellarini yuklash
# Ishlatish: ./scripts/s3-deploy.sh <bucket-nomi> <ec2-url>
# Misol:     ./scripts/s3-deploy.sh textile-app-bucket http://54.123.45.67

set -e

BUCKET=$1
EC2_URL=$2

if [ -z "$BUCKET" ] || [ -z "$EC2_URL" ]; then
  echo "Ishlatish: $0 <bucket-nomi> <ec2-url>"
  echo "Misol:     $0 textile-app-bucket http://54.123.45.67"
  exit 1
fi

# Config fayllariga EC2 URL ni yozish
echo "window.API_BASE = '${EC2_URL}';" > public/admin/js/config.js
echo "window.API_BASE = '${EC2_URL}';" > public/market/js/config.js

echo "S3 ga yuklanmoqda..."

# S3 ga yuklash
aws s3 sync public/admin  s3://${BUCKET}/admin  --delete
aws s3 sync public/market s3://${BUCKET}/market --delete

# Local dev uchun config ni qaytarish
echo "// S3 deployment uchun: bu yerga EC2 URL ni qo'ying
// Masalan: window.API_BASE = 'http://1.2.3.4';
// Local dev uchun bo'sh qoldiring
window.API_BASE = '';" > public/admin/js/config.js

echo "// S3 deployment uchun: bu yerga EC2 URL ni qo'ying
// Masalan: window.API_BASE = 'http://1.2.3.4';
// Local dev uchun bo'sh qoldiring
window.API_BASE = '';" > public/market/js/config.js

echo ""
echo "Yuklandi!"
echo "  Admin:  http://${BUCKET}.s3-website.amazonaws.com/admin/index.html"
echo "  Market: http://${BUCKET}.s3-website.amazonaws.com/market/index.html"
