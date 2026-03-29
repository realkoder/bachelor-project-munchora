require_relative "../config/environment"

if Rails.env.test?
  return
end

require_relative "../lib/rabbitmq/ai_response_consumer"

STDOUT.sync = true
puts "[RabbitMQ] AI Response consumer booting..."

Rabbitmq::AiResponseConsumer.start

# Keep process alive and handle shutdown signals
trap("TERM") { puts "[RabbitMQ] shutting down"; exit }
trap("INT")  { puts "[RabbitMQ] interrupted"; exit }

sleep
