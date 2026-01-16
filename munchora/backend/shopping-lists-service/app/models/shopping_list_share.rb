class ShoppingListShare < ApplicationRecord
  belongs_to :shopping_list
  belongs_to :shopping_list_owner

  validates :shopping_list_owner_id,
            uniqueness: { scope: :shopping_list_id }
end
