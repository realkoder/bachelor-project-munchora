redis_url = ENV.fetch('UPSTASH_REDIS_URL', 'redis://redis:6379/1')

Sidekiq.configure_server do |config|
  config.redis = { url: redis_url }
end

Sidekiq.configure_client do |config|
  config.redis = { url: redis_url }
end
