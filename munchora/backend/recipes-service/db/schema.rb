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

ActiveRecord::Schema[8.0].define(version: 2026_01_16_191246) do
  create_table "ingredients", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.integer "amount"
    t.bigint "recipe_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recipe_id"], name: "index_ingredients_on_recipe_id"
  end

  create_table "recipe_authors", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "auth_user_id"
    t.string "first_name"
    t.string "last_name"
    t.string "image_src"
    t.string "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auth_user_id"], name: "index_recipe_authors_on_auth_user_id", unique: true
  end

  create_table "recipes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "image_url"
    t.json "instructions"
    t.boolean "is_public", default: false
    t.json "cuisine"
    t.string "difficulty"
    t.json "tags"
    t.integer "prep_time", default: 10
    t.integer "cook_time", default: 10
    t.integer "servings", default: 1
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "recipe_author_id"
    t.index ["recipe_author_id"], name: "index_recipes_on_recipe_author_id"
  end

  add_foreign_key "ingredients", "recipes"
end
