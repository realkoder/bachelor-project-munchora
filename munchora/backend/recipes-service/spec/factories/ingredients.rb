FactoryBot.define do
  factory :ingredient do
    name { Faker::Food.ingredient }
    category {
      [
        'condiments 🧂',
        'dairy 🥚',
        'fish 🐟',
        'frozen foods ❄️',
        'fruits 🍎',
        'grains 🌾',
        'meat 🍗',
        'no category 📦',
        'pasta & rice 🍝',
        'personal care 🧴',
        'snacks 🍫',
        'spices & herbs 🌶️',
        'vegetables 🥦',
        'sauces & oils 🫙'
      ].sample
    }
    amount { Faker::Number.between(from: 1, to: 500) }

    association :recipe
  end
end
