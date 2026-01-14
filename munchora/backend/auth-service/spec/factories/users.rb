FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "securepass" }
    image_src { "https://example.com/avatar.png" }
    provider { "email" }
    uid { SecureRandom.uuid }
  end
end
