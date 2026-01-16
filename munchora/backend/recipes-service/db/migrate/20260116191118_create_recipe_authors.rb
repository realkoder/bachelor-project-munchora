class CreateRecipeAuthors < ActiveRecord::Migration[8.0]
  def change
    create_table :recipe_authors do |t|
      t.integer :user_id
      t.string :first_name
      t.string :last_name
      t.string :image_src
      t.string :bio

      t.timestamps
    end

    add_index :recipe_authors, :user_id, unique: true
  end
end
