# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Munchora** is a bachelor project implementing a microservices-based recipe and shopping list management application. The architecture uses Rails 8 API services with a React Router 7 frontend, communicating via RabbitMQ message queue.

## Architecture

### Microservices Backend (Rails 8 API-only)
The backend consists of 5 independent Rails services, each with:
- Its own MySQL database (except notifications-service)
- Independent deployment lifecycle
- RabbitMQ integration for inter-service communication
- JWT-based authentication (RS256 public/private key)

**Services:**
1. **auth-service** - User authentication, JWT generation, Google OAuth SSO
2. **recipes-service** - Recipe CRUD and management
3. **shopping-lists-service** - Shopping list management
4. **ai-service** - AI/ML processing with Sidekiq background jobs
5. **notifications-service** - Real-time notifications via ActionCable (no database)

### Frontend
- **React Router 7** full-stack framework with server-side rendering
- **TypeScript** for type safety
- **Radix UI** for accessible components
- **TanStack Query** for server state management
- **Jotai** for client state
- **ActionCable** for WebSocket connections

### Communication Patterns
- **Client → Services**: Direct HTTP requests through Nginx API gateway
- **Service → Service**: RabbitMQ message queue (asynchronous)
- **Background Jobs**: Sidekiq (AI service), RabbitMQ consumers (all services)
- **Real-time**: ActionCable WebSocket (notifications service)

### Authentication Flow
1. Auth service holds the **private key** for JWT signing
2. All other services have the **public key** for JWT verification
3. Keys stored in Rails encrypted credentials (`config/credentials.yml.enc`)
4. Supports both email/password and Google OAuth SSO

## Development Commands

### Local Development (Docker Compose)

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop and clean up (preserves volumes)
docker-compose -f docker-compose.dev.yml down --rmi all --remove-orphans

# Rebuild after adding gems
docker-compose -f docker-compose.dev.yml build <service-name>

# Run migrations in Docker
docker-compose exec <service-name> bundle exec rails db:migrate

# Restart a specific service (e.g., for hot reload)
docker-compose -f docker-compose.dev.yml restart recipes-rabbitmq-consumer
```

### Backend Services (within service directory)

```bash
# Install dependencies
bundle install

# Database setup
bundle exec rails db:create db:migrate

# Run server
bundle exec rails s

# Run tests (RSpec)
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/user_spec.rb

# Run specific test by line number
bundle exec rspec spec/models/user_spec.rb:42

# Linting (RuboCop)
bundle exec rubocop

# Auto-fix linting issues
bundle exec rubocop -a

# Security analysis
bundle exec brakeman

# Generate models with migrations
bin/rails generate model User first_name:string last_name:string email:string

# Generate controllers
bin/rails generate controller Users index show create update destroy

# Create empty migration (for indexes, etc.)
rails generate migration AddIndexesToUsers

# Rails credentials management
EDITOR="nano" rails credentials:edit
```

### Frontend (munchora/client)

```bash
# Install dependencies
npm install

# Development server (Vite)
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Start production server
npm start

# Run Cypress tests
npm run cypress:open    # Interactive mode
npm run cypress:run     # Headless mode
```

## Testing

### Backend Testing (RSpec)
- **Framework**: RSpec with Rails integration
- **Factories**: FactoryBot for test data
- **Mocking**: WebMock for HTTP requests (e.g., Google OAuth)
- **Matchers**: Shoulda Matchers for Rails-specific assertions
- **Coverage**: SimpleCov with branch coverage enabled
- **Database**: SQLite3 for tests, MySQL for development/production

**Test Database:**
```bash
# Use SQLite in tests (configured in Gemfile)
# MySQL used only in development/production environments
RAILS_ENV=test bundle exec rails db:migrate
```

**Coverage Reports:**
- Generated in `coverage/` directory
- JSON format for CI integration
- Branch coverage tracking enabled

### Frontend Testing (Cypress)
- End-to-end testing framework
- Located in `munchora/client/cypress/`

## Service-Specific Notes

### AI Service
The AI service has the most complex setup:
- **Sidekiq** for background job processing
- **RabbitMQ consumer** for message queue
- **Three Docker containers**: main server, Sidekiq worker, RabbitMQ consumer

### Notifications Service
- **No database** - purely event-driven
- Uses ActionCable for WebSocket connections
- Consumes RabbitMQ messages to broadcast notifications

### Auth Service
- **Only service with private JWT key**
- All others use public key for verification
- Google OAuth integration via `google-id-token` gem

## Rails Conventions

### Code Style
- **RuboCop**: Uses `rubocop-rails-omakase` as base
- **String literals**: Enforced single quotes (`'hello'` not `"hello"`)
- **Array spacing**: No spaces inside brackets (`[a, b]` not `[ a, b ]`)

### Testing Conventions
```ruby
# Model associations with Shoulda Matchers
describe "associations" do
  it { should have_many(:grocery_lists).with_foreign_key(:owner_id).dependent(:destroy) }
  it { should have_many(:shared_grocery_lists).through(:grocery_list_shares) }
end
```

### RabbitMQ Integration
Each service has:
- `config/initializers/rabbitmq.rb` - Connection setup
- `bin/rabbitmq_consumer_runner.rb` or `lib/rabbitmq_consumer_runner.rb` - Consumer process
- Queue definitions for request/response patterns

## Database Ports (Development)

| Service | MySQL Port | Rails Port (internal) |
|---------|-----------|---------------------|
| AI | 3307 | 3000 |
| Auth | 3308 | 3000 |
| Recipes | 3309 | 3000 |
| Shopping Lists | 3310 | 3000 |
| Notifications | N/A | 3000 |

**Frontend**: Port 5173 (Vite dev server)
**Nginx Gateway**: Port 3000 (routes to services)
**RabbitMQ**: 5672 (AMQP), 15672 (Management UI)

## CI/CD

### GitHub Actions Workflow
`.github/workflows/services-continuous-testing.yml` runs on PR/push to main:

1. **Linting** (parallel for all services)
   - RuboCop with JSON output
   - Fails on errors only

2. **RSpec Tests** (parallel for all services)
   - SQLite test databases
   - Credentials loaded from GitHub secrets
   - Coverage reports uploaded as artifacts

**Service Matrix:**
- Each service runs independently
- `fail-fast: false` to test all services even if one fails

## Deployment

### Kamal (Docker Deployment)
- Configured via `kamal` gem in Gemfile
- Kubernetes manifests in `/k8s` directory
- Uses Docker containers for all services

### JWT Key Generation
```bash
# Generate private key
openssl genrsa -out jwt_private.pem 2048

# Generate public key
openssl rsa -in jwt_private.pem -pubout -out jwt_public.pem

# Add to Rails credentials
EDITOR="nano" rails credentials:edit
```

Then add:
```yaml
jwt_private_key: |
  -----BEGIN RSA PRIVATE KEY-----
  [key content]
  -----END RSA PRIVATE KEY-----

jwt_public_key: |
  -----BEGIN PUBLIC KEY-----
  [key content]
  -----END PUBLIC KEY-----
```

## Common Gotchas

1. **SimpleCov Coverage Discrepancies**: Set `config.eager_load = false` in `config/environments/test.rb` to avoid differences between local and CI coverage
2. **RabbitMQ Consumer Runners**: These are separate processes that must be started alongside the Rails server in development
3. **Rails Credentials**: Each service has its own `config/master.key` (not committed). CI requires GitHub secrets for each service's master key
4. **Service Path Prefixes**: Services use `RAILS_RELATIVE_URL_ROOT` env var to handle Nginx routing (e.g., `/auth`, `/recipes`)
5. **Test Database**: Tests use SQLite3, not MySQL, for faster execution and simpler CI setup
