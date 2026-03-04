#!/bin/bash
set -e

# Script to apply all Kubernetes manifests in correct order from new structure
# Waits for dependencies to be ready before proceeding

echo "🚀 Deploying Munchora Microservices to Kubernetes..."
echo ""

# Navigate to k8s directory
cd "$(dirname "$0")/.."

# ====================
# 1. Apply Base ConfigMaps
# ====================
echo "📝 Applying base ConfigMaps..."
kubectl apply -f base/configmaps/
echo "✅ Base ConfigMaps applied"
echo ""

# ====================
# 2. Apply Service-Specific ConfigMaps
# ====================
echo "📝 Applying service ConfigMaps..."
kubectl apply -f services/auth-service/configmap.yaml
kubectl apply -f services/recipes-service/configmap.yaml
kubectl apply -f services/shopping-lists-service/configmap.yaml
kubectl apply -f services/ai-service/configmap.yaml
kubectl apply -f services/notifications-service/configmap.yaml
kubectl apply -f frontend/configmap.yaml
echo "✅ Service ConfigMaps applied"
echo ""

# ====================
# 3. Apply MySQL Databases
# ====================
echo "🗄️  Deploying MySQL databases..."
kubectl apply -f infrastructure/mysql/auth-mysql/
kubectl apply -f infrastructure/mysql/recipes-mysql/
kubectl apply -f infrastructure/mysql/shopping-lists-mysql/
kubectl apply -f infrastructure/mysql/ai-mysql/
echo "✅ MySQL StatefulSets created"
echo ""

echo "⏳ Waiting for MySQL pods to be ready (this may take a few minutes)..."
kubectl wait --for=condition=ready pod -l app=auth-mysql --timeout=300s
kubectl wait --for=condition=ready pod -l app=recipes-mysql --timeout=300s
kubectl wait --for=condition=ready pod -l app=shopping-lists-mysql --timeout=300s
kubectl wait --for=condition=ready pod -l app=ai-mysql --timeout=300s
echo "✅ All MySQL databases are ready"
echo ""

# ====================
# 4. Apply RabbitMQ
# ====================
echo "🐰 Deploying RabbitMQ..."
kubectl apply -f infrastructure/rabbitmq/
echo "✅ RabbitMQ StatefulSet created"
echo ""

echo "⏳ Waiting for RabbitMQ to be ready (this may take a few minutes)..."
kubectl wait --for=condition=ready pod -l app=rabbitmq --timeout=300s
echo "✅ RabbitMQ is ready"
echo ""

# ====================
# 5. Apply Backend Services
# ====================
echo "⚙️  Deploying backend services..."

echo "  📦 Deploying auth-service..."
kubectl apply -f services/auth-service/
sleep 5

echo "  📦 Deploying recipes-service..."
kubectl apply -f services/recipes-service/
sleep 5

echo "  📦 Deploying shopping-lists-service..."
kubectl apply -f services/shopping-lists-service/
sleep 5

echo "  📦 Deploying ai-service..."
kubectl apply -f services/ai-service/
#kubectl apply -f services/ai-service/configmap.yaml
#kubectl apply -f services/ai-service/rabbitmq-consumer-deployment.yaml
#kubectl apply -f services/ai-service/server-deployment.yaml
#kubectl apply -f services/ai-service/service.yaml
#kubectl apply -f services/ai-service/sidekiq-worker-deployment.yaml
sleep 5

echo "  📦 Deploying notifications-service..."
kubectl apply -f services/notifications-service/
sleep 5

echo "✅ Backend services deployed"
echo ""

echo "⏳ Waiting for backend services to be ready..."
kubectl wait --for=condition=ready pod -l app=auth-service --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=recipes-service,component=server --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=shopping-lists-service --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=ai-service,component=server --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=notifications-service,component=server --timeout=300s || true
echo "✅ Backend services are ready (or starting up)"
echo ""

# ====================
# 6. Apply Frontend
# ====================
echo "🎨 Deploying frontend..."
kubectl apply -f frontend/
echo "✅ Frontend deployed"
echo ""

# ====================
# 7. Apply Nginx Ingress
# ====================
echo "🌐 Deploying Nginx ingress..."
kubectl apply -f ingress/
kubectl apply -f newrelic/
echo "✅ Nginx ingress deployed"
echo ""

# ====================
# Summary
# ====================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Deployment Summary:"
kubectl get pods
echo ""
echo "🔗 Services:"
kubectl get svc
echo ""
echo "🌍 Ingress:"
kubectl get ingress
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Run database migrations:"
echo "   ./k8s/scripts/run-migrations.sh"
echo ""
echo "2. Add minikube IP to /etc/hosts:"
echo "   echo \"\$(minikube ip) munchora.local\" | sudo tee -a /etc/hosts"
echo ""
echo "3. Access the application:"
echo "   http://munchora.local"
echo ""
echo "4. Test individual services:"
echo "   curl http://munchora.local/auth/health"
echo "   curl http://munchora.local/recipes/health"
echo "   curl http://munchora.local/ai/health"
echo "   curl http://munchora.local/shopping-lists/health"
echo "   curl http://munchora.local/notifications/health"
echo ""
echo "5. Access RabbitMQ management UI:"
echo "   kubectl port-forward svc/rabbitmq-management 15672:15672"
echo "   Open http://localhost:15672 (guest:guest)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
