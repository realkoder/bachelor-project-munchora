class CreateShoppingListShares < ActiveRecord::Migration[8.0]
  def change
    create_table :shopping_list_shares do |t|
      t.references :shopping_list, null: false, foreign_key: true
      t.references :shopping_list_owner, null: false, foreign_key: true

      t.timestamps
    end

    add_index :shopping_list_shares, [:shopping_list_id, :shopping_list_owner_id], unique: true
  end
end
