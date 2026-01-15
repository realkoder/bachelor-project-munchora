# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_01_15_144754) do
  create_table "llm_usages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "user_id"
    t.string "provider"
    t.string "model"
    t.text "prompt"
    t.integer "prompt_tokens"
    t.integer "completion_tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "created_at"], name: "index_llm_usages_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_llm_usages_on_user_id"
  end

  create_table "processed_prompts", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "correlation_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["correlation_id"], name: "index_processed_prompts_on_correlation_id", unique: true
  end
end
