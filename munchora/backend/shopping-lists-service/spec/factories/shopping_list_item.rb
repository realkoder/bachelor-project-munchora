FactoryBot.define do
  factory :shopping_list_item do
    association :shopping_list
    name { 'Item' }
    category { 'fish 🐟' }
  end
end
