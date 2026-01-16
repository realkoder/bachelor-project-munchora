class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ErrorHandling

  attr_reader :current_user, :current_shopping_list_owner

  before_action :parse_json_request # ensures json content is valid and can be parsed

  if Rails.env.production?
    # More lenient 20 requests per minute for all other requests ===
    rate_limit to: 20,
               within: 1.minute,
               by: -> { request.domain },
               with: -> { redirect_to disney_url, alert: 'Too many requests. Please try again later.', allow_other_host: true }
  end

  # To be used as a fallback for unknown routes - directed from config/routes.rb
  def route_not_found
    head :not_found
  end

  def authenticate_user!
    token = cookies[:jwt_auth]
    # If no cookie, check for Bearer token in Authorization header
    if token.nil?
      auth_header = request.headers['Authorization']
      if auth_header.present? && auth_header.start_with?('Bearer ')
        token = auth_header.split(' ').last
      end
    end

    if token.nil?
      return render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    decoded_token = Auth::JsonWebToken.decode(token)
    @current_user = CurrentUser.from_jwt(decoded_token['user'])
    if @current_user.nil? || !@current_user.id
      return render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    unless @current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    @current_shopping_list_owner = ShoppingListOwner.find_or_initialize_by(auth_user_id: @current_user.id)

    if @current_shopping_list_owner.new_record?
      @current_shopping_list_owner.auth_user_id = @current_user.id
      @current_shopping_list_owner.first_name = @current_user.first_name
      @current_shopping_list_owner.last_name = @current_user.last_name
      @current_shopping_list_owner.image_src = @current_user.image_src
      @current_shopping_list_owner.bio = @current_user.bio
      @current_shopping_list_owner.save!
    end
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def authorize_admin!
    authenticate_user!
    unless current_user&.email == 'alexanderbtcc@gmail.com'
      head :unauthorized unless current_user&.email == 'alexanderbtcc@gmail.com'
    end
  end

  private

  def parse_json_request
    return unless request.content_type == 'application/json'

    begin
      # This forces Rails to parse JSON body early
      JSON.parse(request.raw_post) unless request.raw_post.blank?
    rescue JSON::ParserError => e
      render_error(400, 'Bad request', "Malformed JSON: #{e.message}") and return
    end
  end

  def disney_url
    'https://disney.com'
  end
end
