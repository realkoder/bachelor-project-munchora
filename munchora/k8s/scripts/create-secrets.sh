#!/bin/bash
# -e flag will exits immediately if any command returns a non‑zero status (i.e., fails), instead of continuing
set -e

# Script to create all Kubernetes secrets for Munchora microservices
# Run this script before deploying the application

echo "🔐 Creating Kubernetes Secrets for Munchora..."
echo ""

# Base directory
BASE_DIR="/Users/alexanderchristensen/Projects/software-udvikling/assignments/bachelor-project/munchora"

# ====================
# Newrelic License Key
# ====================
echo "📝 Creating newrelic license key..."
NEWRELIC_LICENSE_KEY=$(grep NEW_RELIC_LICENSE_KEY "$BASE_DIR/backend/ai-service/.env.dev" | cut -d '=' -f2-)

    if [ -n "NEWRELIC_LICENSE_KEY" ]; then
        kubectl create secret generic newrelic-license \
            --from-literal=NEW_RELIC_LICENSE_KEY="$NEWRELIC_LICENSE_KEY" \
            --dry-run=client -o yaml | kubectl apply -f -
        echo "✅ newrelic license key created"
    else
        echo "⚠️  Warning: NEWRELIC_LICENSE_KEY not found!"
    fi
echo ""

# ====================
# MySQL Credentials
# ====================
echo "📝 Creating MySQL credentials secret..."
kubectl create secret generic mysql-credentials \
    --from-literal=MYSQL_USER=munchora \
    --from-literal=MYSQL_PASSWORD=admin \
    --from-literal=MYSQL_ROOT_PASSWORD=admin \
    --dry-run=client -o yaml | kubectl apply -f -
echo "✅ MySQL credentials secret created"
echo ""

# ====================
# RabbitMQ Credentials
# ====================
echo "📝 Creating RabbitMQ credentials secret..."
kubectl create secret generic rabbitmq-credentials \
    --from-literal=RABBITMQ_PASSWORD=guest \
    --dry-run=client -o yaml | kubectl apply -f -
echo "✅ RabbitMQ credentials secret created"
echo ""

# ====================
# Rails Master Keys
# ====================
echo "📝 Creating Rails master key secrets..."

# Auth Service
if [ -f "$BASE_DIR/backend/auth-service/config/master.key" ]; then
    kubectl create secret generic auth-service-master-key \
        --from-literal=RAILS_MASTER_KEY=$(cat "$BASE_DIR/backend/auth-service/config/master.key") \
        --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Auth service master key created"
else
    echo "⚠️  Warning: Auth service master.key not found"
fi

# Recipes Service
if [ -f "$BASE_DIR/backend/recipes-service/config/master.key" ]; then
    kubectl create secret generic recipes-service-master-key \
        --from-literal=RAILS_MASTER_KEY=$(cat "$BASE_DIR/backend/recipes-service/config/master.key") \
        --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Recipes service master key created"
else
    echo "⚠️  Warning: Recipes service master.key not found"
fi

# Shopping Lists Service
if [ -f "$BASE_DIR/backend/shopping-lists-service/config/master.key" ]; then
    kubectl create secret generic shopping-lists-service-master-key \
        --from-literal=RAILS_MASTER_KEY=$(cat "$BASE_DIR/backend/shopping-lists-service/config/master.key") \
        --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Shopping lists service master key created"
else
    echo "⚠️  Warning: Shopping lists service master.key not found"
fi

# AI Service
if [ -f "$BASE_DIR/backend/ai-service/config/master.key" ]; then
    kubectl create secret generic ai-service-master-key \
        --from-literal=RAILS_MASTER_KEY=$(cat "$BASE_DIR/backend/ai-service/config/master.key") \
        --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ AI service master key created"
else
    echo "⚠️  Warning: AI service master.key not found"
fi

# Notifications Service
if [ -f "$BASE_DIR/backend/notifications-service/config/master.key" ]; then
    kubectl create secret generic notifications-service-master-key \
        --from-literal=RAILS_MASTER_KEY=$(cat "$BASE_DIR/backend/notifications-service/config/master.key") \
        --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Notifications service master key created"
else
    echo "⚠️  Warning: Notifications service master.key not found"
fi
echo ""

# ====================
# Google OAuth Credentials
# ====================
echo "📝 Creating Google OAuth credentials secret..."
if [ -f "$BASE_DIR/backend/auth-service/.env.dev" ]; then
    # Extract Google OAuth credentials from .env.dev
    GOOGLE_CLIENT_ID=$(grep GOOGLE_CLIENT_ID "$BASE_DIR/backend/auth-service/.env.dev" | cut -d '=' -f2-)
    GOOGLE_CLIENT_SECRET=$(grep GOOGLE_CLIENT_SECRET "$BASE_DIR/backend/auth-service/.env.dev" | cut -d '=' -f2-)

    if [ -n "$GOOGLE_CLIENT_ID" ] && [ -n "$GOOGLE_CLIENT_SECRET" ]; then
        kubectl create secret generic google-oauth \
            --from-literal=GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
            --from-literal=GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
            --dry-run=client -o yaml | kubectl apply -f -
        echo "✅ Google OAuth credentials secret created"
    else
        echo "⚠️  Warning: Google OAuth credentials not found in .env.dev. Creating placeholder secret."
        kubectl create secret generic google-oauth \
            --from-literal=GOOGLE_CLIENT_ID=placeholder \
            --from-literal=GOOGLE_CLIENT_SECRET=placeholder \
            --dry-run=client -o yaml | kubectl apply -f -
    fi
else
    echo "⚠️  Warning: Auth service .env.dev not found. Creating placeholder secret."
    kubectl create secret generic google-oauth \
        --from-literal=GOOGLE_CLIENT_ID=placeholder \
        --from-literal=GOOGLE_CLIENT_SECRET=placeholder \
        --dry-run=client -o yaml | kubectl apply -f -
fi
echo ""

# ====================
# OpenAI API Credentials
# ====================
echo "📝 Creating OpenAI credentials secret..."
if [ -f "$BASE_DIR/backend/ai-service/.env.dev" ]; then
    # Extract OpenAI API key from .env.dev
    OPENAI_API=$(grep OPENAI_API "$BASE_DIR/backend/ai-service/.env.dev" | cut -d '=' -f2-)

    if [ -n "$OPENAI_API" ]; then
        kubectl create secret generic openai-credentials \
            --from-literal=OPENAI_API="$OPENAI_API" \
            --dry-run=client -o yaml | kubectl apply -f -
        echo "✅ OpenAI credentials secret created"
    else
        echo "⚠️  Warning: OpenAI API key not found in .env.dev. Creating placeholder secret."
        kubectl create secret generic openai-credentials \
            --from-literal=OPENAI_API=placeholder \
            --dry-run=client -o yaml | kubectl apply -f -
    fi
else
    echo "⚠️  Warning: AI service .env.dev not found. Creating placeholder secret."
    kubectl create secret generic openai-credentials \
        --from-literal=OPENAI_API=placeholder \
        --dry-run=client -o yaml | kubectl apply -f -
fi
echo ""

# ====================
# Upstash Redis URL
# ====================
echo "📝 Creating Upstash Redis credentials secret..."
if [ -f "$BASE_DIR/backend/ai-service/.env.dev" ]; then
    # Extract Upstash Redis URL from .env.dev
    UPSTASH_REDIS_URL=$(grep UPSTASH_REDIS_URL "$BASE_DIR/backend/ai-service/.env.dev" | cut -d '=' -f2-)

    if [ -n "$UPSTASH_REDIS_URL" ]; then
        kubectl create secret generic upstash-redis \
            --from-literal=UPSTASH_REDIS_URL="$UPSTASH_REDIS_URL" \
            --dry-run=client -o yaml | kubectl apply -f -
        echo "✅ Upstash Redis credentials secret created"
    else
        echo "⚠️  Warning: Upstash Redis URL not found in .env.dev. Creating placeholder secret."
        kubectl create secret generic upstash-redis \
            --from-literal=UPSTASH_REDIS_URL=redis://localhost:6379 \
            --dry-run=client -o yaml | kubectl apply -f -
    fi
else
    echo "⚠️  Warning: AI service .env.dev not found. Creating placeholder secret."
    kubectl create secret generic upstash-redis \
        --from-literal=UPSTASH_REDIS_URL=redis://localhost:6379 \
        --dry-run=client -o yaml | kubectl apply -f -
fi
echo ""

# ====================
# Resend API Key (Optional)
# ====================
echo "📝 Creating Resend API credentials secret..."
if [ -f "$BASE_DIR/backend/notifications-service/.env.dev" ]; then
    # Extract Resend API key from .env.dev
    RESEND_API_KEY=$(grep RESEND_API_KEY "$BASE_DIR/backend/notifications-service/.env.dev" | cut -d '=' -f2-)

    if [ -n "$RESEND_API_KEY" ]; then
        kubectl create secret generic resend-api \
            --from-literal=RESEND_API_KEY="$RESEND_API_KEY" \
            --dry-run=client -o yaml | kubectl apply -f -
        echo "✅ Resend API credentials secret created"
    else
        echo "⚠️  Warning: Resend API key not found in .env.dev. Creating placeholder secret."
        kubectl create secret generic resend-api \
            --from-literal=RESEND_API_KEY=placeholder \
            --dry-run=client -o yaml | kubectl apply -f -
    fi
else
    echo "⚠️  Warning: Notifications service .env.dev not found. Creating placeholder secret."
    kubectl create secret generic resend-api \
        --from-literal=RESEND_API_KEY=placeholder \
        --dry-run=client -o yaml | kubectl apply -f -
fi
echo ""

# ====================
# Summary
# ====================
echo "✅ All secrets created successfully!"
echo ""
echo "📋 List of created secrets:"
kubectl get secrets | grep -E "(jwt-keys|mysql-credentials|rabbitmq-credentials|master-key|google-oauth|openai-credentials|upstash-redis|resend-api)"
echo ""
echo "🚀 You can now proceed to deploy the application using ./k8s/scripts/apply-all.sh"
