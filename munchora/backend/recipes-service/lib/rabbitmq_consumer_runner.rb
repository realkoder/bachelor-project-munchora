require_relative "../config/environment"

if Rails.env.test?
  puts "[RabbitMQ] Skipping consumer in test environment"
  return
end

require_relative "rabbitmq/ai_response_consumer"

STDOUT.sync = true
puts "[RabbitMQ] AI Response consumer booting..."

AiResponseConsumer.start

# Keep process alive and handle shutdown signals
trap("TERM") { puts "[RabbitMQ] shutting down"; exit }
trap("INT")  { puts "[RabbitMQ] interrupted"; exit }

sleep
