class ShoppingListItem < ApplicationRecord
  has_paper_trail

  belongs_to :shopping_list
  belongs_to :added_by, class_name: 'ShoppingListOwner', optional: true

  validates :name, presence: true, length: { maximum: 50 }
  validates :category, presence: true, inclusion: { in: GroceryCategories::CATEGORIES }
end
