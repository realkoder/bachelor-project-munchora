require_relative "../config/environment"
require_relative "rabbitmq_consumer"

STDOUT.sync = true
puts "[RabbitMQ] consumer booting..."

RabbitmqConsumer.start

# Keep the process alive
trap("TERM") { puts "[RabbitMQ] shutting down"; exit }
trap("INT")  { puts "[RabbitMQ] interrupted"; exit }

sleep
