require 'rails_helper'

RSpec.describe "Api::V1::Llms", type: :request do
  describe "GET /generate_recipe" do
    it "returns http success" do
      get "/api/v1/llm/generate_recipe"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /generate_recipe_image" do
    it "returns http success" do
      get "/api/v1/llm/generate_recipe_image"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update_recipe" do
    it "returns http success" do
      get "/api/v1/llm/update_recipe"
      expect(response).to have_http_status(:success)
    end
  end

end
