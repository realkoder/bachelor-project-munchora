class Api::V1::AuthController < ApplicationController
  require 'google-id-token'

  def google
    auth_url = Auth::GoogleAuthService.get_redirect_uri
    redirect_to auth_url, allow_other_host: true
  end

  def google_callback
    code = params[:code]

    user = Auth::GoogleAuthService.validate_code_and_get_user(code)

    token = Auth::JsonWebToken.encode(user_id: user.id)
    set_cookie(token)

    if Rails.env.production?
      redirect_to 'https://munchora.pro/home'
    else
      redirect_to 'http://localhost:5173/home'
    end
  end

  def me
    authenticate_user_or_nil

    if current_user
      render json: { user: current_user }
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = Auth::JsonWebToken.encode(user_id: user.id)
      set_cookie(token)

      render json: { user: user, token: token }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def logout
    cookies.delete(:jwt_auth, same_site: :lax)

    render json: { message: 'Logged out successfully' }, status: :ok
  end

  private

  def validate_with_google(id_token)
    uri = URI("https://oauth2.googleapis.com/tokeninfo?id_token=#{id_token}")
    response = Net::HTTP.get(uri)
    JSON.parse(response)
  rescue
    nil
  end

  def set_cookie(token)
    cookies[:jwt_auth] = {
      value: token,
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax,
      expires: 7.days.from_now
      # expires: 24.hours.from_now
    }
  end
end
