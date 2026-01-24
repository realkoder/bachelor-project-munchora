require 'rails_helper'
require 'ostruct'

RSpec.describe "Api::V1::Llm", type: :request do
  let(:user) { build(:current_user) }
  let(:token) { "fake.jwt.token" }

  before do
    allow(Auth::JsonWebToken).to receive(:decode)
      .with(token)
      .and_return({ 'user' => HashWithIndifferentAccess.new(user.attributes) })
  end

  # ======================================
  # POST: GENERATE_RECIPE
  # ======================================
  context '#prompt' do
    let(:valid_prompt) { 'Something delicious!' }

    context 'positive tests' do
      before do
        allow(Llm::LlmService).to receive(:usage_limit_exceeded?).and_return(false)

        mock_response = OpenStruct.new(choices: [OpenStruct.new(message: OpenStruct.new(content: "Generated recipe text"))])
        allow(Llm::LlmService).to receive(:prompt_llm).with(anything, anything, anything, anything).and_return(mock_response)
      end

      it 'accepts authenticated requests' do
        cookies[:jwt_auth] = token
        post '/api/v1/prompt', params: { prompt: 'Something delicious', instructions: 'You are a chef!' }
        expect(response).to have_http_status(:ok)

        parsed_response = JSON.parse(response.body, symbolize_names: true)

        expect(parsed_response[:data]).to eq('Generated recipe text')
      end
    end

    context 'negative tests' do
      it 'rejects unauthenticated requests' do
        post '/api/v1/prompt', params: { prompt: 'Something delicious', instructions: 'You are a chef!' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
