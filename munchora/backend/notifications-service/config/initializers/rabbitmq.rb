require 'bunny'

RABBITMQ_CONNECTION = Bunny.new(
  host: ENV.fetch('RABBITMQ_HOST', 'rabbitmq'),
  port: ENV.fetch('RABBITMQ_PORT', 5672),
  user: ENV.fetch('RABBITMQ_USER', 'guest'),
  password: ENV.fetch('RABBITMQ_PASSWORD', 'guest')
)

RABBITMQ_CONNECTION.start

RABBITMQ_CHANNEL = RABBITMQ_CONNECTION.create_channel

# Define queues
NOTIFICATION_SERVICE_QUEUE = RABBITMQ_CHANNEL.queue('notification-service', durable: true)

# Graceful shutdown
at_exit do
  RABBITMQ_CHANNEL.close
  RABBITMQ_CONNECTION.close
end
