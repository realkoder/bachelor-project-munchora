class Llm::LlmService

  DAILY_LIMIT = 10

  def self.prompt_llm(user, prompt, system_instruction, output_as_json)
    self.raise_limit_exceeded! if self.usage_limit_exceeded?(user.email, user.id)

    output = self.prompt_to_generate_output(prompt, system_instruction, output_as_json)

    self.log_usage(user.id, prompt, output.usage, output.model)
    output
  end

  private

  def self.usage_limit_exceeded?(user_email, user_id)
    if user_email == 'alexanderbtcc@gmail.com'
      return false
    end
    LlmUsage.where(user_id: user_id)
            .where('created_at >= ?', Time.current.beginning_of_day)
            .limit(DAILY_LIMIT + 1)
            .count > DAILY_LIMIT
  end

  def self.raise_limit_exceeded!
    raise LlmUsageLimitExceeded, "Daily AI usage limit (#{DAILY_LIMIT}) reached."
  end

  def self.prompt_to_generate_output(prompt, system_instruction, output_as_json = false)
    OpenAIClient.chat.completions.create(
      model: 'gpt-4.1-mini',
      response_format: output_as_json ? { type: 'json_object' } : nil,
      messages: [
        { role: 'system', content: system_instruction },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    )
  end

  def self.log_usage(user_id, prompt, usage, model)
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
