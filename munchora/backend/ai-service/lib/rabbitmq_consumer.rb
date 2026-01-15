class RabbitmqConsumer
  def self.start
    Thread.new do
      AI_PROMPT_REQUEST_QUEUE.subscribe(block: false, manual_ack: true) do |delivery_info, properties, payload|
        begin
          utf8_payload = payload.force_encoding('UTF-8')

          puts "RECEIVED!!"
          puts utf8_payload

          # Enqueue to Sidekiq for async processing
          LlmPromptGeneratorWorker.perform_async(utf8_payload)

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
end
