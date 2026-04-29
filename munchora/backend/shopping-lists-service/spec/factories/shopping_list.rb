FactoryBot.define do
  factory :shopping_list do
    name { "Test List" }
    association :owner, factory: :shopping_list_owner
  end
end
