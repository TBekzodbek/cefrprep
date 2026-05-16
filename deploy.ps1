# CEFR Academy Deployment Script
# Usage: ./deploy.ps1 "Your commit message"

Param(
    [string]$Message = "Update and deploy"
)

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Cyan

# 1. Add changes
Write-Host "📦 Staging changes..."
git add .

# 2. Commit
Write-Host "💾 Committing changes..."
git commit -m "$Message"

# 3. Push to GitHub (triggers Vercel)
Write-Host "☁️ Pushing to GitHub..."
git push origin main

Write-Host "✅ Deployment triggered successfully! Check Vercel for progress." -ForegroundColor Green
