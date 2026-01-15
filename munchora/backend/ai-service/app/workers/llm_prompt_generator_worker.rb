class LlmPromptGeneratorWorker
  include Sidekiq::Worker

  DAILY_LIMIT = 10

  sidekiq_options queue: 'prompt_generation', retry: 3

  def perform(message_payload)
    data = JSON.parse(message_payload)
    correlation_id = data['correlation_id']

    begin
      ProcessedPrompt.create!(correlation_id: correlation_id)

      # Generate recipe using your AI service
      prompt_result = prompt_llm(data)

      response = {
        correlation_id: correlation_id,
        status: 'completed',
        prompt_result: prompt_result,
        user_id: data['user_id'],
        generated_at: Time.current.iso8601
      }.to_json

      # Publish response back
      RABBITMQ_CHANNEL.default_exchange.publish(
        response,
        routing_key: AI_PROMPT_RESPONSE_QUEUE.name,
        persistent: true,
        content_type: 'application/json',
        correlation_id: correlation_id
      )

    rescue => e
      error_response = {
        correlation_id: correlation_id,
        status: 'failed',
        error: e.message
      }.to_json

      RABBITMQ_CHANNEL.default_exchange.publish(
        error_response,
        routing_key: AI_PROMPT_RESPONSE_QUEUE.name,
        correlation_id: correlation_id
      )
    end
  end

  private

  def prompt_llm(data)
    raise_limit_exceeded! if usage_limit_exceeded?(data['user_email'], data['user_id'])

    output = prompt_to_generate_output(data['prompt'])

    log_usage(data['user_id'], data['prompt'], output.usage, output.model)
    output
  end

  def usage_limit_exceeded?(user_email, user_id)
    if user_email == 'alexanderbtcc@gmail.com'
      return false
    end
    LlmUsage.where(user_id: user_id)
            .where('created_at >= ?', Time.current.beginning_of_day)
            .limit(DAILY_LIMIT + 1)
            .count > DAILY_LIMIT
  end

  def raise_limit_exceeded!
    raise LlmUsageLimitExceeded, "Daily AI usage limit (#{DAILY_LIMIT}) reached."
  end

  def prompt_to_generate_output(prompt)
    OpenAIClient.chat.completions.create(
      model: 'gpt-4.1-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: Llm::RecipeLlmInstruction::SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    )
  end

  def log_usage(user_id, prompt, usage, model)
    return unless usage

    LlmUsage.create!(
      user_id: user_id,
      prompt: prompt,
      model: model,
      provider: 'openai',
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
    )
  end
end
