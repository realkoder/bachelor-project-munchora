class Auth::JsonWebToken
  PUBLIC_KEY = OpenSSL::PKey::RSA.new(
    Rails.application.credentials.jwt_public_key
  )

  def self.decode(token)
    decoded = JWT.decode(token, PUBLIC_KEY, true, algorithm: 'RS256')
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError
    nil
  end
end
