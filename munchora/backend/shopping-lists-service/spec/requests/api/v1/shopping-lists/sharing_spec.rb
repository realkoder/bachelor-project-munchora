require 'rails_helper'

RSpec.describe 'Share shopping lists', type: :request do
  let(:token) { 'fake.jwt.token' }

  let(:owner_user) { build(:current_user, user_id: 1) }
  let(:owner) { create(:shopping_list_owner, id: 1, auth_user_id: 1) }
  let(:collaborator) { create(:shopping_list_owner, id: 2, auth_user_id: 2) }
  let(:stranger) { create(:shopping_list_owner, id: 3, auth_user_id: 3) }

  let(:list) { create(:shopping_list, owner: owner) }

  let(:another_users_list) { create(:shopping_list, owner: collaborator) }

  before do
    allow(Auth::JsonWebToken).to receive(:decode)
      .with(token)
      .and_return({ 'user' => HashWithIndifferentAccess.new(owner_user.attributes) })
  end

  describe 'as a user I want to share a shopping list' do
    context 'with valid permissions' do
      it 'allows the owner to share the list with another user' do
        cookies[:jwt_auth] = token
        expect(ShoppingLists::NotifyEvents).to receive(:share_list).with(list)

        post "/api/v1/shopping_lists/#{list.id}/share", params: { user_ids: [collaborator.id] }

        expect(response).to have_http_status(:no_content)
        expect(list.reload.shared_users).to include(collaborator)
      end

      it 'allows sharing with multiple collaborators' do
        cookies[:jwt_auth] = token
        expect(ShoppingLists::NotifyEvents).to receive(:share_list).with(list)

        post "/api/v1/shopping_lists/#{list.id}/share", params: { user_ids: [collaborator.id, stranger.id] }

        expect(response).to have_http_status(:no_content)

        expect(list.reload.shared_users).to contain_exactly(collaborator, stranger)
      end
    end

    context 'when the user is not the owner' do
      it "does not allow sharing another user's list" do
        cookies[:jwt_auth] = token
        post "/api/v1/shopping_lists/#{another_users_list.id}/share", params: { user_ids: [stranger.id] }

        expect(response).to have_http_status(:forbidden)
        expect(another_users_list.reload.shared_users).not_to include(stranger)
      end
    end

    context 'when the request is invalid' do
      it 'returns unauthorized without authentication' do
        post "/api/v1/shopping_lists/#{list.id}/share", params: { user_ids: [collaborator.id] }

        expect(response).to have_http_status(:unauthorized)
      end

      it 'handles empty user_ids gracefully' do
        cookies[:jwt_auth] = token
        expect(ShoppingLists::NotifyEvents).to receive(:share_list).with(list)
        post "/api/v1/shopping_lists/#{list.id}/share", params: { user_ids: [] }

        expect(response).to have_http_status(:no_content)

        expect(list.reload.shared_users).to be_empty
      end

      it 'does not duplicate existing collaborators' do
        list.shared_users << collaborator
        cookies[:jwt_auth] = token
        expect(ShoppingLists::NotifyEvents).to receive(:share_list).with(list)

        post "/api/v1/shopping_lists/#{list.id}/share", params: { user_ids: [collaborator.id] }

        expect(response).to have_http_status(:no_content)
        expect(list.reload.shared_users.where(id: collaborator.id).count).to eq(1)
      end

      it 'returns not found for no existing shopping list' do
        cookies[:jwt_auth] = token

        post '/api/v1/shopping_lists/999999/share', params: { user_ids: [collaborator.id] }

        expect(response).to have_http_status(:not_found)
      end

      it 'ignores no existing collaborator ids safely' do
        cookies[:jwt_auth] = token
        expect(ShoppingLists::NotifyEvents).to receive(:share_list).with(list)

        post "/api/v1/shopping_lists/#{list.id}/share", params: { user_ids: [999999] }

        expect(response).to have_http_status(:no_content)

        expect(list.reload.shared_users).to be_empty
      end
    end
  end
end
