class User < ApplicationRecord
  validates :email, presence: true, length: { minimum: 6, maximum: 100 }, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }, if: -> { provider.blank? }

  validates :first_name, presence: true, length: { minimum: 2, maximum: 60 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 60 }
  validates :bio, presence: false, length: { maximum: 2000 }

  # If provider is present, uid must be present (for OAuth)
  validates :uid, presence: true, if: -> { provider.present? }, length: { maximum: 100 }
  validates :provider, presence: true, if: -> { uid.present? }, length: { maximum: 40 }
  validates :image_src, length: { minimum: 14, maximum: 400 }, format: URI.regexp(%w[http https]), allow_blank: true

  # For manual signup (no provider), password must be present on create
  def password=(unencrypted_password)
    # Only assign string values, otherwise nil
    if unencrypted_password.is_a?(String)
      super(unencrypted_password)
    else
      super(nil)
    end
  end

  has_secure_password validations: false
  validates :password, presence: true, length: { minimum: 6, maximum: 50 }, if: -> { provider.blank? }, on: :create

  def jwt_payload
    {
      user: {
        user_id: id,
        email: email,
        first_name: first_name,
        last_name: last_name,
        image_src: image_src,
        provider: provider,
        uid: uid,
        bio: bio,
        last_signed_in_at: last_signed_in_at,
        created_at: created_at,
        updated_at: updated_at
      }
    }
  end

  # Don't want to return password_digest when serializing
  def as_json(options = {})
    super({ except: [:email, :password_digest] }.merge(options)).merge(
      'fullname' => "#{first_name} #{last_name}", # client relies on attribute fullname instead of first_name / last_name
    )
  end
end
