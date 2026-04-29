require 'rails_helper'

RSpec.describe "Manage shopping lists", type: :request do
  let(:user) { build(:current_user, user_id: 1) }
  let(:token) { "fake.jwt.token" }

  before do
    allow(Auth::JsonWebToken).to receive(:decode)
      .with(token)
      .and_return({ 'user' => HashWithIndifferentAccess.new(user.attributes) })
  end

  describe "As a user I want to manage my shopping lists" do

    describe "creating a shopping list" do
      it "creates a list with valid data" do
        cookies[:jwt_auth] = token
        post "/api/v1/shopping_lists", params: { shopping_list: { name: "House Essentials" } }

        expect(response).to have_http_status(:created)
        parsed_list = JSON.parse(response.body, symbolize_names: true)
        expect(parsed_list[:name]).to eq("House Essentials")
      end

      it "fails without required fields" do
        cookies[:jwt_auth] = token
        post "/api/v1/shopping_lists", params: { shopping_list: { name: "" } }

        expect(response).to have_http_status(:unprocessable_content)
      end

      it "requires authentication" do
        post "/api/v1/shopping_lists", params: { shopping_list: { name: "Test" } }

        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe "deleting a shopping list" do
      let(:owner) { create(:shopping_list_owner, id: 1, auth_user_id: 1) }
      let!(:list) { create(:shopping_list, owner: owner) }

      let(:another_owner) { create(:shopping_list_owner, id: 2, auth_user_id: 2) }
      let!(:non_owner_list) { create(:shopping_list, owner: another_owner) }

      it "allows owner to delete" do
        expect(ShoppingLists::NotifyEvents).to receive(:list_deleted).with(list)

        cookies[:jwt_auth] = token
        delete "/api/v1/shopping_lists/#{list.id}"

        expect(response).to have_http_status(:no_content)
      end

      it "removes list from index" do
        cookies[:jwt_auth] = token
        delete "/api/v1/shopping_lists/#{list.id}"

        get "/api/v1/shopping_lists"

        parsed_lists = JSON.parse(response.body, symbolize_names: true)
        expect(parsed_lists.map { |l| l["id"] }).not_to include(list.id)
      end

      it "rejects non owners from deleting list but will unshare" do
        non_owner_list.shared_users << owner

        expect(ShoppingLists::NotifyEvents).to receive(:unshare_list).with(non_owner_list, user.id)
        expect(ShoppingLists::Sharer).to receive(:unshare).with(non_owner_list, user.id)

        cookies[:jwt_auth] = token
        delete "/api/v1/shopping_lists/#{non_owner_list.id}"

        expect(response).to have_http_status(:no_content)
      end

      it "prevents unauthorized deletion" do
        delete "/api/v1/shopping_lists/#{list.id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
