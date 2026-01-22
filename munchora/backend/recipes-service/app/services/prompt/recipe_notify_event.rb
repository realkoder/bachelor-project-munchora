class Prompt::RecipeNotifyEvent
  def self.broadcast(recipients, type, payload)
    begin
      response = {
        "event_id": SecureRandom.uuid,
        "type": type,
        "receivers": recipients,
        "payload": payload,
        "created_at": DateTime.now
      }.to_json

      # Publish response back
      RABBITMQ_CHANNEL.default_exchange.publish(
        response,
        routing_key: NOTIFICATION_SERVICE_QUEUE.name,
        persistent: true,
        content_type: 'application/json',
      )

    rescue => e
      error_response = {
        status: 'failed',
        error: e.message
      }.to_json

      RABBITMQ_CHANNEL.default_exchange.publish(
        error_response,
        routing_key: NOTIFICATION_SERVICE_QUEUE.name
      )
    end
  end
end