# GenAI-Scout Lite Deployment Guide

This guide covers deploying GenAI-Scout Lite to Vercel (recommended) and AWS EC2 as an alternative.

## Table of Contents
1. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
2. [GitHub Repository Setup](#github-repository-setup)
3. [AWS EC2 Alternative](#aws-ec2-alternative)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

## Vercel Deployment (Recommended)

Vercel is the easiest and most cost-effective way to deploy Next.js applications.

### Why Vercel?
- ✅ **Zero Configuration**: Auto-detects Next.js projects
- ✅ **Automatic SSL**: HTTPS enabled by default
- ✅ **Global CDN**: Fast worldwide performance
- ✅ **Free Tier**: Generous limits for personal projects
- ✅ **GitHub Integration**: Automatic deployments on push

### Method 1: GitHub Integration (Easiest)

1. **Push to GitHub** (see [GitHub Setup](#github-repository-setup))
2. **Sign up for Vercel** at [vercel.com](https://vercel.com)
3. **Connect GitHub account** and authorize Vercel
4. **Import your repository**:
   - Click "New Project"
   - Select `genai-scout-lite` repository
   - Click "Import"
5. **Configure environment variables**:
   - Add `GROQ_API_KEY` with your actual API key
   - Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# ? Set up and deploy "genai-scout-lite"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? genai-scout-lite
# ? In which directory is your code located? ./

# Add environment variables
vercel env add GROQ_API_KEY
# Enter your Groq API key when prompted

# Deploy to production
vercel --prod
```

### Method 3: npm Script

```bash
# Use the built-in deployment script
npm run deploy:vercel
```

## GitHub Repository Setup

### First Time Setup

```powershell
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/xorjun/genai-scout-lite.git

# Push to GitHub
git push -u origin master
```

### Subsequent Updates

```powershell
# Add changes
git add .
git commit -m "Update description"
git push origin master
```

With GitHub integration, Vercel will automatically deploy when you push to the master branch.

## Environment Configuration

### Required Environment Variables

Create these in Vercel dashboard or via CLI:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (Vercel sets these automatically)
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=GenAI-Scout Lite
```

### Setting Environment Variables in Vercel

#### Via Dashboard:
1. Go to your project in Vercel dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add `GROQ_API_KEY` with your key
5. Select "Production" environment
6. Click "Save"

#### Via CLI:
```bash
vercel env add GROQ_API_KEY production
```

### Local Development

```bash
# Copy environment template
npm run setup:env

# Edit .env.local with your API key
GROQ_API_KEY=your_groq_api_key_here
```

## Vercel Configuration

The project includes a `vercel.json` file with optimized settings:

```json
{
  "version": 2,
  "framework": "nextjs",
  "env": {
    "GROQ_API_KEY": "@groq_api_key"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## AWS EC2 Alternative

For users who prefer AWS EC2, here's a quick setup guide:

### EC2 Instance Setup

1. **Launch Ubuntu 22.04 LTS** instance (t3.small minimum)
2. **Configure Security Groups**:
   - SSH (22): Your IP
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0

### Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install -y nginx git

# Clone repository
git clone https://github.com/xorjun/genai-scout-lite.git
cd genai-scout-lite

# Install dependencies and build
npm install
npm run build

# Start with PM2
pm2 start npm --name "genai-scout-lite" -- start
pm2 save
pm2 startup
```

### Nginx Configuration

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

## Troubleshooting

### Common Vercel Issues

#### Build Errors
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Ensure Node.js version is 18+
- Check for TypeScript errors
- Verify all dependencies are in package.json
```

#### Environment Variable Issues
```bash
# Redeploy after adding environment variables
vercel --prod

# Check environment variables
vercel env ls
```

#### API Route Timeouts
```bash
# Increase timeout in vercel.json (max 60s for hobby plan)
"functions": {
  "app/api/**/*.ts": {
    "maxDuration": 60
  }
}
```

### Build Optimization

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build and test locally
npm run build
npm start
```

### Performance Monitoring

- **Vercel Analytics**: Enable in project settings
- **Web Vitals**: Built into Next.js
- **Error Tracking**: Check Vercel function logs

## Security Best Practices

1. **Environment Variables**: Never commit API keys
2. **HTTPS Only**: Vercel provides automatic SSL
3. **Security Headers**: Configured in `vercel.json`
4. **Regular Updates**: Keep dependencies updated

## Cost Optimization

### Vercel Free Tier Limits:
- **Bandwidth**: 100GB/month
- **Function Executions**: 100GB-hours/month
- **Build Time**: 6,000 minutes/month

### Tips:
- Use ISR (Incremental Static Regeneration) for caching
- Optimize images with Next.js Image component
- Minimize API function execution time

## Comparison: Vercel vs EC2

| Feature | Vercel | AWS EC2 |
|---------|--------|---------|
| Setup Time | 5 minutes | 1-2 hours |
| Maintenance | Zero | Regular updates required |
| Scaling | Automatic | Manual configuration |
| SSL Certificate | Automatic | Manual setup with Let's Encrypt |
| Cost (Small App) | Free tier | ~$10-20/month |
| Global CDN | Included | Additional cost |
| Monitoring | Built-in | Additional setup |

## Conclusion

**Recommended**: Use Vercel for most deployments due to its simplicity, automatic scaling, and generous free tier.

**Alternative**: Use AWS EC2 for enterprise deployments requiring custom infrastructure or specific compliance requirements.

Your GenAI-Scout Lite application is now ready for production deployment! 🚀
