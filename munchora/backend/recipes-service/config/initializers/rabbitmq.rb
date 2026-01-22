require 'bunny'

unless Rails.env.test?
  RABBITMQ_CONNECTION = Bunny.new(
    host: ENV.fetch('RABBITMQ_HOST', 'rabbitmq'),
    port: ENV.fetch('RABBITMQ_PORT', 5672),
    user: ENV.fetch('RABBITMQ_USER', 'guest'),
    password: ENV.fetch('RABBITMQ_PASSWORD', 'guest')
  )

  RABBITMQ_CONNECTION.start

  RABBITMQ_CHANNEL = RABBITMQ_CONNECTION.create_channel

  # Define queues
  AI_PROMPT_RESPONSE_QUEUE = RABBITMQ_CHANNEL.queue('ai_prompt.responses', durable: true)
  AI_PROMPT_REQUEST_QUEUE = RABBITMQ_CHANNEL.queue('ai_prompt.requests', durable: true)
  NOTIFICATION_SERVICE_QUEUE = RABBITMQ_CHANNEL.queue('notification-service', durable: true)

  # Graceful shutdown
  at_exit do
    RABBITMQ_CHANNEL.close
    RABBITMQ_CONNECTION.close
  end
end
