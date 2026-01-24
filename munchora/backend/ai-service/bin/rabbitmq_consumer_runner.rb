#!/usr/bin/env ruby

require_relative "../config/environment"
require_relative "../lib/rabbitmq_consumer"

STDOUT.sync = true
puts "[RabbitMQ] consumer booting..."

RabbitmqConsumer.start

trap("TERM") { puts "[RabbitMQ] shutting down"; exit }
trap("INT")  { puts "[RabbitMQ] interrupted"; exit }

sleep