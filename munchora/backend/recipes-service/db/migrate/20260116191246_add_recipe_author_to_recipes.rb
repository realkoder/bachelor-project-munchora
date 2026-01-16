class AddRecipeAuthorToRecipes < ActiveRecord::Migration[8.0]
  def change
    add_reference :recipes, :recipe_author, null: true, index: true
  end
end
