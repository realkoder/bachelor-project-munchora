class AddIndexesToUsers < ActiveRecord::Migration[8.0]
  def change
    add_index :users, [:provider, :uid], unique: true # Ensuring quick access for SSO
    add_index :users, :email, unique: true
  end
end
