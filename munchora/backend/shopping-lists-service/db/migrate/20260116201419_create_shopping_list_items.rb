class CreateShoppingListItems < ActiveRecord::Migration[8.0]
  def change
    create_table :shopping_list_items do |t|
      t.string :name, null: false
      t.string :category
      t.boolean :is_completed, default: false
      t.references :shopping_list, null: false, foreign_key: true
      t.references :added_by, foreign_key: { to_table: :shopping_list_owners }

      t.timestamps
    end
  end
end
