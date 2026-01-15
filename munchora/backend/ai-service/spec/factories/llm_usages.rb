FactoryBot.define do
  factory :llm_usage do
    user_id { "MyString" }
    recipe_id { "MyString" }
    provider { "MyString" }
    model { "MyString" }
    prompt { "MyText" }
    prompt_tokens { 1 }
    completion_tokens { 1 }
  end
end
