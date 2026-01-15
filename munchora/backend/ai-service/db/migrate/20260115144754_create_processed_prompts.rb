class CreateProcessedPrompts < ActiveRecord::Migration[8.0]
  def change
    create_table :processed_prompts do |t|
      t.string :correlation_id

      t.timestamps
    end

    add_index :processed_prompts, :correlation_id, unique: true
  end
end
