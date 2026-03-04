# Kubernetes Deployment for Munchora Microservices

This directory contains Kubernetes manifests for deploying the Munchora microservices application on local minikube.

## Architecture

- **5 Rails API Services**: auth-service, recipes-service, shopping-lists-service, ai-service, notifications-service
- **4 MySQL Databases**: Separate StatefulSets for auth-service, recipes-service, shopping-lists-service, ai-service
- **RabbitMQ**: Message queue for inter-service communication
- **Frontend**: React Router 7 SSR application
- **Nginx Ingress**: Single entry point routing to all services and client

## Prerequisites

1. **Install minikube**: https://minikube.sigs.k8s.io/docs/start/
2. **Install kubectl**: https://kubernetes.io/docs/tasks/tools/
3. **Docker**: Required by minikube

## Quick Start

### 1. Start Minikube

```bash
# Start minikube with sufficient resources
minikube start --cpus=4 --memory=8192

# Install ingress-nginx with Helm
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  -f ingress/values.yaml

# Test metrics works from ingress-nginx-controller-metrics -> http://localhost:10254/metrics
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller-metrics 10254:10254

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
open http://localhost

# Test individual services
curl http://localhost/auth/health
curl http://localhost/recipes/health
curl http://localhost/ai/health
curl http://localhost/shopping-lists/health
curl http://localhost/notifications/health
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

## New Relic monitoring

Using New Relic monitoring Rails applicaitons, kubernetes cluster, client, databases and RabbitMQ

```bash
helm repo add newrelic https://helm-charts.newrelic.com

helm repo update

kubectl create namespace newrelic

# important LICENSE_KEY is added to newrelic/values.yaml execution
helm install newrelic-bundle newrelic/nri-bundle \
  --namespace newrelic \
  -f newrelic/values.yaml # important LICENSE_KEY is added to newrelic/values.yaml execution

# If need to install again run this: helm uninstall newrelic-bundle -n newrelic

# Verify it works properly by checking the logs  
kubectl logs -n newrelic -l app.kubernetes.io/name=nri-prometheus -f
```

### Setting up for Rails app

Add to Gemfile

```ruby
gem 'newrelic_rpm', '~> 10.2.0'
```

Then `bundle install`

Create `config/newrelic.yml` in your Rails app:

```yaml
common: &default_settings
  license_key: <%= ENV['NEW_RELIC_LICENSE_KEY'] %>
  app_name: <%= ENV['NEW_RELIC_APP_NAME'] %>
  log_level: info

  # APM
  distributed_tracing:
    enabled: true

  # Logs in context - ties logs to traces
  application_logging:
    enabled: true
    forwarding:
      enabled: true
      max_samples_stored: 10000
    local_decorating:
      enabled: false
    metrics:
      enabled: true

development:
  <<: *default_settings
  monitor_mode: true

test:
  <<: *default_settings
  monitor_mode: false

staging:
  <<: *default_settings
  monitor_mode: true
  app_name: <%= ENV['NEW_RELIC_APP_NAME'] %> (Staging)

production:
  <<: *default_settings
  monitor_mode: true
```

Add following to `config/environments/development`

```ruby
Rails.application.configure do
  # existing config...

  # Log to stdout for New Relic log forwarding
  config.logger = ActiveSupport::Logger.new($stdout)
  config.log_level = :info

  # Tag logs with request/trace IDs for NR log correlation
  config.log_tags = [:request_id]
end
```

Create `config/initializers/new_relic_logging.rb`

```ruby

if defined?(NewRelic)
  require 'new_relic/agent/logging'
end
```

Get the logs for the rails pod and ensure they contain a string like below - link provided for newrelic dashboard

```text
** [NewRelic][2026-03-04 21:25:09 +0000 ai-service-74c75cdb9-882g4 (1)] INFO : Reporting to: https://rpm.eu.newrelic.com/accounts/7768716/applications/389356952
```

<br>

---

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Rails on Kubernetes Guide](https://kubernetes.io/blog/2019/07/23/get-started-with-kubernetes-using-python/)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
