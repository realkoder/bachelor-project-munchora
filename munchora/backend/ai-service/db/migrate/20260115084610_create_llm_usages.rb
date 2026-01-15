class CreateLlmUsages < ActiveRecord::Migration[8.0]
  def change
    create_table :llm_usages do |t|
      t.integer :user_id
      t.string :provider
      t.string :model
      t.text :prompt
      t.integer :prompt_tokens
      t.integer :completion_tokens

      t.timestamps
    end
  end
end
