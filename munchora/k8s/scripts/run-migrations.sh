#!/bin/bash
set -e

# Script to run database migrations for all services with databases
# Run this after deploying the application for the first time

echo "🗄️  Running Database Migrations for Munchora Services..."
echo ""

# ====================
# 1. Auth Service
# ====================
echo "📝 Running migrations for auth-service..."
if kubectl get deployment auth-service &> /dev/null; then
    POD=$(kubectl get pod -l app=auth-service -o jsonpath="{.items[0].metadata.name}")
    if [ -n "$POD" ]; then
        echo "  Found pod: $POD"
        kubectl exec -it "$POD" -- bundle exec rails db:migrate
        echo "✅ Auth service migrations complete"
    else
        echo "⚠️  No auth-service pod found. Skipping."
    fi
else
    echo "⚠️  Auth service deployment not found. Skipping."
fi
echo ""

# ====================
# 2. Recipes Service
# ====================
echo "📝 Running migrations for recipes-service..."
if kubectl get deployment recipes-service &> /dev/null; then
    POD=$(kubectl get pod -l app=recipes-service,component=server -o jsonpath="{.items[0].metadata.name}")
    if [ -n "$POD" ]; then
        echo "  Found pod: $POD"
        kubectl exec -it "$POD" -- bundle exec rails db:migrate
        echo "✅ Recipes service migrations complete"
    else
        echo "⚠️  No recipes-service pod found. Skipping."
    fi
else
    echo "⚠️  Recipes service deployment not found. Skipping."
fi
echo ""

# ====================
# 3. Shopping Lists Service
# ====================
echo "📝 Running migrations for shopping-lists-service..."
if kubectl get deployment shopping-lists-service &> /dev/null; then
    POD=$(kubectl get pod -l app=shopping-lists-service -o jsonpath="{.items[0].metadata.name}")
    if [ -n "$POD" ]; then
        echo "  Found pod: $POD"
        kubectl exec -it "$POD" -- bundle exec rails db:migrate
        echo "✅ Shopping lists service migrations complete"
    else
        echo "⚠️  No shopping-lists-service pod found. Skipping."
    fi
else
    echo "⚠️  Shopping lists service deployment not found. Skipping."
fi
echo ""

# ====================
# 4. AI Service
# ====================
echo "📝 Running migrations for ai-service..."
if kubectl get deployment ai-service &> /dev/null; then
    POD=$(kubectl get pod -l app=ai-service,component=server -o jsonpath="{.items[0].metadata.name}")
    if [ -n "$POD" ]; then
        echo "  Found pod: $POD"
        kubectl exec -it "$POD" -- bundle exec rails db:migrate
        echo "✅ AI service migrations complete"
    else
        echo "⚠️  No ai-service pod found. Skipping."
    fi
else
    echo "⚠️  AI service deployment not found. Skipping."
fi
echo ""

# ====================
# Summary
# ====================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All Migrations Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Optional: Create initial test data"
echo ""
echo "To create a test user in auth-service:"
echo "  kubectl exec -it deployment/auth-service -- bundle exec rails runner \"User.create!(email: 'test@example.com', password: 'password')\""
echo ""
echo "To open Rails console:"
echo "  kubectl exec -it deployment/auth-service -- bundle exec rails console"
echo "  kubectl exec -it deployment/recipes-service -- bundle exec rails console"
echo "  kubectl exec -it deployment/shopping-lists-service -- bundle exec rails console"
echo "  kubectl exec -it deployment/ai-service -- bundle exec rails console"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
