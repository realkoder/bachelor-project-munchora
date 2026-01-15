class CreateRecipes < ActiveRecord::Migration[8.0]
  def change
    create_table :recipes do |t|
      t.integer :user_id
      t.string :title
      t.text :description
      t.string :image_url
      t.json :instructions
      t.boolean :is_public, default: false
      t.json :cuisine
      t.string :difficulty
      t.json :tags
      t.integer :prep_time, default: 10
      t.integer :cook_time, default: 10
      t.integer :servings, default: 1

      t.timestamps
    end
  end
end
