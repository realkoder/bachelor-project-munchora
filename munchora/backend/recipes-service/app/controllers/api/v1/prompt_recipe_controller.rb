class Api::V1::PromptRecipeController < ApplicationController
  before_action :set_recipe, only: [:update]
  before_action :authenticate_user!

  MAX_PROMPT_LENGTH = 2000

  def generate
    user_prompt = params[:prompt].to_s[0...MAX_PROMPT_LENGTH]

    correlation_id = Prompt::RecipeRequest.request_recipe(user_prompt, @current_user)

    render json: {
      correlation_id: correlation_id,
      status: 'processing',
      message: 'Recipe generation started'
    }, status: :accepted
  end

  def update
    render json: { msg: 'IMPLEMENT ME' }
  end

  private

  def set_recipe
    @recipe = Recipe.includes(:ingredients).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Recipe not found' }, status: :not_found
  end
end
