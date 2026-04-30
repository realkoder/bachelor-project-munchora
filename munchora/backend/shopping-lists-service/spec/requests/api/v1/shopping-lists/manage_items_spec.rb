require 'rails_helper'

RSpec.describe 'manage shopping list items', type: :request do
  let(:user) { build(:current_user, user_id: 1) }
  let(:owner) { create(:shopping_list_owner, id: 1, auth_user_id: 1) }
  let(:list) { create(:shopping_list, owner: owner) }
  let(:token) { 'fake.jwt.token' }

  let(:another_owner) { create(:shopping_list_owner, id: 2, auth_user_id: 2) }
  let!(:no_access_list) { create(:shopping_list, owner: another_owner) }

  before do
    allow(Auth::JsonWebToken).to receive(:decode)
      .with(token)
      .and_return({ 'user' => HashWithIndifferentAccess.new(user.attributes) })
  end

  describe 'as a user I want to manage shopping list items' do
    describe 'adding items' do
      it 'successfully adds a valid item' do
        cookies[:jwt_auth] = token
        expect(ShoppingLists::NotifyEvents).to receive(:item_added).with(list, instance_of(ShoppingListItem))

        post "/api/v1/shopping_lists/#{list.id}/add-item", params: { item: { name: 'Rugbrød', category: 'bakery 🥖' } }

        parsed_item = JSON.parse(response.body, symbolize_names: true)
        expect(response).to have_http_status(:created)
        expect(parsed_item[:name]).to eq('Rugbrød')
        expect(parsed_item[:is_completed]).to be_falsy
      end

      it 'adds a valid item to a shared list' do
        no_access_list.shared_users << owner
        cookies[:jwt_auth] = token
        expect(ShoppingLists::NotifyEvents).to receive(:item_added).with(no_access_list, instance_of(ShoppingListItem))

        post "/api/v1/shopping_lists/#{no_access_list.id}/add-item", params: { item: { name: 'Rugbrød', category: 'bakery 🥖' } }

        parsed_item = JSON.parse(response.body, symbolize_names: true)
        expect(response).to have_http_status(:created)
        expect(parsed_item[:name]).to eq('Rugbrød')
      end

      it 'fails with invalid data' do
        cookies[:jwt_auth] = token
        post "/api/v1/shopping_lists/#{list.id}/add-item", params: { item: { name: '' } }

        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'fails with invalid item category' do
        cookies[:jwt_auth] = token
        post "/api/v1/shopping_lists/#{list.id}/add-item", params: { item: { name: '', category: 'Unknown' } }

        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'fails when someone else shopping list' do
        cookies[:jwt_auth] = token
        post "/api/v1/shopping_lists/#{no_access_list.id}/add-item", params: { item: { name: 'Rugbrød', category: 'bakery 🥖' } }

        expect(response).to have_http_status(:forbidden)
      end

      it 'requires authentication' do
        post "/api/v1/shopping_lists/#{list.id}/add-item", params: { shopping_list: { name: 'Test' } }

        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe 'updating items' do
      let(:item) { create(:shopping_list_item, shopping_list: list) }
      let(:no_access_item) { create(:shopping_list_item, shopping_list: no_access_list) }

      it 'updates item name' do
        expect(ShoppingLists::NotifyEvents).to receive(:item_updated).with(list, instance_of(ShoppingListItem))
        cookies[:jwt_auth] = token

        patch "/api/v1/shopping_lists/#{list.id}/update-item/#{item.id}", params: { name: 'Bread' }

        expect(response).to have_http_status(:ok)
        parsed_updated_item = JSON.parse(response.body, symbolize_names: true)
        expect(parsed_updated_item[:name]).to eq('Bread')
      end

      it 'marks item complete' do
        expect(ShoppingLists::NotifyEvents).to receive(:item_updated).with(list, instance_of(ShoppingListItem))

        cookies[:jwt_auth] = token
        patch "/api/v1/shopping_lists/#{list.id}/update-item/#{item.id}", params: { is_completed: true }

        expect(response).to have_http_status(:ok)
        parsed_updated_item = JSON.parse(response.body, symbolize_names: true)
        expect(parsed_updated_item[:is_completed]).to eq(true)
      end

      it 'prevents updating item within non-shared list' do
        cookies[:jwt_auth] = token
        patch "/api/v1/shopping_lists/#{no_access_list.id}/update-item/#{no_access_item.id}", params: { name: 'Reject' }

        expect(response).to have_http_status(:forbidden)
      end

      it 'prevents unauthorized updates' do
        patch "/api/v1/shopping_lists/#{list.id}/update-item/#{item.id}", params: { name: 'Hack' }

        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe 'removing items' do
      let!(:item) { create(:shopping_list_item, shopping_list: list) }
      let!(:no_access_item) { create(:shopping_list_item, shopping_list: no_access_list) }

      it 'removes item' do
        expect(ShoppingLists::NotifyEvents).to receive(:item_removed).with(list, item.id.to_s)

        cookies[:jwt_auth] = token
        delete "/api/v1/shopping_lists/#{list.id}/remove-item/#{item.id}"

        expect(response).to have_http_status(:no_content)
      end

      it 'does nothing for non-existent item' do
        cookies[:jwt_auth] = token
        delete "/api/v1/shopping_lists/#{list.id}/remove-item/999999"

        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'prevents removing item from non-shared list' do
        cookies[:jwt_auth] = token
        delete "/api/v1/shopping_lists/#{no_access_list.id}/remove-item/#{no_access_item.id}"

        expect(response).to have_http_status(:forbidden)
      end

      it 'requires authentication' do
        delete "/api/v1/shopping_lists/#{list.id}/remove-item/999999"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
