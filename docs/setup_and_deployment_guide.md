# AGRI MART MEGA PLATFORM: SETUP & PRODUCTION DEPLOYMENT RUNBOOK
**Project Reference**: Ref No: 2026-27/P163 | **Client**: GreenShield Industries Pvt Ltd, Bangalore  
**Target Environment**: Linux VPS / Docker Swarm / Kubernetes / Cloud Bare-Metal  
**Audited Runtime**: Node.js v20+ / Docker 24+ / Next.js 15.5.25 Standalone

---

## 1. Prerequisites & System Requirements

### Hardware Specifications:
- **CPU**: 2 vCPUs minimum (4 vCPUs recommended for multi-tenant dark warehouse operations).
- **Memory**: 4 GB RAM minimum (8 GB RAM recommended for SSR caching and image optimization).
- **Disk**: 20 GB SSD storage minimum with dedicated write IOPS for transactional logging.
- **Operating System**: Ubuntu 22.04 LTS, Debian 12, or Alpine Linux (in container).

### Software Requirements:
- **Node.js**: `v20.x` or `v22.x` (LTS)
- **Containerization**: Docker Engine `24.0+` with Docker Compose `v2.20+`

---

## 2. Environment Configuration

1. Clone or unpack the repository onto the production server:
   ```bash
   cd /opt/agrimart-mega
   ```
2. Copy the production environment template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and configure all required production credentials:
   ```ini
   # Core Server Configuration
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_APP_URL=https://www.agrimart.in
   APP_URL=https://www.agrimart.in

   # Security & Session Secrets
   SESSION_SECRET=your_super_strong_random_sha256_secret_key_here
   CRON_SECRET=your_cron_job_secret_key_here

   # Payment Gateways (Razorpay LIVE)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

   # Indian DLT SMS Gateway (MSG91)
   SMS_PROVIDER=msg91
   MSG91_AUTH_KEY=your_msg91_production_auth_key
   MSG91_SENDER_ID=AGRMRT
   MSG91_DLT_TE_ID_OTP=110716xxxxxxxxxx
   MSG91_DLT_TE_ID_DISPATCH=110716xxxxxxxxxx

   # Meta WhatsApp Cloud API
   WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   WHATSAPP_PHONE_NUMBER_ID=1098xxxxxxxxxxx

   # Google Maps Platform (Geocoding & Matrix API)
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxx

   # Storage & Persistence
   DATA_DIR=/app/data
   ```

---

## 3. Production Docker Deployment (Recommended)

Agri Mart includes an optimized multi-stage `Dockerfile` and `docker-compose.yml` leveraging Next.js standalone output.

### 3.1 Docker Compose Execution
Deploy the application and mount persistent storage volumes:
```bash
# Build optimized container image
docker compose build --no-cache

# Launch container in background with restart policy
docker compose up -d

# Verify container health status
docker compose ps
```

### 3.2 Inspect Container Logs
```bash
docker compose logs -f agrimart-app
```

### 3.3 Persistence Volume Architecture
The database and state logs are persisted in a host-mounted named volume:
```yaml
volumes:
  agrimart_data:
    driver: local
```
Inside the container, data is mapped to `/app/data`, ensuring zero data loss during rolling container restarts or blue-green updates.

---

## 4. Bare-Metal / PM2 Deployment (Alternative)

If running directly on a Linux VPS without Docker:

```bash
# 1. Install production dependencies
npm ci --only=production

# 2. Build the standalone Next.js bundle
npm run build

# 3. Start with PM2 Process Manager
pm2 start npm --name "agrimart" -- start

# 4. Save PM2 startup script
pm2 save
pm2 startup
```

---

## 5. Nginx Reverse Proxy & SSL Termination

Place the following configuration in `/etc/nginx/sites-available/agrimart.in`:

```nginx
server {
    listen 80;
    server_name agrimart.in www.agrimart.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name agrimart.in www.agrimart.in;

    ssl_certificate /etc/letsencrypt/live/agrimart.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agrimart.in/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache Next.js Static Assets
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 6. Disaster Recovery, Backups & Rollbacks

### 6.1 Automated Daily Data Backup
Create a daily cron job (`/etc/cron.daily/agrimart-backup`):
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/agrimart"
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
mkdir -p "$BACKUP_DIR"

# Backup data directory
tar -czf "$BACKUP_DIR/agrimart_data_$TIMESTAMP.tar.gz" -C /opt/agrimart-mega data/

# Retain 30 days of archives
find "$BACKUP_DIR" -type f -mtime +30 -name "*.tar.gz" -delete
```

### 6.2 Instant Disaster Restore
```bash
# Stop application
docker compose down

# Restore data from archive
tar -xzf /opt/backups/agrimart/agrimart_data_YYYYMMDD_HHMMSS.tar.gz -C /opt/agrimart-mega/

# Restart application
docker compose up -d
```

### 6.3 Zero-Downtime Rollback
To rollback to a previous git commit or container tag:
```bash
git checkout <PREVIOUS_STABLE_TAG>
docker compose build
docker compose up -d --no-deps agrimart-app
```
