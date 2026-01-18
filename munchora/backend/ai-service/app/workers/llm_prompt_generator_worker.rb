require 'ostruct'

class LlmPromptGeneratorWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'prompt_generation', retry: 3

  def perform(message_payload)
    data = JSON.parse(message_payload)
    data = OpenStruct.new(data)

    correlation_id = data.correlation_id

    begin
      ProcessedPrompt.create!(correlation_id: correlation_id)
      user = OpenStruct.new(data.user)

      prompt_result = Llm::LlmService.prompt_llm(user, data.prompt, data.system_instruction, data.output_as_json)

      response = {
        correlation_id: correlation_id,
        status: 'completed',
        prompt_result: prompt_result,
        user: data.user,
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
end
