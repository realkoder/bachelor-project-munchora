class CreateIngredients < ActiveRecord::Migration[8.0]
  def change
    create_table :ingredients do |t|
      t.string :name
      t.string :category
      t.integer :amount
      t.references :recipe, null: false, foreign_key: true

      t.timestamps
    end
  end
end
