class CurrentUser
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :user_id, :integer
  attribute :email, :string
  attribute :first_name, :string
  attribute :last_name, :string
  attribute :image_src, :string
  attribute :provider, :string
  attribute :uid, :string
  attribute :bio, :string
  attribute :last_signed_in_at, :datetime
  attribute :created_at, :datetime
  attribute :updated_at, :datetime

  # Initialize from JWT payload
  def self.from_jwt(payload)
    new(payload)
  end

  # Convenience methods
  def full_name
    "#{first_name} #{last_name}".strip
  end

  def id
    user_id
  end
end
