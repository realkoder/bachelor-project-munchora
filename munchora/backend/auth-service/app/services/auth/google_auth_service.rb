class Auth::GoogleAuthService
  REDIRECT_URI =
    if ENV['RAILS_ENV'] == 'production'
      'https://munchora.pro/auth/api/v1/auth/google/callback'
    else
      'http://localhost:3000/auth/api/v1/auth/google/callback'
    end

  def self.get_redirect_uri
    client_id = ENV['GOOGLE_CLIENT_ID']

    scope = CGI.escape('email profile')

    'https://accounts.google.com/o/oauth2/v2/auth?' \
      "client_id=#{client_id}&" \
      "redirect_uri=#{REDIRECT_URI}&" \
      'response_type=code&' \
      "scope=#{scope}&" \
      'access_type=offline'
  end

  def self.validate_code_and_get_user(code)
    client_id = ENV['GOOGLE_CLIENT_ID']
    client_secret = ENV['GOOGLE_CLIENT_SECRET']

    # Exchange auth code for access + ID tokens
    uri = URI('https://oauth2.googleapis.com/token')
    res = Net::HTTP.post_form(uri, {
      'code' => code,
      'client_id' => client_id,
      'client_secret' => client_secret,
      'redirect_uri' => REDIRECT_URI,
      'grant_type' => 'authorization_code'
    })
    token_data = JSON.parse(res.body)
    access_token = token_data['access_token']

    # Decode ID token or fetch user info
    user_info = JSON.parse(Net::HTTP.get(
      URI("https://www.googleapis.com/oauth2/v2/userinfo?access_token=#{access_token}")
    ))

    user = User.find_or_initialize_by(email: user_info['email'])

    name_parts = user_info['name'].split(' ')
    first_name = name_parts[0]
    last_name = name_parts.size > 1 ? name_parts[1] : ''

    if user.new_record?
      user.provider = 'google'
      user.uid = user_info['id']
      user.first_name = first_name
      user.last_name = last_name
      user.email = user_info['email']
      user.image_src = user_info['picture']
      user.save!
    elsif user.uid.nil? || user.provider.nil?
      User.update!({ provider: 'google', uid: user_info['id'] })
    end
    user
  end
end
