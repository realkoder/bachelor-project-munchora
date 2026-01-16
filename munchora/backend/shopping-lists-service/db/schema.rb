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

ActiveRecord::Schema[8.0].define(version: 2026_01_16_201822) do
  create_table "shopping_list_items", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "category"
    t.boolean "is_completed", default: false
    t.bigint "shopping_list_id", null: false
    t.bigint "added_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["added_by_id"], name: "index_shopping_list_items_on_added_by_id"
    t.index ["shopping_list_id"], name: "index_shopping_list_items_on_shopping_list_id"
  end

  create_table "shopping_list_owners", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "auth_user_id"
    t.string "first_name"
    t.string "last_name"
    t.string "image_src"
    t.string "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auth_user_id"], name: "index_shopping_list_owners_on_auth_user_id", unique: true
  end

  create_table "shopping_list_shares", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "shopping_list_id", null: false
    t.bigint "shopping_list_owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shopping_list_id", "shopping_list_owner_id"], name: "idx_on_shopping_list_id_shopping_list_owner_id_1fffc30665", unique: true
    t.index ["shopping_list_id"], name: "index_shopping_list_shares_on_shopping_list_id"
    t.index ["shopping_list_owner_id"], name: "index_shopping_list_shares_on_shopping_list_owner_id"
  end

  create_table "shopping_lists", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_shopping_lists_on_owner_id"
  end

  add_foreign_key "shopping_list_items", "shopping_list_owners", column: "added_by_id"
  add_foreign_key "shopping_list_items", "shopping_lists"
  add_foreign_key "shopping_list_shares", "shopping_list_owners"
  add_foreign_key "shopping_list_shares", "shopping_lists"
  add_foreign_key "shopping_lists", "shopping_list_owners", column: "owner_id"
end
