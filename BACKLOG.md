# Munchora backlog

## MVP

### Platform
- [ ] MUN-17 — Implement authorization and privacy rules _(Urgent, auth-service)_
    - [ ] MUN-27 — Design database schema for core domain models _(High, platform)_
    - [ ] MUN-30 — Define API contracts for auth and recipes _(High, shopping-lists-service)_
- [ ] MUN-18 — Set up app architecture and core data models _(Medium, platform)_
- [ ] MUN-57 — Design microservice architecture and service boundaries _(Urgent, platform)_
- [ ] MUN-58 — Set up local development environment for all services _(Urgent, platform)_
- [ ] MUN-59 — Create shared service configuration and secrets strategy _(High, platform)_
- [ ] MUN-60 — Implement shared event contracts and versioning rules _(Urgent, platform)_
- [ ] MUN-61 — Set up RabbitMQ messaging topology and conventions _(Urgent, platform)_
- [ ] MUN-62 — Add service observability for distributed messaging _(High, platform)_

### Frontend
- [ ] MUN-63 — Build frontend application shell and service integrations _(High, frontend)_
- [ ] MUN-20 — Add real-time grocery list sync with reconnect logic _(High, shopping-lists-service)_

### Auth
- [ ] MUN-5 — Add Google SSO authentication _(Urgent, auth-service)_
- [ ] MUN-8 — Build profile management and account deletion _(High, auth-service)_
- [ ] MUN-64 — Build auth-service foundations and auth flows _(Urgent, auth-service)_

### Recipes
- [ ] MUN-7 — Create recipe search with text and filters _(High, recipes-service)_
- [ ] MUN-9 — Build recipe detail pages _(High, recipes-service)_
- [ ] MUN-12 — Support manual editing and privacy controls for recipes _(Medium, recipes-service)_
- [ ] MUN-65 — Build recipes-service foundations and recipe workflows _(High, recipes-service)_

#### Recipe search breakdown
- [ ] MUN-45 — Design recipe search database indexes and query strategy _(High, recipes-service)_
- [ ] MUN-46 — Build recipe search backend and filter logic _(High, recipes-service)_
- [ ] MUN-47 — Implement recipe search API responses and pagination _(High, recipes-service)_
- [ ] MUN-48 — Build recipe search frontend and filter UX _(Medium, recipes-service)_
- [ ] MUN-29 — Implement recipe search endpoint and filtering _(High, shopping-lists-service)_
- [ ] MUN-32 — Build recipe search UI with pagination _(Medium, recipes-service)_

### AI
- [ ] MUN-10 — Implement AI recipe generation from prompts _(High, ai-service)_
    - [ ] MUN-33 — Integrate AI recipe generation service _(High, recipes-service)_
    - [ ] MUN-34 — Build AI recipe generation UX and states _(Medium, ai-service)_
    - [ ] MUN-49 — Create recipe and AI generation data models _(High, ai-service)_
    - [ ] MUN-50 — Build AI recipe generation backend workflow _(High, ai-service)_
    - [ ] MUN-51 — Build AI recipe generation frontend experience _(Medium, ai-service)_
    - [ ] MUN-53 — Create shopping list sharing database schema _(High, auth-service)_
- [ ] MUN-11 — Implement AI recipe editing from prompts _(Medium, ai-service)_
- [ ] MUN-68 — Build ai-service foundations and recipe AI workflows _(Urgent, ai-service)_
- [ ] MUN-69 — Set up Sidekiq workers for ai-service async jobs _(Urgent, ai-service)_

### Shopping lists
- [ ] MUN-14 — Build shopping list CRUD and item completion _(Urgent, shopping-lists-service)_
    - [ ] MUN-35 — Build shopping list and item CRUD endpoints _(High, shopping-lists-service)_
    - [ ] MUN-36 — Build shopping list and item CRUD endpoints _(High, auth-service)_
- [ ] MUN-15 — Add recipe ingredients to shopping lists _(Medium, shopping-lists-service)_

---

## Beta

### Platform
- [ ] MUN-21 — Add observability, auditing, and error tracking _(High, platform)_
- [ ] MUN-23 — Set up backups, uptime safeguards, and recovery plan _(High, platform)_
- [ ] MUN-24 — Create CI/CD pipeline and deployment foundation _(High, platform)_
    - [ ] MUN-39 — Add reconnect and conflict handling for shared shopping lists _(High, auth-service)_
- [ ] MUN-25 — Add security hardening and abuse protection _(High, platform)_
    - [ ] MUN-40 — Implement shopping list sharing API endpoints _(High, shopping-lists-service)_
- [ ] MUN-70 — Add RabbitMQ retry, dead-letter, and idempotency handling _(High, platform)_
- [ ] MUN-71 — Implement integration testing across service boundaries _(High, platform)_
- [ ] MUN-72 — Create deployment topology for microservices and messaging _(High, platform)_

### Frontend
- [ ] MUN-22 — Implement performance and caching strategy _(Medium, frontend)_

### Shopping lists
- [ ] MUN-66 — Build shopping-lists-service foundations and collaboration flows _(Urgent, shopping-lists-service)_

### Notifications
- [ ] MUN-67 — Build notifications-service event consumers and delivery flows _(Medium, notifications-service)_

---

## Production

### Auth
- [ ] MUN-6 — Implement email/password sign up and sign in _(Medium, auth-service)_

### Recipes
- [ ] MUN-13 — Add likes and comments for recipes _(Medium, recipes-service)_

### Shopping lists
- [ ] MUN-16 — Implement shared shopping lists and member exit flow _(High, auth-service)_
    - [ ] MUN-52 — Create shopping list sharing database schema _(Medium, shopping-lists-service)_
    - [ ] MUN-54 — Build shopping list sharing backend and permission logic _(High, shopping-lists-service)_
    - [ ] MUN-55 — Implement shopping lists sharing API endpoints _(High, shopping-lists-service)_
    - [ ] MUN-56 — Build shopping list sharing frontend management UI _(Medium, shopping-lists-service, frontend)_
- [ ] MUN-19 — Add real-time shopping list sync with reconnect logic _(Urgent, shopping-lists-service, notifications-service)_

### Platform
- [ ] MUN-26 — Define analytics and product event tracking _(Medium, platform)_

---

## Notes
- This export excludes issues already marked **Done**.
- A few issues in Linear currently have odd parent/service assignments from earlier planning edits; I kept the issue list intact but grouped it into the most sensible buckets for review.
