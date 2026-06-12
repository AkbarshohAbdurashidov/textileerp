# AWS Deploy: Docker (EC2) + S3

## Arxitektura

```
S3 Bucket
  /admin/index.html    ← Admin panel (static)
  /market/index.html   ← Market panel (static)
        |
        | API chaqiruvlari (HTTP)
        ↓
EC2 t2.micro (free tier)
  Docker container
    Express.js API  :80
    SQLite DB  (volume: ./db)
```

---

## 1-qadam: EC2 instance yaratish

1. AWS Console → EC2 → **Launch Instance**
2. Sozlamalar:
   - **AMI**: Amazon Linux 2023
   - **Instance type**: `t2.micro` (free tier)
   - **Key pair**: yangi kalit yarating, `.pem` faylni saqlang
   - **Security Group** — quyidagi portlarni oching:
     | Port | Protokol | Manba     |
     |------|----------|-----------|
     | 22   | TCP      | My IP     |
     | 80   | TCP      | 0.0.0.0/0 |
3. Instance ishga tushgach **Public IP** ni nusxa oling

---

## 2-qadam: EC2 ga Docker o'rnatish

```bash
# Mac/Linux terminaldan EC2 ga ulaning
ssh -i path/to/your-key.pem ec2-user@YOUR_EC2_IP

# EC2 da setup skriptini ishga tushiring
curl -sO https://raw.githubusercontent.com/.../scripts/ec2-docker-run.sh
# Yoki fayl ko'chirish:
# scp -i key.pem scripts/ec2-docker-run.sh ec2-user@IP:~/
bash ec2-docker-run.sh
```

Yoki qo'lda o'rnatish:
```bash
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker ec2-user
# Logout va qayta login qiling
```

---

## 3-qadam: Loyihani EC2 ga ko'chirish

**Variant A — scp (oddiy):**
```bash
# Lokal mashinangizdan:
scp -i key.pem -r /path/to/networking ec2-user@YOUR_EC2_IP:~/app
```

**Variant B — git:**
```bash
# EC2 da:
git clone <sizning-repo-url> app
```

---

## 4-qadam: Docker container ishga tushirish

```bash
# EC2 da:
cd ~/app
docker-compose up -d --build

# Tekshirish:
docker ps
docker logs app-app-1
```

API manzili: `http://YOUR_EC2_IP/api/products`

---

## 5-qadam: S3 bucket yaratish

1. AWS Console → S3 → **Create bucket**
2. Sozlamalar:
   - **Bucket name**: `textile-app-YOUR_NAME` (unikal bo'lishi kerak)
   - **Region**: siz yaqin region (masalan `us-east-1`)
   - **Block all public access**: **O'CHIRING** (disable)
3. Bucket yaratilgach → **Properties** → **Static website hosting** → Enable
   - Index document: `index.html`
4. **Permissions** → **Bucket policy** → quyidagini qo'ying:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
     }]
   }
   ```

---

## 6-qadam: Static fayllarni S3 ga yuklash

```bash
# Lokal mashinangizdan (AWS CLI o'rnatilgan bo'lishi kerak):
cd /path/to/networking
./scripts/s3-deploy.sh textile-app-YOUR_NAME http://YOUR_EC2_IP
```

Yoki AWS CLI o'rnatilmagan bo'lsa — AWS Console → S3 → bucket → **Upload** orqali:
- `public/admin/` papkasini → S3 `admin/` ga
- `public/market/` papkasini → S3 `market/` ga

**Muhim**: config.js fayllarini yuklashdan oldin EC2 URL ni qo'ying:
```js
// public/admin/js/config.js  va  public/market/js/config.js
window.API_BASE = 'http://YOUR_EC2_IP';
```

---

## Natija

| Panel  | URL |
|--------|-----|
| Admin  | `http://YOUR_BUCKET.s3-website.amazonaws.com/admin/index.html` |
| Market | `http://YOUR_BUCKET.s3-website.amazonaws.com/market/index.html` |
| API    | `http://YOUR_EC2_IP/api/products` |

---

## Local dev (o'zgarmaydi)

```bash
npm start
# Admin:  http://localhost:3000/admin
# Market: http://localhost:3000/market
```

---

## Free tier limiti

| Xizmat | Free tier | Loyiha sarfi |
|--------|-----------|--------------|
| EC2 t2.micro | 750 soat/oy | ~720 soat/oy |
| S3 storage | 5 GB | < 10 MB |
| S3 requests | 20K GET/2K PUT | Kam |
| **Jami xarajat** | **$0/oy** | |
