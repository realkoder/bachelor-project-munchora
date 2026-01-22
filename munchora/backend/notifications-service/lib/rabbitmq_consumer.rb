require 'ostruct'

class RabbitmqConsumer
  def self.start
    Rails.logger.info 'Starting RabbitMQ consumer...'

    # Configure prefetch to control how many messages are consumed at once
    RABBITMQ_CHANNEL.prefetch(10) # Adjust based on your worker capacity

    NOTIFICATION_SERVICE_QUEUE.subscribe(block: true, manual_ack: true) do |delivery_info, properties, payload|
      begin
        Rails.logger.info 'Received message from NOTIFICATION_SERVICE_QUEUE'
        utf8_payload = payload.force_encoding('UTF-8')
        parsed_payload = JSON.parse(utf8_payload)
        payload = OpenStruct.new(parsed_payload)

        payload.receivers.each do |hashed_user|
          begin
            user = OpenStruct.new(hashed_user)
            Rails.logger.info("LOOOK HERE NOW!! #{user.auth_user_id}")
            user_id = user.auth_user_id
            ActionCable.server.broadcast("notifications:#{user_id}", {
              type: payload.type,
              payload: payload.payload,
              created_at: payload.created_at
            })
          rescue => e
            Rails.logger.error("Failed to notify user #{user_id}: #{e.message}")
          end
        end

        # Acknowledge the message
        RABBITMQ_CHANNEL.ack(delivery_info.delivery_tag)
      rescue => e
        Rails.logger.error("Failed to process message: #{e.message}")
        # Reject and requeue
        RABBITMQ_CHANNEL.nack(delivery_info.delivery_tag, false, true)
      end
    end
  end
end
