# Quick Reference Guide - GenAI Scout Lite

## Vercel Deployment (Recommended)

### Option 1: GitHub Integration (Easiest)
1. Push your code to GitHub (see below)
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "Import Project" and select your GitHub repo
4. Add environment variable: `GROQ_API_KEY=your_key_here`
5. Deploy! 🚀

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Add environment variables
vercel env add GROQ_API_KEY
vercel env add NODE_ENV production

# Redeploy with env vars
vercel --prod
```

### Option 3: npm Script
```bash
# Use built-in deployment script
npm run deploy:vercel
```

## GitHub Upload (First Time)

```powershell
# In your project directory (PowerShell syntax)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/xorjun/genai-scout-lite.git
git push -u origin master
```

```bash
# Alternative for Git Bash/Linux (if using Git Bash instead of PowerShell)
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/xorjun/genai-scout-lite.git
git push -u origin master
```

## EC2 Setup Summary

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install -y nginx git

# 4. Clone and setup project
git clone https://github.com/xorjun/genai-scout-lite.git
cd genai-scout-lite
npm install
npm run build

# 5. Start with PM2
pm2 start npm --name "genai-scout-lite" -- start
pm2 save
pm2 startup
```

## Nginx Configuration

```nginx
# /etc/nginx/sites-available/genai-scout-lite
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    client_max_body_size 10M;
}
```

## SSL Certificate (Let's Encrypt)

```bash
sudo snap install --classic certbot
sudo certbot --nginx -d your-domain.com
```

## Common Commands

```bash
# Check application status
pm2 status
pm2 logs genai-scout-lite

# Restart application
pm2 restart genai-scout-lite

# Update application
git pull origin master
npm install
npm run build
pm2 restart genai-scout-lite

# Check Nginx
sudo nginx -t
sudo systemctl restart nginx

# View logs
pm2 logs --lines 100
sudo tail -f /var/log/nginx/error.log
```

## Environment Variables

### For Vercel:
Set in Vercel dashboard or CLI:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### For Local Development:
Create `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

## Alternative: AWS EC2 Deployment

Only use if you need custom infrastructure or have specific requirements.

### Quick EC2 Setup:
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install -y nginx git

# 4. Clone and setup project
git clone https://github.com/xorjun/genai-scout-lite.git
cd genai-scout-lite
npm install
npm run build

# 5. Start with PM2
pm2 start npm --name "genai-scout-lite" -- start
pm2 save
pm2 startup
```

## Important Notes

⚠️ **Firebase Removed**: This project no longer uses Firebase
✅ **Vercel Optimized**: Configured for best performance on Vercel
🔒 **Security**: Never commit API keys to git
📱 **Mobile Ready**: Responsive design works on all devices
