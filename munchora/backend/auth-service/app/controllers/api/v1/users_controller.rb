class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:create]

  # GET /api/v1/users?q=<search>&page=<amount>&per_page=<amount>
  def index
    if params[:search].present? && params[:search].length > 120
      return render json: { error: 'Search query too long (max 120 characters)' }, status: :bad_request
    end

    result = Users::UsersSearchService.new(params).call

    render json: {
      data: result[:users],
      pagination: {
        current_page: result[:current_page],
        total_pages: result[:total_pages],
        total_count: result[:total_count]
      }
    }
  end

  # SQL injection example - payload to use: ?email=' OR 1=1 --'
  def search
    email = params[:email]

    users = User.where("email = '#{email}'")

    render json: users
  end

  def show
    render json: current_user
  end

  def create
    if params[:user].blank?
      return render_error(400, 'Bad request', 'user parameter is required')
    end

    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if current_user.update(user_update_params)
      render json: current_user
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.destroy
    if current_user.destroyed?
      render json: { msg: 'OK' }
    else
      render json: { msg: 'User could not be deleted' }, status: :unprocessable_entity
    end
  end

  def upload_image
    result = Users::UsersUploadsService.call(user: current_user, uploaded_file: params[:image], request: request)

    if result.success?
      render json: { image_url: result.public_url }
    else
      render json: { error: result.error }, status: :unprocessable_content
    end
  end

  def delete_image
    if current_user
      if current_user.image_src.present?
        Users::UsersUploadsService.delete_old_image(user: current_user)
        current_user.update(image_src: nil)
        render json: { message: 'OK' }, status: :ok
      else
        render json: { error: 'No image to delete.' }, status: :unprocessable_content
      end
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  private

  def user_update_params
    params.require(:user).permit(:first_name, :last_name, :bio)
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :bio, :password, :password_confirmation, :image_src, :provider, :uid)
  end
end
