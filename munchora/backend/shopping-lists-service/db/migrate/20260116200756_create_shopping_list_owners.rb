class CreateShoppingListOwners < ActiveRecord::Migration[8.0]
  def change
    create_table :shopping_list_owners do |t|
      t.integer :auth_user_id
      t.string :first_name
      t.string :last_name
      t.string :image_src
      t.string :bio

      t.timestamps
    end

    add_index :shopping_list_owners, :auth_user_id, unique: true
  end
end
