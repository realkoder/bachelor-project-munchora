class ShoppingList < ApplicationRecord
  has_paper_trail

  belongs_to :owner, class_name: 'ShoppingListOwner'

  has_many :items, class_name: 'ShoppingListItem', dependent: :destroy
  has_many :shopping_list_shares, dependent: :destroy
  has_many :shared_users, through: :shopping_list_shares, source: :shopping_list_owner

  validates :name, presence: true, length: { minimum: 1, maximum: 50 }
end
