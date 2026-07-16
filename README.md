# FastGrowth Business Platform

A full-stack corporate web application featuring a modern public-facing website and a secure admin dashboard. Built with vanilla HTML/CSS/JavaScript on the frontend and Node.js/Express on the backend, designed for deployment on AWS infrastructure.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
  - [Public Pages](#public-pages)
  - [Dashboard Pages](#dashboard-pages)
  - [CSS Architecture](#css-architecture)
  - [JavaScript Modules](#javascript-modules)
- [Backend](#backend)
  - [API Endpoints](#api-endpoints)
  - [Database Schema](#database-schema)
  - [Authentication](#authentication)
  - [AWS Integrations](#aws-integrations)
- [AWS Infrastructure](#aws-infrastructure)
  - [Current Setup](#current-setup)
  - [Target Architecture](#target-architecture)
- [Getting Started](#getting-started)
  - [Frontend (Local)](#frontend-local)
  - [Backend (Local)](#backend-local)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
  - [Frontend to S3 + CloudFront](#frontend-to-s3--cloudfront)
  - [Backend to EC2](#backend-to-ec2)
- [Dashboard Login](#dashboard-login)
- [Security Considerations](#security-considerations)
- [Known Issues & Limitations](#known-issues--limitations)
- [Recommendations](#recommendations)
- [Future Improvements](#future-improvements)
- [What to Do Next](#what-to-do-next)

---

## Project Overview

**FastGrowth Business Platform** is a modern corporate website where:

- **Visitors** can learn about the company, browse services and pricing, view the portfolio, read blog posts, and submit contact inquiries.
- **Administrators** can manage contact messages, blog posts, and users through a secure, JWT-protected dashboard with real-time data from a REST API.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantics |
| CSS3 | Styling, layout, animations |
| Vanilla JavaScript (ES6+) | Interactivity, API calls, DOM manipulation |
| Font Awesome 6 | Icons |
| Google Fonts (Inter + Poppins) | Typography |
| Chart.js | Dashboard charts (revenue, traffic, analytics) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime |
| Express 4 | HTTP framework |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL client (connection pooling) |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT authentication |
| `express-validator` | Request validation |
| `helmet` | HTTP security headers |
| `cors` | Cross-origin resource sharing |
| `morgan` | HTTP request logging |
| `express-rate-limit` | Rate limiting |
| `multer` | File upload handling |
| AWS SDK v3 | S3, SES integrations |
| PM2 | Process manager (production) |
| Nginx | Reverse proxy (production) |

### AWS Services
| Service | Purpose |
|---|---|
| S3 | Static frontend hosting + file uploads |
| CloudFront | CDN, HTTPS termination, caching |
| ACM | Free SSL/TLS certificates |
| Route 53 | DNS management |
| EC2 | Node.js/Express API server |
| ALB | Application Load Balancer |
| RDS (PostgreSQL) | Managed database |
| SES | Transactional email (contact form) |
| Secrets Manager | Secure credential storage |
| CloudWatch | Logs, metrics, alarms |

---

## Project Structure

```
fastgrowth-business-platform/
│
├── index.html                  # Homepage
├── about.html                  # About page
├── services.html               # Services page
├── pricing.html                # Pricing page
├── portfolio.html              # Portfolio with category filter
├── blog.html                   # Blog listing
├── contact.html                # Contact form
├── login.html                  # Admin login
│
├── dashboard/
│   ├── index.html              # Dashboard overview + stats
│   ├── users.html              # User management (CRUD)
│   ├── messages.html           # Contact message inbox
│   ├── blog.html               # Blog post manager (CRUD)
│   ├── analytics.html          # Analytics charts
│   ├── settings.html           # Site settings
│   └── profile.html            # Admin profile
│
├── assets/
│   ├── css/
│   │   ├── variables.css       # Design tokens (colors, spacing, typography)
│   │   ├── style.css           # Main stylesheet (imports all others)
│   │   ├── utilities.css       # Utility classes
│   │   ├── responsive.css      # Breakpoints and responsive rules
│   │   ├── animations.css      # Keyframes and scroll-reveal
│   │   └── dashboard.css       # Dashboard-specific styles
│   ├── js/
│   │   ├── api.js              # Central API client + Auth helpers
│   │   ├── app.js              # Scroll reveal, active nav link
│   │   ├── navbar.js           # Navbar scroll shadow + mobile toggle
│   │   ├── theme.js            # Light/dark mode toggle (localStorage)
│   │   ├── slider.js           # Hero slider/carousel class
│   │   ├── contact.js          # Contact form submission
│   │   ├── validation.js       # Reusable client-side validation
│   │   ├── dashboard.js        # Auth guard, logout, toast, confirm modal
│   │   └── charts.js           # Chart.js chart definitions
│   ├── images/                 # (placeholder — add real images here)
│   ├── icons/                  # (placeholder — custom icons)
│   └── fonts/                  # (placeholder — self-hosted fonts)
│
├── backend/
│   ├── src/
│   │   ├── app.js              # Express entry point
│   │   ├── config/
│   │   │   ├── db.js           # PostgreSQL connection pool
│   │   │   ├── s3.js           # AWS S3 client
│   │   │   └── ses.js          # AWS SES email client
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verify + adminOnly guard
│   │   │   ├── errorHandler.js # Global error handler + 404
│   │   │   └── validate.js     # express-validator result handler
│   │   ├── models/
│   │   │   ├── User.js         # User CRUD + password hashing
│   │   │   ├── Message.js      # Contact message CRUD
│   │   │   └── Post.js         # Blog post CRUD
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── contactController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── messagesController.js
│   │   │   ├── postsController.js
│   │   │   ├── uploadsController.js
│   │   │   └── usersController.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── contact.js
│   │       ├── dashboard.js
│   │       ├── messages.js
│   │       ├── posts.js
│   │       ├── uploads.js
│   │       └── users.js
│   ├── migrations/
│   │   ├── 001_initial_schema.sql   # Full DB schema + seed admin user
│   │   └── run.js                   # Migration runner script
│   ├── scripts/
│   │   ├── bootstrap.sh        # EC2 initial server setup script
│   │   └── deploy.sh           # Pull + install + PM2 reload
│   ├── .env.example            # Environment variable template
│   ├── .gitignore
│   ├── ecosystem.config.js     # PM2 cluster config
│   └── package.json
│
├── docs/                       # (placeholder — API docs, diagrams)
├── downloads/                  # (placeholder — downloadable assets)
└── README.md
```

---

## Frontend

### Public Pages

| Page | Description |
|---|---|
| `index.html` | Hero section with stats card, services grid, testimonials, CTA |
| `about.html` | Company mission, stats, values, team grid |
| `services.html` | 6 service cards with feature lists |
| `pricing.html` | 3-tier pricing (Starter / Growth / Enterprise) + FAQ |
| `portfolio.html` | Project grid with JavaScript category filter |
| `blog.html` | Blog listing with tags, author, date |
| `contact.html` | Contact info + validated form wired to API |
| `login.html` | JWT login form with password toggle, redirects to dashboard |

### Dashboard Pages

| Page | Description |
|---|---|
| `dashboard/index.html` | Live stat cards (users, messages, posts), charts, recent messages |
| `dashboard/messages.html` | Full inbox — load, mark replied, delete via API |
| `dashboard/users.html` | User table — load, add, toggle status, delete via API |
| `dashboard/blog.html` | Post manager — load, create, edit, delete via API |
| `dashboard/analytics.html` | Visitor/conversion bar chart, top pages table |
| `dashboard/settings.html` | General, notifications, security, appearance panels |
| `dashboard/profile.html` | Admin profile edit + activity summary |

### CSS Architecture

The CSS is split into focused files and imported via `style.css`:

| File | Contents |
|---|---|
| `variables.css` | All design tokens — colors, spacing, typography, shadows, transitions. Dark mode overrides via `[data-theme="dark"]` |
| `style.css` | Global reset, navbar, buttons, hero, sections, cards, forms, footer, blog, portfolio, login |
| `utilities.css` | Single-purpose utility classes (flex, spacing, text, badges) |
| `animations.css` | Keyframes, scroll-reveal base state, stagger delays, spinner |
| `responsive.css` | Media queries for 1024px, 768px, 480px breakpoints |
| `dashboard.css` | Sidebar, topbar, stat cards, chart cards, data tables, settings, profile |

### JavaScript Modules

| File | Responsibility |
|---|---|
| `api.js` | Central fetch wrapper, JWT token management, all API methods, helper functions (`formatDate`, `statusBadge`, `requireAuth`, `populateTopbar`) |
| `app.js` | IntersectionObserver scroll-reveal, active nav link detection |
| `navbar.js` | Scroll shadow on navbar, mobile hamburger toggle |
| `theme.js` | Light/dark mode toggle persisted in `localStorage` |
| `slider.js` | Reusable `Slider` class with autoplay, prev/next, dot navigation |
| `contact.js` | Contact form validation + `POST /api/contact` submission |
| `validation.js` | Reusable client-side validation rules and helpers |
| `dashboard.js` | Auth guard (`requireAuth`), logout, toast notifications, confirm modal |
| `charts.js` | Chart.js definitions for revenue (line), traffic (doughnut), analytics (bar) |

---

## Backend

### API Endpoints

#### Public
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/auth/login` | Login, returns JWT token |
| `POST` | `/api/contact` | Submit contact form, saves to DB + sends SES email |
| `GET` | `/api/posts` | List published blog posts |
| `GET` | `/api/posts/:id` | Get single post |

#### Protected (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/dashboard/stats` | Total users, messages, posts counts |
| `GET` | `/api/messages` | List all contact messages |
| `GET` | `/api/messages/:id` | Get single message |
| `PUT` | `/api/messages/:id/status` | Update message status |
| `DELETE` | `/api/messages/:id` | Delete message |
| `POST` | `/api/posts` | Create blog post |
| `PUT` | `/api/posts/:id` | Update blog post |
| `DELETE` | `/api/posts/:id` | Delete blog post |
| `POST` | `/api/uploads/presign` | Get S3 presigned upload URL |

#### Admin Only
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get single user |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |

### Database Schema

```sql
users
  id            SERIAL PRIMARY KEY
  name          VARCHAR(100)   NOT NULL
  email         VARCHAR(255)   NOT NULL UNIQUE
  password_hash VARCHAR(255)   NOT NULL
  role          VARCHAR(20)    DEFAULT 'editor'   -- 'admin' | 'editor'
  status        VARCHAR(20)    DEFAULT 'active'   -- 'active' | 'inactive'
  created_at    TIMESTAMPTZ    DEFAULT NOW()

messages
  id         SERIAL PRIMARY KEY
  name       VARCHAR(100)  NOT NULL
  email      VARCHAR(255)  NOT NULL
  subject    VARCHAR(255)  NOT NULL
  service    VARCHAR(100)
  message    TEXT          NOT NULL
  status     VARCHAR(20)   DEFAULT 'new'    -- 'new' | 'pending' | 'replied'
  created_at TIMESTAMPTZ   DEFAULT NOW()

posts
  id         SERIAL PRIMARY KEY
  title      VARCHAR(255)  NOT NULL
  category   VARCHAR(100)  NOT NULL
  content    TEXT          NOT NULL
  author_id  INTEGER       REFERENCES users(id) ON DELETE SET NULL
  status     VARCHAR(20)   DEFAULT 'draft'  -- 'draft' | 'published'
  created_at TIMESTAMPTZ   DEFAULT NOW()
  updated_at TIMESTAMPTZ   DEFAULT NOW()
```

### Authentication

- Passwords hashed with `bcryptjs` (12 salt rounds)
- JWT tokens signed with `JWT_SECRET`, expire in 7 days (configurable)
- Token stored in browser `localStorage` under key `fg_token`
- All protected routes verify token via `Authorization: Bearer <token>` header
- Auto-redirect to login on 401 responses
- Admin-only routes additionally check `role === 'admin'`

### AWS Integrations

**S3 — File Uploads**
- Frontend requests a presigned URL from `POST /api/uploads/presign`
- Browser uploads directly to S3 using the presigned URL (no file passes through the server)
- Supports: `image/jpeg`, `image/png`, `image/webp`, `image/gif` up to 5MB

**SES — Email**
- Contact form submissions trigger an email notification to the admin
- Email sent from `SES_FROM_EMAIL` to `SES_TO_EMAIL`
- SES errors are non-fatal (logged but don't fail the API response)
- Note: SES is in sandbox mode by default — verify sender/recipient emails in AWS console before going live

---

## AWS Infrastructure

### Current Setup

| Resource | ID / Name | Status |
|---|---|---|
| VPC | `vpc-03ed0e7992d5bc1ad` (default, `172.31.0.0/16`) | ✅ Active |
| Internet Gateway | `igw-07e42b9dd04d4278f` | ✅ Attached |
| Subnets | 6 public subnets across us-east-1a–f | ✅ Available |
| Route Table | `rtb-01482bb6282a44c1f` (main, routes to IGW) | ✅ Active |
| Security Group | `sg-0f1f4571a4eb88116` (`fg-secure-webapp-sg`) | ⚠️ Needs refinement |
| S3 Bucket | `fastgrowth-webapp-assets-bucket` | ✅ Created |
| Region | `us-east-1` (N. Virginia) | ✅ |

### Target Architecture

```
Internet
    │
Route 53 (DNS)
    │
CloudFront (CDN + HTTPS via ACM)
    │
    ├── /* (static)  ──────────────────► S3 Bucket
    │                                    (frontend assets)
    │
    └── /api/* ───────────────────────► ALB (Application Load Balancer)
                                          │
                                    ┌─────┴─────┐
                                  EC2 #1      EC2 #2
                               (Node.js)   (Node.js)
                                    └─────┬─────┘
                                          │
                                   RDS PostgreSQL
                                    (Multi-AZ)
```

**Security Groups (to be created):**
```
sg-alb   → inbound:  80, 443 from 0.0.0.0/0
sg-ec2   → inbound:  80 from sg-alb only | 22 from your IP only
sg-rds   → inbound:  5432 from sg-ec2 only
```

**Still to provision:**
- [ ] Fix security groups (separate ALB / EC2 / RDS)
- [ ] RDS PostgreSQL instance
- [ ] EC2 instance(s) with Node.js + Nginx + PM2
- [ ] Application Load Balancer + Target Group
- [ ] ACM certificate (us-east-1 for CloudFront)
- [ ] CloudFront distribution
- [ ] S3 bucket policy for CloudFront OAC
- [ ] Route 53 hosted zone (when custom domain is acquired)
- [ ] CloudWatch log groups + alarms
- [ ] Secrets Manager entries for DB credentials and JWT secret

---

## Getting Started

### Frontend (Local)

No build step required. Open with VS Code Live Server:

1. Open `index.html` in VS Code
2. Click **Go Live** in the status bar
3. Site runs at `http://127.0.0.1:5500`

> The frontend will work without the backend running — dashboard pages will redirect to login, and the contact form will show an error until the API is running.

### Backend (Local)

**Prerequisites:** Node.js 20+, PostgreSQL 14+

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your local DB credentials and secrets

# 4. Create the database
psql -U postgres -c "CREATE DATABASE fastgrowth;"

# 5. Run migrations (creates tables + seeds admin user)
npm run migrate

# 6. Start development server
npm run dev
# API runs at http://localhost:3000
```

**Verify it's working:**
```bash
curl http://localhost:3000/health
# {"success":true,"status":"ok","timestamp":"..."}
```

**Test login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fastgrowth.com","password":"password"}'
```

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (RDS PostgreSQL)
DB_HOST=localhost                    # or your RDS endpoint
DB_PORT=5432
DB_NAME=fastgrowth
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_min_32_chars
JWT_EXPIRES_IN=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# S3
S3_BUCKET_ASSETS=fastgrowth-webapp-assets-bucket
S3_BUCKET_UPLOADS=fastgrowth-uploads-bucket

# SES
SES_FROM_EMAIL=hello@fastgrowth.com
SES_TO_EMAIL=admin@fastgrowth.com

# CORS
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

> **Never commit `.env` to version control.** Use AWS Secrets Manager in production.

---

## Deployment

### Frontend to S3 + CloudFront

```bash
# Sync frontend files to S3
aws s3 sync . s3://fastgrowth-webapp-assets-bucket \
  --exclude "backend/*" \
  --exclude "*.md" \
  --exclude ".git/*" \
  --exclude "docs/*" \
  --delete

# Invalidate CloudFront cache after deploy
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Backend to EC2

**First-time setup (run once on fresh EC2 instance):**
```bash
# Upload and run bootstrap script
scp backend/scripts/bootstrap.sh ec2-user@<EC2_IP>:~/
ssh ec2-user@<EC2_IP> "bash ~/bootstrap.sh"
```

**Clone and start the app:**
```bash
ssh ec2-user@<EC2_IP>
cd /var/www/fastgrowth
git clone https://github.com/your-org/fastgrowth-backend.git backend
cd backend
cp .env.example .env
# Edit .env with production values
npm install --omit=dev
npm run migrate
pm2 start ecosystem.config.js --env production
pm2 save
```

**Subsequent deploys:**
```bash
bash backend/scripts/deploy.sh
```

---

## Dashboard Login

| Field | Value |
|---|---|
| URL | `login.html` |
| Email | `admin@fastgrowth.com` |
| Password | `password` |

> **Change this password immediately** after first login in production. The seed hash in `001_initial_schema.sql` is for development only.

---

## Security Considerations

### Current Issues to Address Before Production

1. **SSH open to world** — Security group `sg-0f1f4571a4eb88116` has port 22 open to `0.0.0.0/0`. Restrict to your IP or use AWS SSM Session Manager instead (no port 22 needed).

2. **All subnets are public** — EC2 and RDS should be in private subnets. The default VPC only has public subnets. Create private subnets or use a custom VPC.

3. **Default admin password** — The seeded password `password` must be changed before any public deployment.

4. **JWT in localStorage** — Susceptible to XSS. Consider `httpOnly` cookies for production.

5. **SES sandbox mode** — By default AWS SES only sends to verified email addresses. Request production access in the AWS console.

6. **No HTTPS locally** — Use HTTPS in production via ACM + CloudFront/ALB. Never run the API on plain HTTP in production.

7. **AWS credentials in .env** — Use IAM roles attached to EC2 instead of access keys in production. Remove `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from `.env` on EC2.

### Best Practices Already Implemented

- Passwords hashed with bcrypt (12 rounds)
- JWT expiry enforced
- Rate limiting on all API routes (100 req/15min) and stricter on login (10 req/15min)
- Helmet.js security headers
- Input validation on all endpoints via express-validator
- SQL injection prevention via parameterized queries
- Self-deletion prevention (admin cannot delete own account)
- Global error handler prevents stack trace leakage in production
- CORS restricted to allowed origins

---

## Known Issues & Limitations

| Issue | Impact | Fix |
|---|---|---|
| `validation.js` uses ES module `export` but loaded as regular script | Silent failure in some browsers | Remove `export` statements or convert to ES module with `type="module"` |
| API base URL hardcoded to `localhost:3000` in `api.js` | Won't work after deployment | Replace with environment-aware config or relative URL |
| No pagination on dashboard tables | Will break with large datasets | Add `limit`/`offset` controls to tables |
| Charts use static mock data | Not connected to real data | Wire charts to API endpoints |
| No image uploads UI | S3 presign endpoint exists but no frontend | Build file upload component |
| Settings page saves nothing | Forms are not wired to API | Add settings table to DB and wire forms |
| Profile page saves nothing | Form is not wired to API | Wire to `PUT /api/users/:id` |
| No refresh token | JWT expires after 7 days, user is logged out | Implement refresh token flow |
| No email templates | SES sends plain HTML string | Create proper HTML email templates |

---

## Recommendations

### Immediate (Before Going Live)

1. **Fix the security group** — Separate into `sg-alb`, `sg-ec2`, `sg-rds` with least-privilege rules
2. **Create private subnets** — Move EC2 and RDS off public subnets
3. **Use IAM roles on EC2** — Remove AWS credentials from `.env`, attach an IAM role with S3 and SES permissions
4. **Store secrets in AWS Secrets Manager** — DB password, JWT secret, and any API keys
5. **Change the default admin password** — Update the seed or change via the dashboard immediately
6. **Verify SES email addresses** — Or request SES production access to send to any address
7. **Fix `api.js` base URL** — Make it configurable so the same code works locally and in production

### Short Term

8. **Add HTTPS redirect** — Nginx config should redirect HTTP → HTTPS
9. **Enable RDS automated backups** — Set retention to at least 7 days
10. **Set up CloudWatch alarms** — Alert on EC2 CPU > 80%, RDS storage < 20%, 5xx error rate
11. **Add a `.github/workflows/deploy.yml`** — Automate frontend S3 sync and backend EC2 deploy on push to `main`
12. **Add `favicon.ico`** — Currently missing, browser tab shows blank icon
13. **Add meta descriptions and Open Graph tags** — Important for SEO and social sharing

### Architecture

14. **Consider RDS Proxy** — Reduces connection overhead when using multiple EC2 instances
15. **Enable CloudFront compression** — Gzip/Brotli for CSS/JS assets
16. **Set S3 lifecycle rules** — Auto-delete old uploads after a defined period
17. **Use SSM Parameter Store or Secrets Manager** — Instead of `.env` files on EC2

---

## Future Improvements

### Frontend
- [ ] Real images — hero, team photos, portfolio screenshots, blog cover images
- [ ] Hero slider using the existing `slider.js`
- [ ] Animated number counters on hero stats (count up on scroll)
- [ ] Single blog post page (`blog-post.html`) with full content rendering
- [ ] Rich text editor (e.g. Quill.js) for blog post creation in dashboard
- [ ] Image upload UI wired to S3 presigned URL endpoint
- [ ] Pagination controls on all dashboard tables
- [ ] Toast notifications for all user actions
- [ ] Skeleton loading states instead of "Loading…" text
- [ ] 404 error page
- [ ] Cookie consent banner (GDPR compliance)
- [ ] Accessibility audit — ARIA labels, skip-to-content link, focus styles
- [ ] Dark mode persistence across all dashboard pages

### Backend
- [ ] Refresh token implementation
- [ ] Password reset flow (forgot password → SES email → reset link)
- [ ] Email verification on user registration
- [ ] Pagination metadata in API responses (`total`, `page`, `pages`)
- [ ] Full-text search on messages and posts
- [ ] Blog post slugs for SEO-friendly URLs
- [ ] Image attachment support on blog posts
- [ ] Audit log table (track who changed what and when)
- [ ] API versioning (`/api/v1/...`)
- [ ] Swagger/OpenAPI documentation
- [ ] Unit and integration tests (Jest + Supertest)

### Infrastructure
- [ ] Custom domain via Route 53
- [ ] WAF (Web Application Firewall) in front of CloudFront
- [ ] Auto Scaling Group with scaling policies (CPU-based)
- [ ] Multi-AZ RDS for high availability
- [ ] ElastiCache (Redis) for session caching and rate limiting
- [ ] CI/CD pipeline via GitHub Actions
- [ ] Infrastructure as Code (CloudFormation or Terraform) for all resources
- [ ] Staging environment mirroring production
- [ ] VPC Flow Logs for network monitoring
- [ ] AWS Config for compliance monitoring

---

## What to Do Next

Follow this order for the most logical progression:

### Phase 1 — Make It Deployable
1. Fix security groups (create `sg-alb`, `sg-ec2`, `sg-rds`)
2. Provision RDS PostgreSQL instance in AWS console
3. Run `npm run migrate` against RDS to create schema
4. Launch EC2 instance, run `bootstrap.sh`, deploy backend
5. Create ALB pointing to EC2 target group
6. Request ACM certificate in `us-east-1`
7. Configure S3 bucket policy for CloudFront OAC
8. Create CloudFront distribution (S3 origin + ALB origin for `/api/*`)
9. Deploy frontend to S3 with `aws s3 sync`
10. Update `api.js` base URL to point to CloudFront domain

### Phase 2 — Make It Production-Ready
11. Set up CloudWatch log groups and alarms
12. Move secrets to AWS Secrets Manager
13. Attach IAM role to EC2 (remove credentials from `.env`)
14. Set up GitHub Actions CI/CD pipeline
15. Change default admin password
16. Verify SES and request production access
17. Add favicon, meta tags, Open Graph tags to all pages

### Phase 3 — Enhance the Product
18. Add real images and content
19. Build single blog post page
20. Add rich text editor to blog manager
21. Implement password reset flow
22. Add pagination to all tables
23. Wire settings and profile forms to API
24. Write unit and integration tests

### Phase 4 — Scale & Optimize
25. Add Auto Scaling Group to EC2
26. Enable Multi-AZ on RDS
27. Add ElastiCache for caching
28. Add WAF rules to CloudFront
29. Implement CDN cache headers on API responses
30. Performance audit (Lighthouse) and optimization

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

MIT License — see `LICENSE` file for details.

---

*Built with ❤️ by the FastGrowth team. Designed for AWS deployment.*
