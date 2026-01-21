require "bunny"
require "json"

class NotificationEmitter
  EXCHANGE_NAME = 'notifications'
  QUEUE_NAME = 'notification_queue'
  ROUTING_KEY = 'notification.created'

  def initialize
    @connection = Bunny.new(
      host: ENV.fetch('RABBITMQ_HOST', 'localhost'),
      port: ENV.fetch('RABBITMQ_PORT', 5672),
      user: ENV.fetch('RABBITMQ_USER', 'guest'),
      pass: ENV.fetch('RABBITMQ_PASSWORD', 'guest'),
      vhost: ENV.fetch('RABBITMQ_VHOST', '/'),
      automatically_recover: true,
      network_recovery_interval: 5
    )

    @channel = nil
    @queue = nil
    @consumer = nil
  end

  def start
    Rails.logger.info "Starting RabbitMQ service..."

    @connection.start
    @channel = @connection.create_channel
    @channel.prefetch(10) # Process 10 messages at a time

    # Declare exchange
    exchange = @channel.topic(EXCHANGE_NAME, durable: true)

    # Declare queue
    @queue = @channel.queue(QUEUE_NAME, durable: true)

    # Bind queue to exchange
    @queue.bind(exchange, routing_key: ROUTING_KEY)

    Rails.logger.info "Connected to RabbitMQ. Listening on queue: #{QUEUE_NAME}"

    # Start consuming messages
    subscribe_to_notifications
  end

  def stop
    Rails.logger.info "Stopping RabbitMQ service..."
    @consumer&.cancel
    @channel&.close
    @connection&.close
    Rails.logger.info "RabbitMQ connection closed"
  end

  private

  def subscribe_to_notifications
    @consumer = @queue.subscribe(manual_ack: true, block: false) do |delivery_info, metadata, payload|
      begin
        process_notification(payload)
        @channel.ack(delivery_info.delivery_tag)
        Rails.logger.info "Message acknowledged: #{delivery_info.delivery_tag}"
      rescue StandardError => e
        Rails.logger.error "Error processing notification: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")

        # Reject and requeue on error (or send to dead letter queue)
        @channel.nack(delivery_info.delivery_tag, false, false)
      end
    end
  end

  def process_notification(payload)
    notification_data = parse_payload(payload)

    Rails.logger.info "Processing notification: #{notification_data.inspect}"

    # Validate notification structure
    unless valid_notification?(notification_data)
      Rails.logger.error "Invalid notification format: #{notification_data}"
      return
    end

    # Broadcast to each receiver
    broadcast_to_users(notification_data)
  end

  def parse_payload(payload)
    Oj.load(payload, symbol_keys: true)
  rescue Oj::ParseError => e
    Rails.logger.error "JSON parsing error: #{e.message}"
    {}
  end

  def valid_notification?(data)
    data.is_a?(Hash) &&
      data[:receivers].is_a?(Array) &&
      data[:receivers].any? &&
      data[:data].is_a?(Hash) &&
      data[:timestamp].present?
  end

  def broadcast_to_users(notification_data)
    receivers = notification_data[:receivers]

    receivers.each do |user_id|
      begin
        # Broadcast to the user's notification channel
        NotificationChannel.broadcast_to(
          user_id,
          {
            type: notification_data[:type] || 'notification',
            data: notification_data[:data],
            timestamp: notification_data[:timestamp],
            id: notification_data[:id] || SecureRandom.uuid
          }
        )

        Rails.logger.info "Notification sent to user #{user_id}"
      rescue StandardError => e
        Rails.logger.error "Failed to broadcast to user #{user_id}: #{e.message}"
      end
    end
  end
end