require 'redis'

REDIS_CLIENT = Redis.new(
  url: ENV.fetch('UPSTASH_REDIS_URL', 'redis://localhost:6379/0'),
  ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
)

# Optional: Test connection
begin
  REDIS_CLIENT.ping
  Rails.logger.info "✓ Redis connected successfully"
rescue => e
  Rails.logger.error "✗ Redis connection failed: #{e.message}"
end
