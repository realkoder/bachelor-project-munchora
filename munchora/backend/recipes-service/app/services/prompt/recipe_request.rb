class Prompt::RecipeRequest
  def self.request_recipe(prompt, current_user)
    correlation_id = SecureRandom.uuid

    user_context = {
      id: current_user.id,
      email: current_user.email,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      image_src: current_user.image_src,
      bio: current_user.bio
    }

    message = {
      correlation_id: correlation_id,
      user: user_context,
      system_instruction: Prompt::RecipeLlmInstruction::SYSTEM_PROMPT,
      prompt: prompt,
      output_as_json: true,
      timestamp: Time.current.iso8601
    }

    json_message = JSON.generate(message).force_encoding('UTF-8')

    # Publish to RabbitMQ
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
