require 'rails_helper'

RSpec.describe Ingredient, type: :model do
  describe 'validations' do
    let(:valid_attributes) do
      {
        name: 'test',
        amount: 1,
        category: 'fruits 🍎',
        recipe_id: create(:recipe).id
      }
    end

    # ======================================
    # NAME VALIDATIONS
    # ======================================
    context 'name', :name_context do
      [
        # Invalid name partition 0 - 1: lower boundary
        { name: '', is_valid: false },

        # Valid name partition 1-60
        { name: 'n', is_valid: true }, # valid lower
        { name: 'nn', is_valid: true }, # +1 char
        { name: 'n' * 30, is_valid: true }, # equivalence partition
        { name: 'n' * 59, is_valid: true }, # -1 char from valid lower boundary
        { name: 'n' * 60, is_valid: true }, # valid upper

        # Invalid name partition > 60
        { name: 'n' * 61, is_valid: false }, # +1 char
        { name: 'n' * 450, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { name: nil, is_valid: false },
        { name: 1, is_valid: true },
        { name: 123456, is_valid: true },
        { name: true, is_valid: true }
      ].each do |example|
        name = example[:name]
        size_or_datatype = name.is_a?(String) ? "length #{name.size}" : name.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid name with #{size_or_datatype}" do
          ingredient = Ingredient.new(valid_attributes.merge(name: name))
          example[:is_valid] ? (expect(ingredient).to be_valid) : (expect(ingredient).to_not be_valid)
        end
      end
    end

    # ==========================
    # AMOUNT VALIDATIONS
    # ==========================
    context 'amount', :amount_context do
      [
        # Invalid amount partition 0 - 1
        { amount: 0, is_valid: false },

        # Valid amount partition 1 - 9_999
        { amount: 1, is_valid: true }, # valid lower
        { amount: 2, is_valid: true }, # +1 from valid lower
        { amount: 5_098, is_valid: true }, # equivalence partition
        { amount: 9_998, is_valid: true }, # -1 from valid upper
        { amount: 9_999, is_valid: true }, # valid upper

        # Invalid amount partition > 9_999
        { amount: 10_000, is_valid: false }, # +1 valid upper
        { amount: 100_000, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { amount: nil, is_valid: false },
        { amount: '233', is_valid: true },
        { amount: '2_433', is_valid: true },
        { amount: "hey", is_valid: false },
        { amount: true, is_valid: false }
      ].each do |example|
        amount = example[:amount]
        size_or_datatype = amount.is_a?(Integer) ? "value: #{amount}" : amount.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid amount with #{size_or_datatype}" do
          ingredient = Ingredient.new(valid_attributes.merge(amount: amount))
          example[:is_valid] ? (expect(ingredient).to be_valid) : (expect(ingredient).to_not be_valid)
        end
      end
    end

    # ======================================
    # CATEGORY VALIDATIONS
    # ======================================
    context 'category', :category_context do
      [
        { category: 'dairy 🥚', is_valid: true },
        { category: 'fish 🐟', is_valid: true },

        # Edge cases: unexpected data type
        { category: nil, is_valid: false },
        { category: 'fish', is_valid: false },
        { category: 1, is_valid: false },
        { category: true, is_valid: false }
      ].each do |example|
        category = example[:category]
        it "#{example[:is_valid] ? 'accepts' : 'rejects'} valid category for value: #{category}" do
          ingredient = Ingredient.new(valid_attributes.merge(category: category))
          example[:is_valid] ? (expect(ingredient).to be_valid) : (expect(ingredient).to_not be_valid)
        end
      end
    end
  end
end
