# BlogERP - Master Project Context

You are developing BlogERP.

Always read this file before generating code.

=================================================
PROJECT OVERVIEW
=================================================

Project Name:
BlogERP

Project Type:
Multi-tenant SaaS Blog Platform

Tech Stack:

Backend:
- Node.js
- NestJS
- MongoDB
- Mongoose
- JWT
- Refresh Tokens
- Redis (future)
- Swagger

Frontend:
- React
- TypeScript
- Vite
- Axios
- TailwindCSS

Architecture:
- Clean Architecture
- Modular Structure
- Multi-tenant Design
- RBAC
- Scalable APIs

=================================================
MULTI TENANT ROUTING
=================================================

Support all three modes:

1. Path-based

blogerp.com/devorg

2. Subdomain

devorg.blogerp.com

3. Custom Domain

devorg.com

Priority order:

1. Custom domain
2. Subdomain
3. Path-based routing

=================================================
DATABASE DESIGN
=================================================

Collections:

tenants

Fields:

- name
- slug
- subdomain
- customDomain
- domainVerified
- plan
- status
- settings
- createdAt
- updatedAt

users

Fields:

- tenantId
- name
- email
- passwordHash
- role
- status
- createdAt
- updatedAt

blogs

Fields:

- tenantId
- authorId
- title
- slug
- content
- status
- tags
- seoMeta
- publishedAt
- createdAt
- updatedAt

domains

Fields:

- tenantId
- domain
- type
- verified
- verificationToken
- verifiedAt

=================================================
ROLES
=================================================

super_admin

Permissions:

- Manage all tenants
- Manage all users
- Manage billing
- Manage settings

admin

Permissions:

- Manage users
- Manage blogs
- Manage domains
- Manage tenant settings

editor

Permissions:

- Create blog
- Edit own blog
- Publish own blog

viewer

Permissions:

- Read only

=================================================
BACKEND RULES
=================================================

Always:

- Use TypeScript
- Use NestJS modules
- Use dependency injection
- Use DTO validation
- Use class-validator
- Use Swagger decorators
- Use exception filters
- Use guards
- Use interceptors
- Use proper error handling
- Use environment variables
- Use Mongoose schemas
- Use repository pattern
- Use service layer
- Add logging

Folder structure:

src/

├── auth
├── tenants
├── users
├── blogs
├── domains
├── common
├── config

=================================================
AUTH RULES
=================================================

Authentication:

- JWT access token
- Refresh token
- Password hashing using bcrypt
- Token expiration
- Secure cookie support

Authorization:

- RBAC guards
- Role decorators
- Tenant guards

=================================================
TENANT MIDDLEWARE
=================================================

Priority:

1.

Find by custom domain

devorg.com

2.

Find by subdomain

devorg.blogerp.com

3.

Find by path

blogerp.com/devorg

Attach tenant:

req.tenant

=================================================
FRONTEND RULES
=================================================

Always:

- TypeScript only
- Functional components only
- Custom hooks
- Reusable components
- Responsive UI
- Lazy loading
- Route guards
- Axios interceptors

Folder structure:

src/

├── apps
│ ├── SuperAdmin
│ ├── Admin
│ └── Editor

├── shared
│ ├── components
│ ├── hooks
│ └── api

=================================================
SECURITY RULES
=================================================

Check:

- JWT security
- XSS
- CSRF
- MongoDB injection
- Validation
- Rate limiting
- Helmet
- Secure headers
- CORS
- Environment variables
- Sensitive data exposure

=================================================
CODE REVIEW RULES
=================================================

Review:

- Code quality
- Performance
- Security
- Scalability
- Maintainability
- Memory leaks
- Unused code
- MongoDB queries
- React rendering
- NestJS patterns

=================================================
DEVELOPMENT PHASES
=================================================

Phase 1

- Authentication
- Super Admin
- Tenant CRUD
- User CRUD

Phase 2

- Blog CRUD
- RBAC
- Tenant middleware

Phase 3

- Domain verification

Phase 4

- Public blog UI
- SEO

Phase 5

- Billing

Phase 6

- AI draft generation

Phase 7

- Analytics Engine
- Blog Interaction Tracking (Reads, Likes, Shares)
- Tenant Analytics Dashboard (Graphs, Charts, Key Metrics)
- Configurable Commenting System (Per-blog toggle)

=================================================
CURRENT STATUS
=================================================

Completed:
- Project architecture
- Database design
- API design

Current Phase:
Phase 7

In Progress:
- Analytics data aggregation fine-tuning

Completed:
- Project architecture
- Database design
- API design
- NestJS project setup
- Auth Module (JWT, Refresh Tokens)
- Tenant CRUD (Backend & Frontend)
- User CRUD (Backend & Frontend)
- RBAC implementation (Backend & Frontend)
- Super Admin Dashboard (Frontend)
- Login implementation (Frontend)
- Blog CRUD (Backend & Frontend)
- Multi-tenant Middleware (Backend)
- Tenant Admin Dashboard (Frontend)
- Domain Module (Backend)
- Domain Verification Workflow (DNS check)
- Domain Management UI (Frontend)
- Public Blog Controller (Backend)
- Dynamic Theme/Styling based on Tenant settings
- Public Blog Home and Article pages (Frontend)
- Dynamic SEO Meta tags implementation
- Stripe/Payment Gateway Integration
- Subscription Plans (Free, Pro, Enterprise)
- Billing Dashboard & Customer Portal (Frontend)
- Plan-based feature gating (post limits, custom domains, white-labeling)
- Analytics Engine (Backend tracking for views, likes, shares)
- Time-series Data Schema (Daily metric aggregation)
- Public Interaction Hook (Automatic view tracking)
- Configurable Commenting System (Per-blog moderation)
- Rich Tenant Dashboard (Interactive charts using Recharts)
- Comment Moderation UI (Admin approve/reject flow)

Next Tasks:
1. Integrate OpenAI/Anthropic API for content generation

2. Add "AI Draft" button in Blog Editor

3. Implement prompt templates for different blog styles (Professional, Casual, Tech)

4. Create backend service for AI content orchestration and quota management


=================================================
AI AGENT RULES
=================================================

Always:

- Read this file first
- Never skip phases
- Complete current phase before moving forward
- Update CURRENT STATUS after work
- Keep existing architecture
- Generate production-ready code
- Avoid changing structure unnecessarily
- Follow clean architecture
