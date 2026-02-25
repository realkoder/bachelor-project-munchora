# Kubernetes Deployment for Munchora Microservices

This directory contains Kubernetes manifests for deploying the Munchora microservices application on local minikube.

## Architecture

- **5 Rails API Services**: auth, recipes, shopping-lists, ai, notifications
- **4 MySQL Databases**: Separate StatefulSets for auth, recipes, shopping-lists, ai
- **RabbitMQ**: Message queue for inter-service communication
- **Frontend**: React Router 7 SSR application
- **Nginx Ingress**: Single entry point routing to all services

## Directory Structure

The k8s manifests are organized by component type for better maintainability:

```
k8s/
├── README.md                                  # This file
├── 02-secrets.yaml.template                   # Template for secrets
├── base/
│   └── configmaps/
│       └── global-config.yaml                 # Global configuration for all services
├── infrastructure/
│   ├── mysql/
│   │   ├── auth-mysql/
│   │   │   ├── service.yaml                   # Auth MySQL service
│   │   │   └── statefulset.yaml               # Auth MySQL StatefulSet
│   │   ├── recipes-mysql/
│   │   │   ├── service.yaml
│   │   │   └── statefulset.yaml
│   │   ├── shopping-lists-mysql/
│   │   │   ├── service.yaml
│   │   │   └── statefulset.yaml
│   │   └── ai-mysql/
│   │       ├── service.yaml
│   │       └── statefulset.yaml
│   └── rabbitmq/
│       ├── service.yaml                       # RabbitMQ AMQP + Management services
│       └── statefulset.yaml                   # RabbitMQ StatefulSet
├── services/
│   ├── auth-service/
│   │   ├── configmap.yaml                     # Service-specific configuration
│   │   ├── service.yaml                       # Kubernetes Service
│   │   └── deployment.yaml                    # Main server deployment
│   ├── recipes-service/
│   │   ├── configmap.yaml
│   │   ├── service.yaml
│   │   ├── server-deployment.yaml             # Main Rails server
│   │   └── consumer-deployment.yaml           # RabbitMQ consumer
│   ├── shopping-lists-service/
│   │   ├── configmap.yaml
│   │   ├── service.yaml
│   │   └── deployment.yaml
│   ├── ai-service/
│   │   ├── configmap.yaml
│   │   ├── service.yaml
│   │   └── _full.yaml                         # Combined deployments (server, consumer, sidekiq)
│   └── notifications-service/
│       ├── configmap.yaml
│       ├── service.yaml
│       └── _full.yaml                         # Combined deployments (server, consumer)
├── frontend/
│   ├── configmap.yaml                         # Frontend configuration
│   ├── service.yaml                           # Frontend service
│   └── _full.yaml                             # Frontend deployment
├── ingress/
│   └── _full.yaml                             # Nginx ConfigMap, Deployment, Service, Ingress
└── scripts/
    ├── create-secrets.sh                      # Create K8s secrets
    ├── apply-all.sh                           # Apply manifests in order
    ├── delete-all.sh                          # Clean up resources
    └── run-migrations.sh                      # Run DB migrations

Note: Files named `_full.yaml` contain multiple resources that should ideally be split into separate files (e.g., server-deployment.yaml, consumer-deployment.yaml). They work as-is but can be further organized.
```

## Prerequisites

1. **Install minikube**: https://minikube.sigs.k8s.io/docs/start/
2. **Install kubectl**: https://kubernetes.io/docs/tasks/tools/
3. **Docker**: Required by minikube

## Quick Start

### 1. Start Minikube

```bash
# Start minikube with sufficient resources
minikube start --cpus=4 --memory=8192

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server

# Verify cluster is running
kubectl cluster-info
```

### 2. Create Secrets

```bash
cd /Users/alexanderchristensen/Projects/software-udvikling/assignments/bachelor-project/munchora

# Run the secret creation script
./k8s/scripts/create-secrets.sh

# Verify secrets were created
kubectl get secrets
```

### 3. Deploy All Services

```bash
# Apply all manifests in order
./k8s/scripts/apply-all.sh

# Wait for all pods to be ready (may take 5-10 minutes)
kubectl get pods -w
```

### 4. Run Database Migrations

```bash
# Run migrations for all services with databases
./k8s/scripts/run-migrations.sh
```

### 5. Configure Local Access

```bash
# Get minikube IP
minikube ip

# Add to /etc/hosts (replace <MINIKUBE_IP> with actual IP)
echo "<MINIKUBE_IP> munchora.local" | sudo tee -a /etc/hosts

# Example:
# echo "192.168.49.2 munchora.local" | sudo tee -a /etc/hosts
```

### 6. Access the Application

```bash
# Open in browser
open http://munchora.local

# Test individual services
curl http://munchora.local/auth/health
curl http://munchora.local/recipes/health
curl http://munchora.local/ai/health
curl http://munchora.local/shopping-lists/health
curl http://munchora.local/notifications/health
```

## Development Workflow

### Viewing Logs

```bash
# View logs for a specific service
kubectl logs -f deployment/auth-service
kubectl logs -f deployment/recipes-service
kubectl logs -f deployment/ai-service

# View logs for RabbitMQ consumers
kubectl logs -f deployment/recipes-rabbitmq-consumer
kubectl logs -f deployment/ai-rabbitmq-consumer
kubectl logs -f deployment/notifications-rabbitmq-consumer

# View logs for Sidekiq worker
kubectl logs -f deployment/ai-sidekiq-worker

# View all logs for a specific service (including consumers)
kubectl logs -l app=recipes-service --all-containers=true -f
```

### Restarting Services

```bash
# Restart a deployment to pick up code changes
kubectl rollout restart deployment/auth-service

# Restart all deployments
kubectl rollout restart deployment --all

# Check rollout status
kubectl rollout status deployment/auth-service
```

### Accessing Services Directly

```bash
# Port forward to RabbitMQ management UI
kubectl port-forward svc/rabbitmq-management 15672:15672
# Open http://localhost:15672 (guest:guest)

# Port forward to MySQL databases
kubectl port-forward svc/auth-mysql-service 3308:3306
mysql -h 127.0.0.1 -P 3308 -u munchora -padmin auth_development

kubectl port-forward svc/recipes-mysql-service 3309:3306
mysql -h 127.0.0.1 -P 3309 -u munchora -padmin recipes_development

# Port forward to a specific service
kubectl port-forward svc/auth-service 3001:3000
curl http://localhost:3001/health
```

### Executing Commands in Pods

```bash
# Open a shell in a pod
kubectl exec -it deployment/auth-service -- bash

# Run Rails console
kubectl exec -it deployment/auth-service -- bundle exec rails console

# Run a one-off migration
kubectl exec -it deployment/recipes-service -- bundle exec rails db:migrate

# Create a user via Rails console
kubectl exec -it deployment/auth-service -- bundle exec rails runner "User.create!(email: 'test@example.com', password: 'password')"
```

### Debugging

```bash
# Check pod status
kubectl get pods

# Describe a pod to see events and errors
kubectl describe pod <pod-name>

# Check service endpoints
kubectl get endpoints

# Check ingress configuration
kubectl describe ingress munchora-ingress

# View all resources
kubectl get all

# Check persistent volume claims
kubectl get pvc

# Check configmaps and secrets
kubectl get configmaps
kubectl get secrets
```

### Database Management

```bash
# Create a database backup
kubectl exec deployment/auth-mysql -- mysqldump -u root -padmin auth_development > auth_backup.sql

# Restore a database backup
kubectl exec -i deployment/auth-mysql -- mysql -u root -padmin auth_development < auth_backup.sql

# Drop and recreate a database (WARNING: destroys data)
kubectl exec -it deployment/auth-service -- bundle exec rails db:drop db:create db:migrate
```

## Volume Mounts for Live Reload

All services have their source code mounted as hostPath volumes in minikube:

- **Backend services**: `/Users/alexanderchristensen/Projects/software-udvikling/assignments/bachelor-project/munchora/backend/<service>` → `/app`
- **Frontend**: `/Users/alexanderchristensen/Projects/software-udvikling/assignments/bachelor-project/munchora/client` → `/app`

Changes to code on your local machine will be reflected in the pods. However, you may need to restart the pod to pick up changes:

```bash
kubectl rollout restart deployment/<service-name>
```

For Rails services, consider using a file watcher or reloader in development mode.

## Scaling Services

```bash
# Scale a deployment
kubectl scale deployment/recipes-service --replicas=3

# Check replica status
kubectl get deployment recipes-service

# Auto-scale based on CPU (requires metrics-server)
kubectl autoscale deployment recipes-service --min=2 --max=5 --cpu-percent=80
```

## Clean Up

```bash
# Delete all resources using the helper script
./k8s/scripts/delete-all.sh

# Or manually delete by directory (in reverse order of application)
kubectl delete -f k8s/ingress/
kubectl delete -f k8s/frontend/
kubectl delete -f k8s/services/notifications-service/
kubectl delete -f k8s/services/ai-service/
kubectl delete -f k8s/services/shopping-lists-service/
kubectl delete -f k8s/services/recipes-service/
kubectl delete -f k8s/services/auth-service/
kubectl delete -f k8s/infrastructure/rabbitmq/
kubectl delete -f k8s/infrastructure/mysql/auth-mysql/
kubectl delete -f k8s/infrastructure/mysql/recipes-mysql/
kubectl delete -f k8s/infrastructure/mysql/shopping-lists-mysql/
kubectl delete -f k8s/infrastructure/mysql/ai-mysql/
kubectl delete -f k8s/base/configmaps/

# Delete secrets
kubectl delete secret jwt-keys mysql-credentials rabbitmq-credentials \
  auth-service-master-key recipes-service-master-key \
  shopping-lists-service-master-key ai-service-master-key \
  notifications-service-master-key google-oauth openai-credentials \
  upstash-redis resend-api

# Delete persistent volumes
kubectl delete pvc --all

# Stop minikube
minikube stop

# Delete minikube cluster (WARNING: destroys all data)
minikube delete
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status and events
kubectl get pods
kubectl describe pod <pod-name>

# Common issues:
# 1. Image pull errors - Check Dockerfile.dev exists
# 2. Missing secrets - Run ./k8s/scripts/create-secrets.sh
# 3. Database not ready - Wait for MySQL pods to be Ready
# 4. Volume mount errors - Ensure paths exist on host
```

### Database Connection Issues

```bash
# Verify MySQL pods are running
kubectl get pods -l app=mysql

# Check MySQL service endpoints
kubectl get endpoints | grep mysql

# Test connection from a service pod
kubectl exec -it deployment/auth-service -- bundle exec rails runner "puts ActiveRecord::Base.connection.execute('SELECT 1').to_a"

# Check database logs
kubectl logs deployment/auth-mysql
```

### RabbitMQ Connection Issues

```bash
# Check RabbitMQ is running
kubectl get pods -l app=rabbitmq

# Access RabbitMQ management UI
kubectl port-forward svc/rabbitmq-management 15672:15672
# Open http://localhost:15672 (guest:guest)

# Check queues and connections in management UI
# Verify service logs show RabbitMQ connection
kubectl logs deployment/recipes-rabbitmq-consumer | grep -i rabbitmq
```

### Ingress Not Working

```bash
# Check ingress addon is enabled
minikube addons list | grep ingress

# Enable if needed
minikube addons enable ingress

# Check ingress controller pods
kubectl get pods -n ingress-nginx

# Check ingress resource
kubectl describe ingress munchora-ingress

# Verify /etc/hosts entry
cat /etc/hosts | grep munchora.local

# Test with minikube IP directly
curl http://$(minikube ip)/auth/health -H "Host: munchora.local"
```

### Volume Mount Issues

```bash
# Verify minikube can access host filesystem
minikube ssh
ls /hosthome/alexanderchristensen/Projects/software-udvikling/assignments/bachelor-project/munchora

# If path not accessible, use minikube mount:
minikube mount /Users/alexanderchristensen/Projects/software-udvikling/assignments/bachelor-project/munchora:/munchora

# Update volume paths in manifests to use /munchora
```

### Rails Master Key Issues

```bash
# Verify master key secrets exist
kubectl get secret auth-service-master-key -o yaml
kubectl get secret recipes-service-master-key -o yaml

# Re-create secrets if needed
./k8s/scripts/create-secrets.sh

# Check service logs for credential errors
kubectl logs deployment/auth-service | grep -i credential
```

## Differences from Docker Compose

### Service Discovery
- **Docker Compose**: Service name as hostname (e.g., `auth-db`)
- **Kubernetes**: Service DNS (e.g., `auth-mysql-service` or `auth-mysql-service.default.svc.cluster.local`)

### Networking
- **Docker Compose**: Bridge network, port mapping
- **Kubernetes**: ClusterIP services, Ingress for external access

### Storage
- **Docker Compose**: Named volumes
- **Kubernetes**: PersistentVolumeClaims with StorageClass

### Secrets
- **Docker Compose**: .env files
- **Kubernetes**: Secret resources with base64 encoding

### Scaling
- **Docker Compose**: Limited scaling support
- **Kubernetes**: Full horizontal pod autoscaling

## Production Considerations

This configuration is optimized for local development with minikube. For production deployment:

1. **Replace hostPath volumes** with NFS, EFS, or cloud storage
2. **Add resource limits** appropriate for production workload
3. **Use production-grade ingress** (AWS ALB, GCP Load Balancer, etc.)
4. **Enable TLS** with cert-manager and Let's Encrypt
5. **Use managed databases** (RDS, Cloud SQL) instead of in-cluster MySQL
6. **Add health checks** to all deployments
7. **Configure horizontal pod autoscaling** based on metrics
8. **Use secrets management** (AWS Secrets Manager, Vault) instead of K8s secrets
9. **Add monitoring** (Prometheus, Grafana) and logging (ELK, Loki)
10. **Implement network policies** for service isolation

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Rails on Kubernetes Guide](https://kubernetes.io/blog/2019/07/23/get-started-with-kubernetes-using-python/)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
