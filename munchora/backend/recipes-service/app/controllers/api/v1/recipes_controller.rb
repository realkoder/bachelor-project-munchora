class Api::V1::RecipesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :authenticate_user_or_nil, only: [:index, :show]
  before_action :set_recipe, only: [:show, :update, :destroy, :add_comment, :add_like, :delete_comment, :delete_like]
  before_action :set_comment, only: [:delete_comment]
  before_action :set_like, only: [:delete_like]

  ADMIN_EMAIL = 'alexanderbtcc@gmail.com'

  def index
    recipes =
      if current_user&.email == ADMIN_EMAIL
        Recipe.all
      elsif current_user
        Recipe.where('is_public = ? OR user_id = ?', true, current_user.id)
      else
        Recipe.where(is_public: true)
      end

    filters_applied = false

    if params[:cuisine].present?
      recipes = recipes.where(cuisine: params[:cuisine])
      filters_applied = true
    end

    if params[:difficulty].present?
      recipes = recipes.where(difficulty: params[:difficulty])
      filters_applied = true
    end

    if params[:tag].present?
      recipes = recipes.where('? = ANY(tags)', params[:tag])
      filters_applied = true
    end

    if params[:search].present?
      query = "%#{params[:search].downcase}%"
      recipes = recipes.where(
        'LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(cuisine) LIKE ?',
        query, query, query # Protecting against sql injections - using prepared statement
      )
      filters_applied = true
    end

    recipes = recipes.order(updated_at: :desc)

    paginated_recipes = recipes.page(params[:page]).per(params[:per_page] || 10)

    render json: {
      data: paginated_recipes.as_json(
        include: {
          ingredients: { only: [:id, :name, :category, :amount] },
          user: { only: [:image_src, :id] },
          recipe_likes: {},
          recipe_comments: {}
        }
      ),
      pagination: {
        current_page: paginated_recipes.current_page,
        total_pages: paginated_recipes.total_pages,
        total_count: paginated_recipes.total_count
      }
    }
  end

  def show
    if @recipe.is_public || current_user&.email == ADMIN_EMAIL || (current_user && @recipe.user_id == current_user.id)
      render json: @recipe.as_json(include: { ingredients: { only: [:id, :name, :category, :amount] }, user: { only: [:image_src, :id] } })
    else
      head :forbidden
    end
  end

  def update
    if @recipe.user_id != current_user.id && current_user&.email != ADMIN_EMAIL
      head :forbidden && return
    end

    Recipe.transaction do
      if recipe_params[:ingredients]
        # Remove old ingredients
        @recipe.ingredients.destroy_all

        # Build new ingredients
        recipe_params[:ingredients].each do |ingredient|
          @recipe.ingredients.build(
            name: ingredient[:name],
            category: ingredient[:category],
            amount: ingredient[:amount]
          )
        end
      end

      @recipe.update!(recipe_params.except(:ingredients))
    end

    render json: @recipe.as_json(
      include: {
        ingredients: { only: [:id, :name, :category, :amount] },
        user: { only: [:image_src, :id] }
      }
    )
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    if @recipe.user_id != current_user.id && current_user&.email != ADMIN_EMAIL
      head :forbidden && return
    end

    if @recipe.image_url.present?
      image_deleted = Recipes::RecipesService.delete_old_image(recipe: @recipe)
    else
      image_deleted = true
    end

    if image_deleted
      @recipe.destroy
      head :no_content
    else
      render json: { error: 'Failed to delete the recipes.' }, status: :unprocessable_entity
    end
  end

  def upload_image
    @recipe = Recipe.find(params[:id])
    return head :forbidden if @recipe.user_id != current_user.id && current_user&.email != ADMIN_EMAIL

    result = Recipes::RecipesService.call(recipe: @recipe, uploaded_file: params[:image], request: request)

    if result.success?
      render json: { image_url: result.public_url }
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  def delete_image
    @recipe = Recipe.find(params[:id])
    return head :forbidden if @recipe.user_id != current_user.id && current_user&.email != ADMIN_EMAIL

    image_deleted = Recipes::RecipesService.delete_old_image(recipe: @recipe)
    if image_deleted
      @recipe.update!(image_url: nil)
    end

    if image_deleted
      render json: { message: 'OK' }
    else
      render json: { error: image_deleted.error }, status: :unprocessable_entity
    end
  end

  def add_comment
    comment = @recipe.recipe_comments.new(comment_params)
    comment.user = current_user # assuming you have Devise or similar

    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete_comment
    unless @comment.user == current_user
      head :forbidden
      return
    end

    if @comment.destroy
      head :no_content
    else
      render json: { errors: 'Failed to delete comment' }, status: :unprocessable_entity
    end
  end

  def add_like
    like = @recipe.recipe_likes.find_or_initialize_by(user: current_user)

    if like.persisted?
      render json: { message: 'Already liked' }, status: :ok
    elsif like.save
      render json: like, status: :created
    else
      render json: { errors: like.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete_like
    unless @like.user == current_user
      head :forbidden
      return
    end

    if @like&.destroy
      head :no_content
    else
      render json: { errors: 'Failed to unlike' }, status: :unprocessable_entity
    end
  end

  private

  def set_recipe
    @recipe = Recipe.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    head :not_found
  end

  def recipe_params
    params.require(:recipe).permit(
      :title, :description, :cuisine,
      :is_public, :difficulty, :prep_time, :cook_time, :servings,
      instructions: [], ingredients: [:id, :name, :category, :amount], tags: []
    )
  end

  def set_comment
    @comment = @recipe.recipe_comments.find_by(id: params[:comment_id])
    unless @comment
      render json: { error: 'Comment not found' }, status: :not_found
    end
  end

  def set_like
    @like = @recipe.recipe_likes.find_by(user: current_user)
    unless @like
      render json: { error: 'Like  not found' }, status: :not_found
    end
  end

  def comment_params
    params.require(:comment).permit(:comment)
  end
end
