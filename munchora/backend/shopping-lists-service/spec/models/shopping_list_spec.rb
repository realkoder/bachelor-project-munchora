require 'rails_helper'

RSpec.describe ShoppingList, type: :model do
  describe 'validations' do
    let(:user) { create(:shopping_list_owner) }

    let(:valid_attributes) do
      {
        owner: user
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
        { name: 'n' * 25, is_valid: true }, # equivalence partition
        { name: 'n' * 49, is_valid: true }, # -1 char from valid lower boundary
        { name: 'n' * 50, is_valid: true }, # valid upper

        # Invalid name partition > 60
        { name: 'n' * 51, is_valid: false }, # +1 char
        { name: 'n' * 450, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { name: nil, is_valid: false },
        { name: 1, is_valid: true },
        { name: 123456, is_valid: true },
        { name: true, is_valid: true }
      ].each do |example|
        name = example[:name]
        size_or_datatype = name.is_a?(String) ? "length #{name.size}" : name.class

        it "#{example[:is_valid] ? 'accepts' : 'rejects'} name with #{size_or_datatype}" do
          list = ShoppingList.new(valid_attributes.merge(name: name))
          example[:is_valid] ? (expect(list).to be_valid) : (expect(list).to_not be_valid)
        end
      end
    end
  end
end
