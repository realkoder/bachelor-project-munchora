FactoryBot.define do
  factory :shopping_list_owner do
    first_name { "John" }
    last_name  { "Doe" }
    bio        { "Passionate home cook sharing simple recipes." }
    image_src  { "https://example.com/avatar.jpg" }
  end
end
