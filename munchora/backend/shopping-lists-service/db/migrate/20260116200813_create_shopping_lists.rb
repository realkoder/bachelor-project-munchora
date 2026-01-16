class CreateShoppingLists < ActiveRecord::Migration[8.0]
  def change
    create_table :shopping_lists do |t|
      t.string :name
      t.references :owner, null: false, foreign_key: { to_table: :shopping_list_owners }

      t.timestamps
    end
  end
end
