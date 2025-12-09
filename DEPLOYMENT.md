# Neon DB + Vercel/Cloudflare Deployment Guide

Complete step-by-step guide for deploying Hi Teacher LMS with modern serverless stack.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Neon DB Setup](#neon-db-setup)
3. [Environment Configuration](#environment-configuration)
4. [Prisma Setup](#prisma-setup)
5. [Cloudflare R2 Setup](#cloudflare-r2-setup)
6. [Vercel Deployment](#vercel-deployment)
7. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
8. [Post-Deployment](#post-deployment)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required Accounts
- [x] **Neon Account**: https://neon.tech (free tier available)
- [x] **Vercel Account**: https://vercel.com (free tier) OR
- [x] **Cloudflare Account**: https://cloudflare.com (free tier)
- [x] **GitHub Account**: For repository (optional but recommended)

### Local Development Tools
```bash
# Node.js 18+ required
node --version  # Should be v18.0.0 or higher

# Install pnpm (recommended) or npm
npm install -g pnpm

# Install Prisma CLI
pnpm add -D prisma
pnpm add @prisma/client
```

---

## 🗄️ Neon DB Setup

### Step 1: Create Neon Project

1. Go to https://console.neon.tech
2. Click "Create Project"
3. **Configure Project:**
   ```
   Project Name: hiteacher-lms
   Region: Choose closest to your users (e.g., AWS ap-south-1 for India)
   Postgres Version: 16 (latest)
   ```

4. Click "Create Project"

### Step 2: Get Connection Strings

Neon provides TWO connection strings:

#### **Pooled Connection** (for app)
```
DATABASE_URL="postgresql://username:password@ep-xyz.ap-south-1.aws.neon.tech/dbname?sslmode=require"
```
- Use this in your application
- Goes through connection pooler (PgBouncer)
- Optimized for serverless/edge

#### **Direct Connection** (for migrations)
```
DIRECT_URL="postgresql://username:password@ep-xyz.ap-south-1.aws.neon.tech/dbname?sslmode=require&connect_timeout=10"
```
- Use this for running Prisma migrations
- Bypasses pooler
- Required for schema changes

### Step 3: Enable Required Extensions

Run these in Neon SQL Editor:

```sql
-- UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search (optional, for future)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Step 4: Create Development Branch (Optional)

Neon's killer feature - database branching!

```bash
# In Neon console
1. Go to "Branches" tab
2. Click "Create Branch"
3. Name: "development"
4. Source: main
```

Now you have a copy of production database for testing!

---

## ⚙️ Environment Configuration

### Create `.env` File

```bash
# Create .env file in project root
touch .env
```

### Add Environment Variables

```env
# ============================================
# DATABASE (Neon DB)
# ============================================
DATABASE_URL="postgresql://user:pass@ep-xyz.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xyz.region.aws.neon.tech/dbname?sslmode=require&connect_timeout=10"

# ============================================
# AUTHENTICATION
# ============================================
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"  # Change for production

# JWT Secrets
JWT_ACCESS_SECRET="generate-another-secret"
JWT_REFRESH_SECRET="generate-third-secret"

# ============================================
# FILE STORAGE (Cloudflare R2)
# ============================================
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret-key"
R2_BUCKET_NAME="hiteacher-files"
R2_PUBLIC_URL="https://files.yourdomain.com"  # Custom domain or R2 public URL

# ============================================
# EMAIL (Choose one)
# ============================================
# Option 1: Resend (recommended)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"

# Option 2: SendGrid
# SENDGRID_API_KEY="SG.xxxxxxxxxxxx"
# EMAIL_FROM="noreply@yourdomain.com"

# ============================================
# CLOUDFLARE (Optional)
# ============================================
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"

# ============================================
# MONITORING (Optional)
# ============================================
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"  # For error tracking

# ============================================
# DEVELOPMENT
# ============================================
NODE_ENV="development"  # production | development | test
```

### Environment Variables for Production

When deploying to Vercel/Cloudflare, add these in their dashboards:

**Required:**
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

**Optional:**
- `RESEND_API_KEY` or `SENDGRID_API_KEY`
- `SENTRY_DSN`

---

## 🔄 Prisma Setup

### Step 1: Install Dependencies

```bash
pnpm add @prisma/client @prisma/adapter-neon
pnpm add -D prisma
```

### Step 2: Initialize Prisma (if not done)

The schema is already created at `prisma/schema.prisma`.

### Step 3: Generate Prisma Client

```bash
pnpm prisma generate
```

This creates type-safe database client.

### Step 4: Run Migrations

```bash
# Create migration
pnpm prisma migrate dev --name init

# This will:
# 1. Create migration file
# 2. Apply to database (using DIRECT_URL)
# 3. Generate Prisma Client
```

### Step 5: Seed Database (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hiteacher.com' },
    update: {},
    create: {
      email: 'admin@hiteacher.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
      permissions: ['all'],
      subjects: [],
    },
  })

  // Create demo teacher
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      passwordHash: teacherPassword,
      name: 'John Teacher',
      role: 'TEACHER',
      status: 'ACTIVE',
      subjects: ['Mathematics', 'Physics'],
      verificationStatus: 'APPROVED',
      permissions: [],
    },
  })

  console.log({ admin, teacher })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run seed:

```bash
pnpm prisma db seed
```

### Useful Prisma Commands

```bash
# View database in browser
pnpm prisma studio

# Reset database (DANGER!)
pnpm prisma migrate reset

# Deploy migrations to production
pnpm prisma migrate deploy

# Pull schema from existing database
pnpm prisma db pull

# Format schema file
pnpm prisma format
```

---

## 📦 Cloudflare R2 Setup

### Step 1: Create R2 Bucket

1. Go to Cloudflare Dashboard → R2
2. Click "Create bucket"
3. **Bucket Name:** `hiteacher-files`
4. **Location:** Automatic (or choose specific region)
5. Click "Create bucket"

### Step 2: Generate API Tokens

1. Go to R2 → Manage R2 API Tokens
2. Click "Create API token"
3. **Token Name:** `hiteacher-app`
4. **Permissions:** 
   - Object Read & Write
   - Bucket: `hiteacher-files` (or All buckets)
5. Click "Create API Token"
6. **Save these values:**
   ```
   Access Key ID: xxxxxxxxxxxx
   Secret Access Key: yyyyyyyyyyyy
   ```

### Step 3: Configure CORS (for Direct Uploads)

Go to R2 Bucket → Settings → CORS Policy:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### Step 4: Set Up Custom Domain (Optional)

1. Go to R2 Bucket → Settings → Public Access
2. Click "Connect Domain"
3. Enter domain: `files.yourdomain.com`
4. Add DNS record as instructed
5. Wait for SSL certificate (automatic)

### Step 5: Create R2 Client Utility

Create `lib/r2-client.ts`:

```typescript
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function getUploadUrl(
  key: string,
  contentType: string
): Promise<{ url: string; fields: Record<string, string> }> {
  const { url, fields } = await createPresignedPost(r2, {
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Conditions: [
      ['content-length-range', 0, 104857600], // 100MB max
      ['eq', '$Content-Type', contentType],
    ],
    Fields: {
      'Content-Type': contentType,
    },
    Expires: 600, // 10 minutes
  })

  return { url, fields }
}

export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  })

  return await getSignedUrl(r2, command, { expiresIn: 3600 }) // 1 hour
}

export { r2 }
```

---

## 🚀 Vercel Deployment

### Option A: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/hiteacher-web.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     ```
     Framework Preset: Next.js
     Build Command: pnpm build
     Output Directory: .next
     Install Command: pnpm install
     Node Version: 18.x
     ```

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env`
   - Make sure to use production values!

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: hiteacher-web
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Post-Deployment

1. **Add Custom Domain:**
   - Go to Project Settings → Domains
   - Add your domain
   - Update DNS records as instructed

2. **Run Database Migrations:**
   ```bash
   # Production migrations run automatically via Vercel build
   # Or manually:
   DATABASE_URL="your-prod-db" pnpm prisma migrate deploy
   ```

3. **Check Logs:**
   - Go to Deployments → Your deployment → Runtime Logs
   - Verify no errors

---

## ☁️ Cloudflare Pages Deployment

### Step 1: Build Configuration

Create `wrangler.toml`:

```toml
name = "hiteacher-web"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"

[env.production]
vars = { NODE_ENV = "production" }

[env.production.vars]
# Add non-secret vars here
NEXT_PUBLIC_APP_URL = "https://yourdomain.com"
```

### Step 2: Install Wrangler

```bash
npm install -g wrangler

# Login
wrangler login
```

### Step 3: Deploy

```bash
# Build
pnpm build

# Deploy
wrangler pages deploy .next

# Or connect to Git (recommended)
wrangler pages project create hiteacher-web
# Then push to connected Git repo
```

### Step 4: Add Environment Variables

```bash
# Via dashboard
# Go to Workers & Pages → Your project → Settings → Environment variables

# Or via CLI
wrangler pages secret put DATABASE_URL
wrangler pages secret put NEXTAUTH_SECRET
# ... etc
```

### Step 5: Configure Custom Domain

1. Go to Cloudflare Pages → Your project → Custom domains
2. Add domain
3. DNS configured automatically

---

## ✅ Post-Deployment Checklist

### Database
- [ ] Migrations applied successfully
- [ ] Seed data created (if needed)
- [ ] Connection pooling working
- [ ] Indexes created

### Environment
- [ ] All env variables set in production
- [ ] Secrets properly secured
- [ ] NEXTAUTH_URL updated to production domain

### File Storage
- [ ] R2 bucket accessible
- [ ] CORS configured
- [ ] Upload/download working
- [ ] Custom domain (if configured)

### Domains & SSL
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] www redirect configured (optional)

### Security
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] CSP headers configured
- [ ] API routes protected

### Monitoring
- [ ] Error tracking (Sentry) configured
- [ ] Analytics set up
- [ ] Logs accessible
- [ ] Uptime monitoring

### Testing
- [ ] Can register new users
- [ ] Can log in
- [ ] Can create batches/assignments
- [ ] File uploads work
- [ ] Email sending works (if configured)

---

## 🔧 Troubleshooting

### Database Connection Issues

**Problem:** "Error: P1001: Can't reach database server"

**Solutions:**
1. Check `DATABASE_URL` is correct in env vars
2. Verify Neon project is active (not paused)
3. Use pooled connection string for app
4. Check firewall/network settings

### Prisma Migration Failures

**Problem:** Migration hangs or fails

**Solutions:**
1. Use `DIRECT_URL` for migrations
2. Check database permissions
3. Run `pnpm prisma migrate reset` (dev only!)
4. Ensure no active connections

### Edge Runtime Errors

**Problem:** "Module not found" or "not compatible with edge runtime"

**Solutions:**
1. Check you're using edge-compatible packages
2. Add to `middleware.ts` config
3. Use `export const runtime = 'edge'` in API routes
4. Avoid Node.js-specific APIs

### File Upload Issues

**Problem:** CORS errors or upload fails

**Solutions:**
1. Check R2 CORS policy includes your domain
2. Verify API tokens have correct permissions
3. Check file size limits
4. Ensure presigned URL not expired

### Build Failures

**Problem:** Build fails in Vercel/Cloudflare

**Solutions:**
1. Check `pnpm` lock file is committed
2. Verify Node version (18+)
3. Run `pnpm build` locally first
4. Check environment variables are set
5. Review build logs for errors

### Performance Issues

**Problem:** Slow queries or timeouts

**Solutions:**
1. Add database indexes (see Prisma schema)
2. Use connection pooling
3. Implement caching (Redis/KV)
4. Optimize N+1 queries
5. Use `select` to limit fields returned

---

## 📚 Additional Resources

### Documentation
- **Neon:** https://neon.tech/docs
- **Prisma:** https://www.prisma.io/docs
- **Vercel:** https://vercel.com/docs
- **Cloudflare Pages:** https://developers.cloudflare.com/pages
- **Cloudflare R2:** https://developers.cloudflare.com/r2

### Community
- **Neon Discord:** https://discord.gg/neon
- **Prisma Discord:** https://discord.gg/prisma
- **Next.js Discord:** https://discord.gg/nextjs

### Tutorials
- [Neon + Prisma Quickstart](https://neon.tech/docs/guides/prisma)
- [Vercel + Neon Integration](https://vercel.com/integrations/neon)
- [Edge Runtime Guide](https://nextjs.org/docs/app/api-reference/edge)

---

## 🎯 What's Next?

After successful deployment:

1. **Set up monitoring:**
   - Add Sentry for error tracking
   - Configure uptime monitoring
   - Set up analytics

2. **Implement caching:**
   - Vercel KV or Cloudflare KV
   - Cache frequently accessed data
   - Reduce database queries

3. **Add email notifications:**
   - Configure Resend/SendGrid
   - Set up transactional emails
   - Create email templates

4. **Performance optimization:**
   - Enable CDN for static assets
   - Implement image optimization
   - Add request caching

5. **Security hardening:**
   - Set up rate limiting
   - Add CAPTCHA for registration
   - Implement CSP headers
   - Regular security audits

---

**Deployment complete! 🎉**

Your Hi Teacher LMS is now live on a modern, scalable serverless stack!
