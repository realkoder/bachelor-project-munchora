class RecipeAuthor < ApplicationRecord
  has_many :recipes, dependent: :destroy

  validates :first_name, presence: true, length: { minimum: 2, maximum: 60 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 60 }
  validates :bio, presence: false, length: { maximum: 2000 }
  validates :image_src, length: { minimum: 14, maximum: 400 }, format: URI.regexp(%w[http https]), allow_blank: true
end
