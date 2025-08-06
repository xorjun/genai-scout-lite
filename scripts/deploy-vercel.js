#!/usr/bin/env node

/**
 * Vercel Deployment Script
 * This script helps with local Vercel deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');

function checkEnvironment() {
  if (!fs.existsSync('.env.local')) {
    console.log('⚠️  .env.local not found. Creating from .env.example...');
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env.local');
      console.log('✅ .env.local created. Please add your GROQ_API_KEY.');
    }
  }
}

function deployToVercel() {
  try {
    console.log('🚀 Starting Vercel deployment...');
    
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('📦 Installing Vercel CLI...');
      execSync('npm i -g vercel', { stdio: 'inherit' });
    }

    // Build the project
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy to Vercel
    console.log('🌐 Deploying to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });

    console.log('✅ Deployment completed!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🎯 GenAI-Scout Lite - Vercel Deployment');
  console.log('=======================================');
  
  checkEnvironment();
  deployToVercel();
}

if (require.main === module) {
  main();
}

module.exports = { checkEnvironment, deployToVercel };
