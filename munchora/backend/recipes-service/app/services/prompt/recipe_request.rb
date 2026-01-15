class Prompt::RecipeRequest
  def self.request_recipe(prompt, current_user)
    correlation_id = SecureRandom.uuid

    # Store request in Redis for correlation
    REDIS_CLIENT.setex(
      "ai_prompt_request:#{correlation_id}",
      300, # 5 minutes TTL
      { status: 'pending', prompt: prompt }.to_json
    )

    # Publish to RabbitMQ
    message = {
      correlation_id: correlation_id,
      user_id: current_user.id,
      user_email: current_user.email,
      system_instructions: Prompt::RecipeLlmInstruction::SYSTEM_PROMPT,
      prompt: prompt,
      timestamp: Time.current.iso8601
    }

    json_message = JSON.generate(message).force_encoding('UTF-8')

    RABBITMQ_CHANNEL.default_exchange.publish(
      json_message,
      routing_key: AI_PROMPT_REQUEST_QUEUE.name,
      persistent: true,
      content_type: 'application/json',
      reply_to: AI_PROMPT_RESPONSE_QUEUE.name,
      correlation_id: correlation_id
    )

    correlation_id
  end
end
