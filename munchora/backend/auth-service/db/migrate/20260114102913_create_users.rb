class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :provider
      t.string :uid
      t.string :password_digest
      t.string :image_src
      t.string :bio
      t.datetime :last_signed_in_at

      t.timestamps
    end
  end
end
