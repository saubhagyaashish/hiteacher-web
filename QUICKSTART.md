# Quick Start Guide - Neon DB + Vercel Stack

Get your Hi Teacher LMS running in under 30 minutes!

---

## 🚀 Super Quick Setup

### 1. Clone & Install (2 min)

```bash
git clone https://github.com/yourusername/hiteacher-web.git
cd hiteacher-web
pnpm install
```

### 2. Create Neon DB (3 min)

1. Go to https://console.neon.tech
2. Create new project → Copy connection strings
3. Save both URLs (pooled + direct)

### 3. Setup Environment (2 min)

```bash
cp .env.example .env
# Edit .env with your Neon URLs
```

Minimum required:
```env
DATABASE_URL="postgresql://..." # Pooled connection
DIRECT_URL="postgresql://..."    # Direct connection  
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database (5 min)

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database (optional)
pnpm prisma db seed

# Open Prisma Studio to verify
pnpm prisma studio
```

### 5. Run Development Server (1 min)

```bash
pnpm dev
```

Visit http://localhost:3000

**Login credentials:**
- Admin: `admin@hiteacher.com / admin123`
- Teacher: `teacher@example.com / teacher123`

### 6. Deploy to Vercel (10 min)

```bash
# Push to GitHub
git remote add origin https://github.com/yourusername/hiteacher-web.git
git push -u origin main

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

**Done!** 🎉

---

## 📦 Essential Commands

### Development
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

### Database (Prisma)
```bash
pnpm prisma studio           # Visual database editor
pnpm prisma generate         # Generate Prisma Client
pnpm prisma migrate dev      # Create & apply migration
pnpm prisma migrate deploy   # Deploy migrations (prod)
pnpm prisma db seed          # Seed database
pnpm prisma db push          # Push schema without migration
pnpm prisma format           # Format schema file
```

### Deployment
```bash
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
vercel env add           # Add environment variable
vercel logs              # View deployment logs
```

---

## 🔧 Troubleshooting Quick Fixes

### "Can't reach database server"
```bash
# Check your DATABASE_URL in .env
# Make sure Neon project is not paused
# Use the POOLED connection string
```

### "Prisma Client not found"
```bash
pnpm prisma generate
```

### "Migration failed"
```bash
# Use DIRECT_URL for migrations
# Check you're not using DATABASE_URL for migrations
pnpm prisma migrate reset  # CAUTION: Deletes all data!
```

### Build error: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

---

## 📂 Project Structure

```
hiteacher-web/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth routes
│   ├── teacher/           # Teacher portal
│   ├── student/           # Student portal
│   └── admin/             # Admin portal
├── components/            # React components
│   ├── ui/               # shadcn components
│   ├── analytics/        # Charts
│   ├── assignments/      # Assignment components
│   └── ...
├── lib/                   # Utilities
│   ├── utils/            # Helper functions
│   └── validations/      # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── store/                 # Zustand stores
├── types/                 # TypeScript types
├── .env                   # Environment variables
├── API_SPECIFICATION.md   # Complete API docs
├── DEPLOYMENT.md          # Deployment guide
└── DEVELOPER.md           # Developer guide
```

---

## 🌐 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16 + React 19 | Modern, fast, type-safe |
| **Database** | Neon (Serverless Postgres) | Auto-scaling, affordable |
| **ORM** | Prisma | Type-safe, migrations |
| **Deployment** | Vercel / Cloudflare Pages | Edge, global CDN |
| **File Storage** | Cloudflare R2 | Cheap, S3-compatible |
| **Styling** | Tailwind CSS + shadcn/ui | Beautiful, accessible |
| **State** | Zustand | Simple, performant |
| **Forms** | React Hook Form + Zod | Validation, DX |
| **Charts** | Recharts | Responsive, composable |

---

## 💰 Cost Breakdown

### Free Tier (Development + Small Scale)
```
Neon DB Free:       0.5GB storage, 1 compute unit      = $0
Vercel Hobby:       100GB bandwidth, serverless        = $0
Cloudflare R2:      10GB storage, 1M Class A requests  = $0
Total:                                                  = $0/month
```

Good for: Development + up to ~50 active users

### Paid Tier (Growing)
```
Neon Launch:        $19/month (3GB storage)
Vercel Pro:         $20/month (if needed)
Cloudflare R2:      ~$5/month (50GB storage)
Total:                                                  = $24-44/month
```

Good for: 50-500 active users

### Scale (Established)
```
Neon Scale:         $69/month (10GB storage)
Cloudflare Pro:     $20/month
R2: ~$15/month (200GB)
Total:                                                  = $104/month
```

Good for: 500+ active users

---

## 🔗 Important Links

### Documentation
- **Neon Console**: https://console.neon.tech
- **Vercel Dashboard**: https://vercel.com/dashboard
- **API Specification**: `API_SPECIFICATION.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Developer Guide**: `DEVELOPER.md`

### Community
- **Neon Discord**: https://discord.gg/neon
- **Prisma Discord**: https://discord.gg/prisma
- **Next.js Discord**: https://discord.gg/nextjs

---

## 🎯 Next Steps

After initial setup:

1. **Customize branding** in `app/globals.css`
2. **Configure email** (Resend/SendGrid)
3. **Set up file uploads** (Cloudflare R2)
4. **Add monitoring** (Sentry optional)
5. **Configure custom domain**
6. **Set up CI/CD** (GitHub Actions)

---

## ⚡ Performance Tips

1. **Use Prisma connection pooling** (already configured)
2. **Enable Vercel Edge Middleware** for auth
3. **Implement caching** with Vercel KV/Cloudflare KV
4. **Optimize images** with Next.js Image component
5. **Use database indexes** (already in schema)

---

## 🔒 Security Checklist

- [x] Environment variables not committed
- [ ] NEXTAUTH_SECRET generated securely
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React escaping)
- [ ] CSRF protection enabled
- [ ] HTTPS enforced in production

---

**That's it!** You're ready to build! 🚀

For detailed information, see:
- Full deployment guide: `DEPLOYMENT.md`
- API documentation: `API_SPECIFICATION.md`
- Development guide: `DEVELOPER.md`
