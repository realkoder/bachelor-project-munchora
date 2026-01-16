class ShoppingListOwner < ApplicationRecord
  has_many :shopping_lists, foreign_key: :owner_id, dependent: :destroy
  has_many :shopping_list_shares, dependent: :destroy
  has_many :shared_shopping_lists, through: :shopping_list_shares, source: :shopping_list

  validates :first_name, presence: true, length: { minimum: 2, maximum: 60 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 60 }
  validates :bio, presence: false, length: { maximum: 2000 }
  validates :image_src, length: { minimum: 14, maximum: 400 }, format: URI.regexp(%w[http https]), allow_blank: true
end
