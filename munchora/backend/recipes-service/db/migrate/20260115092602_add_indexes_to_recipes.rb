class AddIndexesToRecipes < ActiveRecord::Migration[8.0]
  def change
    add_index :recipes, :user_id
    add_index :recipes, [:user_id, :is_public]
  end
end
