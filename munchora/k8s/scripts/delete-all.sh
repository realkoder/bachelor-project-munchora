#!/bin/bash
set -e

# Script to delete all Kubernetes resources for Munchora
# WARNING: This will delete all resources including persistent volumes

echo "⚠️  WARNING: This will delete all Munchora resources from Kubernetes!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Deletion cancelled"
    exit 1
fi

echo "🗑️  Deleting Munchora Kubernetes resources..."
echo ""

# Navigate to k8s directory
cd "$(dirname "$0")/.."

# ====================
# Delete Ingress
# ====================
echo "🌐 Deleting Nginx ingress..."
kubectl delete -f ingress/ --ignore-not-found=true
echo "✅ Nginx ingress deleted"
echo ""

# ====================
# Delete Frontend
# ====================
echo "🎨 Deleting frontend..."
kubectl delete -f frontend/ --ignore-not-found=true
echo "✅ Frontend deleted"
echo ""

# ====================
# Delete Backend Services
# ====================
echo "⚙️  Deleting backend services..."
kubectl delete -f services/notifications-service/ --ignore-not-found=true
kubectl delete -f services/ai-service/ --ignore-not-found=true
kubectl delete -f services/shopping-lists-service/ --ignore-not-found=true
kubectl delete -f services/recipes-service/ --ignore-not-found=true
kubectl delete -f services/auth-service/ --ignore-not-found=true
echo "✅ Backend services deleted"
echo ""

# ====================
# Delete RabbitMQ
# ====================
echo ""
read -p "Do you also want to delete rabbitmq? (yes/no): " -r
echo ""

if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "🐰 Deleting RabbitMQ..."
    kubectl delete -f infrastructure/rabbitmq/ --ignore-not-found=true
    echo "✅ RabbitMQ deleted"
    echo ""
else
    echo "⏭️  Skipping rabbitmq deletion"
fi
# ====================
# Delete MySQL Databases
# ====================
echo ""
read -p "Do you also want to delete databases? (yes/no): " -r
echo ""

if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "🗄️  Deleting MySQL databases..."
    kubectl delete -f infrastructure/mysql/auth-mysql/ --ignore-not-found=true
    kubectl delete -f infrastructure/mysql/recipes-mysql/ --ignore-not-found=true
    kubectl delete -f infrastructure/mysql/shopping-lists-mysql/ --ignore-not-found=true
    kubectl delete -f infrastructure/mysql/ai-mysql/ --ignore-not-found=true
    echo "✅ MySQL databases deleted"
    echo ""
else
    echo "⏭️  Skipping databases deletion"
fi

echo ""

# ====================
# Delete ConfigMaps
# ====================
echo "📝 Deleting ConfigMaps..."
kubectl delete -f base/configmaps/ --ignore-not-found=true
kubectl delete configmap auth-service-config --ignore-not-found=true
kubectl delete configmap recipes-service-config --ignore-not-found=true
kubectl delete configmap shopping-lists-service-config --ignore-not-found=true
kubectl delete configmap ai-service-config --ignore-not-found=true
kubectl delete configmap notifications-service-config --ignore-not-found=true
kubectl delete configmap frontend-config --ignore-not-found=true
echo "✅ ConfigMaps deleted"
echo ""

# ====================
# Delete Secrets (Optional)
# ====================
echo ""
read -p "Do you also want to delete secrets? (yes/no): " -r
echo ""

if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "🔐 Deleting secrets..."
    kubectl delete secret newrelic-license --ignore-not-found=true
    kubectl delete secret mysql-credentials --ignore-not-found=true
    kubectl delete secret rabbitmq-credentials --ignore-not-found=true
    kubectl delete secret auth-service-master-key --ignore-not-found=true
    kubectl delete secret recipes-service-master-key --ignore-not-found=true
    kubectl delete secret shopping-lists-service-master-key --ignore-not-found=true
    kubectl delete secret ai-service-master-key --ignore-not-found=true
    kubectl delete secret notifications-service-master-key --ignore-not-found=true
    kubectl delete secret google-oauth --ignore-not-found=true
    kubectl delete secret openai-credentials --ignore-not-found=true
    kubectl delete secret upstash-redis --ignore-not-found=true
    kubectl delete secret resend-api --ignore-not-found=true
    echo "✅ Secrets deleted"
else
    echo "⏭️  Skipping secrets deletion"
fi
echo ""

# ====================
# Delete Persistent Volume Claims (Optional)
# ====================
echo ""
read -p "Do you want to delete persistent volume claims (this will delete all database data)? (yes/no): " -r
echo ""

if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "💾 Deleting persistent volume claims..."
    kubectl delete pvc -l app.kubernetes.io/part-of=munchora --ignore-not-found=true
    echo "✅ Persistent volume claims deleted"
else
    echo "⏭️  Skipping PVC deletion (data preserved)"
fi
echo ""

# ====================
# Summary
# ====================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deletion Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Remaining Resources:"
kubectl get all -l app.kubernetes.io/part-of=munchora
echo ""
echo "💾 Remaining PVCs:"
kubectl get pvc
echo ""
echo "🔐 Remaining Secrets:"
kubectl get secrets | grep -E "(jwt-keys|mysql-credentials|rabbitmq-credentials|master-key|google-oauth|openai-credentials|upstash-redis|resend-api)" || echo "No Munchora secrets found"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
