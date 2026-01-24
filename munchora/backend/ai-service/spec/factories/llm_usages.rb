FactoryBot.define do
  factory :llm_usage do
    user_id { SecureRandom.uuid }
    provider { "openai" }
    model { 'gpt-4.1-mini' }
    prompt { "Test prompt" }
    prompt_tokens { 60 }
    completion_tokens { 500 }
  end
end
