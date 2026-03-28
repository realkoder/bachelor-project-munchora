require 'rails_helper'

RSpec.describe Api::V1::AuthController, type: :request do
  let(:user) { create(:user, password: 'securepass') }
  let(:token) { Auth::JsonWebToken.encode_user(user) }

  describe 'POST /api/v1/auth/login' do
    context 'with valid credentials' do
      it 'logs in the user and sets a cookie' do
        post '/api/v1/auth/login', params: { email: user.email, password: 'securepass' }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['user']['id']).to eq(user.id)
        expect(response.cookies['jwt_auth']).to be_present
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized' do
        post '/api/v1/auth/login', params: { email: user.email, password: 'wrongpass' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/auth/me' do
    context 'with valid JWT cookie' do
      it 'returns current user' do
        cookies[:jwt_auth] = token
        get '/api/v1/auth/me'
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['user']['id']).to eq(user.id)
      end
    end

    context 'with invalid JWT' do
      it 'returns unauthorized' do
        cookies[:jwt_auth] = 'invalid.token'
        get '/api/v1/auth/me'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/v1/auth/logout' do
    it 'clears the jwt_auth cookie' do
      cookies[:jwt_auth] = token
      delete '/api/v1/auth/logout'
      expect(response).to have_http_status(:ok)
      expect(response.cookies['jwt_auth']).to be_nil.or eq('')
    end
  end
end
