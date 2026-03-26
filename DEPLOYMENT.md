# \ud83d\ude80 Deployment Guide - Cricket Game

Complete guide for deploying your cricket game to production.

## Table of Contents

1. [GitHub Actions CI/CD](#github-actions-cicd)
2. [VPS/Cloud Deployment](#vpscloud-deployment)
3. [FTP Deployment](#ftp-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Domain & DNS Setup](#domain--dns-setup)

---

## \ud83d\udd04 GitHub Actions CI/CD

### Setup CI/CD Pipeline

The project includes a pre-configured GitHub Actions workflow at `.github/workflows/ci-cd.yml`.

### Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

```
REACT_APP_BACKEND_URL=https://api.yourdomain.com
DEPLOY_HOST=your-server-ip
DEPLOY_USER=your-ssh-username
DEPLOY_SSH_KEY=your-private-ssh-key
```

### Workflow Triggers

The CI/CD pipeline automatically runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### Pipeline Steps

1. **Frontend Job**
   - Checkout code
   - Install dependencies
   - Lint code
   - Build production bundle
   - Upload build artifacts

2. **Backend Job**
   - Checkout code
   - Install Python dependencies
   - Lint code
   - Run tests

3. **Deploy Job** (only on main branch push)
   - Deploy to server via SSH
   - Restart services

---

## \ud83d\udcbb VPS/Cloud Deployment

Deploy to DigitalOcean, AWS EC2, Linode, or any VPS.

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install Python
sudo apt install -y python3 python3-pip python3-venv

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx
```

### 2. Clone and Setup Project

```bash
# Create project directory
sudo mkdir -p /var/www/cricket-game
sudo chown $USER:$USER /var/www/cricket-game
cd /var/www/cricket-game

# Clone repository
git clone <your-repo-url> .

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
nano .env  # Edit with your configuration

# Setup frontend
cd ../frontend
yarn install
```

### 3. Configure Environment

**Backend `.env`:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=cricket_game
CORS_ORIGINS=https://yourdomain.com
RESEND_API_KEY=your_resend_api_key
SENDER_EMAIL=onboarding@resend.dev
```

**Frontend `.env`:**
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### 4. Build Frontend

```bash
cd /var/www/cricket-game/frontend
yarn build
```

### 5. Setup Systemd Service for Backend

Create `/etc/systemd/system/cricket-backend.service`:

```ini
[Unit]
Description=Cricket Game Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/cricket-game/backend
Environment="PATH=/var/www/cricket-game/backend/venv/bin"
ExecStart=/var/www/cricket-game/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl start cricket-backend
sudo systemctl enable cricket-backend
sudo systemctl status cricket-backend
```

### 6. Configure Nginx

Create `/etc/nginx/sites-available/cricket-game`:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/cricket-game/frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cricket-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## \ud83d\udcbe FTP Deployment

For traditional shared hosting (cPanel, Plesk, etc.).

### 1. Build Project Locally

```bash
# Build frontend
cd frontend
yarn build

# Build creates a 'build' folder with static files
```

### 2. Upload via FTP Client

**Recommended FTP Clients:**
- FileZilla (Windows, Mac, Linux)
- Cyberduck (Mac, Windows)
- WinSCP (Windows)

**Upload Steps:**
1. Connect to your hosting FTP server
2. Navigate to `public_html` or `www` directory
3. Upload all files from `frontend/build/` folder
4. Set file permissions (usually 644 for files, 755 for folders)

### 3. Backend Deployment

Most shared hosting doesn't support Python/FastAPI directly. Options:

**Option A: Use separate cloud service for backend**
- Deploy backend to Heroku, Railway, or Render
- Update frontend `.env.production` with backend URL
- Rebuild frontend and re-upload

**Option B: Use hosting with Python support**
- PythonAnywhere
- A2 Hosting (with Python)
- Some VPS providers

### 4. Database

For shared hosting:
- Use MongoDB Atlas (free tier available)
- Update backend MONGO_URL to Atlas connection string

### 5. GitHub Actions FTP Deploy

Add to `.github/workflows/ci-cd.yml`:

```yaml
- name: FTP Deploy
  uses: SamKirkland/FTP-Deploy-Action@v4.3.4
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_USERNAME }}
    password: ${{ secrets.FTP_PASSWORD }}
    local-dir: ./frontend/build/
    server-dir: /public_html/
```

Add GitHub Secrets:
- `FTP_SERVER` - Your FTP server address
- `FTP_USERNAME` - FTP username
- `FTP_PASSWORD` - FTP password

---

## \ud83d\udc33 Docker Deployment

### 1. Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 2. Create Dockerfile for Frontend

Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Create docker-compose.yml

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: cricket-db
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=cricket_game

  backend:
    build: ./backend
    container_name: cricket-backend
    restart: always
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=cricket_game
      - RESEND_API_KEY=${RESEND_API_KEY}
      - SENDER_EMAIL=${SENDER_EMAIL}
      - CORS_ORIGINS=*
    depends_on:
      - mongodb

  frontend:
    build:
      context: ./frontend
      args:
        REACT_APP_BACKEND_URL: http://localhost:8001
    container_name: cricket-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### 4. Deploy with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## \ud83c\udf10 Domain & DNS Setup

### 1. Purchase Domain

- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### 2. DNS Configuration

Point your domain to your server:

**A Records:**
```
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      3600
A       www     YOUR_SERVER_IP      3600
A       api     YOUR_SERVER_IP      3600
```

**CNAME Records (alternative):**
```
Type    Name    Value               TTL
CNAME   www     yourdomain.com      3600
CNAME   api     yourdomain.com      3600
```

### 3. Cloudflare Setup (Recommended)

1. Add your domain to Cloudflare
2. Update nameservers at domain registrar
3. Enable:
   - SSL/TLS (Full or Strict)
   - Auto HTTPS Rewrites
   - Always Use HTTPS
   - Caching
   - Minification (HTML, CSS, JS)

### 4. Verify DNS Propagation

```bash
# Check DNS
nslookup yourdomain.com

# Or use online tools
# https://dnschecker.org
```

DNS propagation can take 24-48 hours.

---

## \ud83d\udcdd Environment Variables Summary

### Development

**Backend `.env`:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=cricket_game
CORS_ORIGINS=*
RESEND_API_KEY=re_xxxxx
SENDER_EMAIL=onboarding@resend.dev
```

**Frontend `.env`:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Production

**Backend `.env`:**
```env
MONGO_URL=mongodb://localhost:27017  # or MongoDB Atlas
DB_NAME=cricket_game
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RESEND_API_KEY=re_xxxxx
SENDER_EMAIL=onboarding@resend.dev
```

**Frontend `.env.production`:**
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

---

## \u2705 Post-Deployment Checklist

- [ ] Frontend accessible at https://yourdomain.com
- [ ] Backend API accessible at https://api.yourdomain.com
- [ ] SSL certificate installed and working
- [ ] Database connected and working
- [ ] Email functionality working (if configured)
- [ ] Game saves scores correctly
- [ ] Leaderboard displays scores
- [ ] Feedback form sends emails
- [ ] Mobile responsive design working
- [ ] GitHub Actions CI/CD configured
- [ ] Monitoring and logs setup
- [ ] Backups configured for database

---

## \ud83c\udd98 Troubleshooting

### Frontend not loading
- Check Nginx configuration
- Verify build files uploaded correctly
- Check browser console for errors

### Backend API errors
- Check backend logs: `sudo journalctl -u cricket-backend -f`
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check environment variables

### CORS errors
- Update CORS_ORIGINS in backend `.env`
- Restart backend service

### Database connection failed
- Check MongoDB is running
- Verify MONGO_URL in `.env`
- Check firewall rules

---

## \ud83d\udcde Support

For deployment issues, check:
- Server logs
- Nginx error logs: `/var/log/nginx/error.log`
- Backend logs: `sudo journalctl -u cricket-backend -f`
- MongoDB logs: `sudo journalctl -u mongod -f`

---

**Happy Deploying! \ud83d\ude80\ud83c\udfcf**
