class Auth::JsonWebToken
  PRIVATE_KEY = OpenSSL::PKey::RSA.new(
    Rails.application.credentials.jwt_private_key
  )

  PUBLIC_KEY = OpenSSL::PKey::RSA.new(
    Rails.application.credentials.jwt_public_key
  )

  def self.encode(payload, exp = 7.days.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, PRIVATE_KEY, 'RS256')
  end

  def self.decode(token)
    decoded = JWT.decode(token, PUBLIC_KEY, true, algorithm: 'RS256')
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError
    nil
  end
end
