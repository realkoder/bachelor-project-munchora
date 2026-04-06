require 'rails_helper'

RSpec.describe "Api::v1::ShoppingList", type: :request do
  describe "GET /index" do
    let(:sut_user) { create(:shopping_list_owner, auth_user_id: 1) }
    let(:other_user) { create(:shopping_list_owner) }

    let!(:owned_list) { create(:shopping_list, owner: sut_user, name: "Owned List") }
    let!(:shared_list) { create(:shopping_list, owner: other_user, name: "Shared List") }

    let!(:owned_item) { create(:shopping_list_item, shopping_list: owned_list, name: "Owned Item") }
    let!(:shared_item) { create(:shopping_list_item, shopping_list: shared_list, name: "Shared Item") }

    before do
      # Share the other_user's list with user
      shared_list.shared_users << sut_user
    end

    describe "when user is not authenticated" do
      it "rejects without auth token" do
        get "/api/v1/shopping_lists"

        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe "when user is authenticated" do
      let(:user) { build(:current_user, user_id: sut_user.auth_user_id) }
      let(:token) { "fake.jwt.token" }

      before do
        allow(Auth::JsonWebToken).to receive(:decode)
          .with(token)
          .and_return({ 'user' => HashWithIndifferentAccess.new(user.attributes) })
      end

      it "returns both owned and shared grocery lists" do
        cookies[:jwt_auth] = token
        get "/api/v1/shopping_lists"

        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        expect(json.length).to eq(2)

        owned_json = json.find { |l| l["id"] == owned_list.id }
        expect(owned_json["name"]).to eq("Owned List")
        expect(owned_json["items"].first["name"]).to eq("Owned Item")
        expect(owned_json["shared_users"]).to eq([])

        shared_json = json.find { |l| l["id"] == shared_list.id }
        expect(shared_json["name"]).to eq("Shared List")
        expect(shared_json["items"].first["name"]).to eq("Shared Item")
        expect(shared_json["shared_users"].first["id"]).to eq(sut_user.id)
      end
    end
  end
end
