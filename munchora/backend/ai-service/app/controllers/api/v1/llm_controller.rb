class Api::V1::LlmController < ApplicationController
  before_action :set_recipe, only: [:generate_recipe_image, :update_recipe]
  before_action :authenticate_user!

  MAX_PROMPT_LENGTH = 2000

  def generate_recipe
    user_prompt = params[:prompt].to_s[0...MAX_PROMPT_LENGTH]

    recipe_data = Llm::LlmService.new(user: @current_user).generate_recipe(prompt: user_prompt)
    render json: recipe_data.as_json(include: { ingredients: { only: [:name, :category, :amount] }, user: { only: [:image_src, :id] } })

  rescue LlmUsageLimitExceeded => e
    render json: { error: e.message }, status: :too_many_requests

  rescue => e
    Rails.logger.error("chat_json error: #{e.message}")
    render json: { error: e.message }, status: :internal_server_error
  end

  def generate_recipe_image
    recipe_image_url = Llm::LlmImageService.new(user: @current_user).generate_recipe_image(recipe: @recipe, request: request)
    render json: { image_url: recipe_image_url }

  rescue LlmUsageLimitExceeded => e
    render json: { error: e.message }, status: :too_many_requests

  rescue => e
    Rails.logger.error("chat_json error: #{e.message}")
    render json: { error: e.message }, status: :internal_server_error
  end

  # PUT /api/v1/update-recipe/:id
  def update_recipe
    user_prompt = params[:prompt].to_s[0...MAX_PROMPT_LENGTH]

    recipe_data = Llm::LlmService.new(user: @current_user).update_recipe(prompt: user_prompt, recipe: @recipe)

    render json: recipe_data.as_json(include: { ingredients: { only: [:name, :category, :amount] }, user: { only: [:image_src, :id] } })

  rescue => e
    Rails.logger.error("chat_json error: #{e.message}")
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def set_recipe
    @recipe = Recipe.includes(:ingredients).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Recipe not found' }, status: :not_found
  end
end
