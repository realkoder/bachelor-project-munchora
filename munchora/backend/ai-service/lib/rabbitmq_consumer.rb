class RabbitmqConsumer
  def self.start
    Rails.logger.info "Starting RabbitMQ consumer..."

    # Configure prefetch to control how many messages are consumed at once
    RABBITMQ_CHANNEL.prefetch(10) # Adjust based on your worker capacity

    AI_PROMPT_REQUEST_QUEUE.subscribe(block: true, manual_ack: true) do |delivery_info, properties, payload|
      begin
        utf8_payload = payload.force_encoding('UTF-8')

        # Enqueue to Sidekiq for async processing
        jid = LlmPromptGeneratorWorker.perform_async(utf8_payload)

        # Raise exception if worker fails so message wont be acknowledged
        raise "Sidekiq enqueue failed" unless jid

        # Acknowledge the message
        RABBITMQ_CHANNEL.ack(delivery_info.delivery_tag)
      rescue => e
        Rails.logger.error "Failed to process message: #{e.message}"
        # Reject and requeue
        RABBITMQ_CHANNEL.nack(delivery_info.delivery_tag, false, true)
      end
    end
  end
end
