require 'rails_helper'

# ===========================================================================================
# USER MODEL SPECIFICATION
# ===========================================================================================
# This spec implements comprehensive testing strategies combining:
# - BLACK-BOX TESTING: Testing without knowledge of internal implementation
# - WHITE-BOX TESTING: Testing with knowledge of internal code structure
#
# Using tags to make it easier to only run specific test:
#   - 'bundle exec rspec spec/models/user_spec.rb --format documentation --tag email_context'
# ===========================================================================================

RSpec.describe User, type: :model do
  describe 'validations' do
    let(:valid_attributes) do
      {
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        password: "secure123",
        provider: nil,
        uid: nil,
        bio: "Loves food.",
        image_src: "https://example.com/avatar.jpg"
      }
    end

    # ======================================
    # EMAIL VALIDATIONS
    # ======================================
    context 'email', :email_context do
      [
        # Invalid email partition 0 - 6: lower boundary
        { email: '', is_valid: false },
        { email: 't', is_valid: false }, # +1 char
        { email: 't.d', is_valid: false }, # equivalence partition
        { email: 'u@t.d', is_valid: false }, # -1 char from valid lower boundary

        # Valid email partition 6-100
        { email: 'u@t.dk', is_valid: true }, # valid lower
        { email: 'u1@t.dk', is_valid: true }, # +1 char
        { email: 'johnUser_232@test.dk', is_valid: true }, # equivalence partition
        { email: "#{'a' * 87}@example.com", is_valid: true }, # -1 char from valid upper
        { email: "#{'a' * 88}@example.com", is_valid: true }, # valid upper

        # Invalid email partition > 100
        { email: "#{'a' * 89}@example.com", is_valid: false }, # +1 char
        { email: "#{'a' * 450}@example.com", is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type, wrong email format
        { email: nil, is_valid: false },
        { email: 1, is_valid: false },
        { email: true, is_valid: false },
        { email: 'plainaddress', is_valid: false },
        { email: '@missinguser.com', is_valid: false },
        { email: 'user@.com', is_valid: false },
        { email: 'user@com,com', is_valid: false },
        { email: 'user@exa mple.com', is_valid: false }
      ].each do |example|
        email = example[:email]
        size_or_datatype = email.is_a?(String) ? "length #{email.size}" : email.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid email with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(email: email))
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end

    # ==========================
    # FIRST_NAME VALIDATIONS
    # ==========================
    context 'first_name', :first_name_context do
      [
        # Invalid first_name partition 0-2
        { first_name: '', is_valid: false }, # invalid lower
        { first_name: 'J', is_valid: false }, # +1 char

        # Valid first_name partition 2-60
        { first_name: 'Jo', is_valid: true }, # valid lower
        { first_name: 'Joe', is_valid: true }, # +1 char
        { first_name: 'Maximilian', is_valid: true }, # equivalence partition
        { first_name: 'A' * 59, is_valid: true }, # -1 char from valid upper
        { first_name: 'A' * 60, is_valid: true }, # valid upper

        # Invalid first_name partition < 60
        { first_name: 'A' * 61, is_valid: false }, # +1 char
        { first_name: 'A' * 200, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { first_name: nil, is_valid: false },
        { first_name: 1, is_valid: false },
        { first_name: true, is_valid: false }
      ].each do |example|
        first_name = example[:first_name]
        size_or_datatype = first_name.is_a?(String) ? "length #{first_name.size}" : first_name.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid first_name with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(first_name: example[:first_name]))
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end

    # ==========================
    # LAST_NAME VALIDATIONS
    # ==========================
    context 'last_name', :last_name_context do
      [
        # Invalid last_name partition 0-2
        { last_name: '', is_valid: false }, # invalid lower
        { last_name: 'O', is_valid: false }, # +1 char

        # Valid last_name partition 2-60
        { last_name: 'Li', is_valid: true }, # valid lower
        { last_name: 'Lee', is_valid: true }, # +1 char
        { last_name: 'Wolfeschlegelsteinhausenbergerdorff', is_valid: true }, # equivalence partition
        { last_name: 'A' * 59, is_valid: true }, # -1 char from valid upper
        { last_name: 'A' * 60, is_valid: true }, # valid upper

        # Invalid last_name partition > 60
        { last_name: 'A' * 61, is_valid: false }, # +1 char
        { last_name: 'A' * 200, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { last_name: nil, is_valid: false },
        { last_name: 1, is_valid: false },
        { last_name: 10, is_valid: true },
        { last_name: true, is_valid: false }
      ].each do |example|
        last_name = example[:last_name]
        size_or_datatype = last_name.is_a?(String) ? "length #{last_name.size}" : last_name.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid last_name with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(last_name: last_name))
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end

    # ======================================
    # BIO VALIDATIONS
    # ======================================
    context 'bio', :bio_context do
      [
        # Valid bio partition 0 - 2_000
        { bio: '', is_valid: true }, # valid lower
        { bio: 'A', is_valid: true }, # +1 char
        { bio: 'I like AI food' * 15, is_valid: true }, # equivalence partition
        { bio: 'a' * 1_999, is_valid: true }, # -1 char from valid upper
        { bio: 'a' * 2_000, is_valid: true }, # valid upper

        # Invalid bio partition > 2_000
        { bio: 'a' * 2_001, is_valid: false }, # +1 char
        { bio: 'I like AI food' * 500, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { bio: nil, is_valid: true },
        { bio: 1, is_valid: true },
        { bio: true, is_valid: true }
      ].each do |example|
        bio = example[:bio]
        size_or_datatype = bio.is_a?(String) ? "length #{bio.size}" : bio.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid bio with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(bio: bio))
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end

    # ======================================
    # UID VALIDATIONS
    # ======================================
    context 'uid', :uid_context do
      [
        # uid partition 0 - 100
        { uid: '', is_valid: false }, # invalid lower
        { uid: 'u', is_valid: true }, # +1 char
        { uid: 'xoheuif3qr3', is_valid: true }, # equivalence partition
        { uid: 'u' * 99, is_valid: true }, # -1 char from valid upper
        { uid: 'u' * 100, is_valid: true }, # valid upper

        # Invalid uid partition > 100
        { uid: 'u' * 101, is_valid: false }, # +1 char
        { uid: 'u' * 450, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { uid: nil, is_valid: false },
        { uid: 1, is_valid: true },
        { uid: true, is_valid: true }
      ].each do |example|
        uid = example[:uid]
        size_or_datatype = uid.is_a?(String) ? "length #{uid.size}" : uid.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid uid with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(uid: uid, provider: 'goggle')) # uid requires a provider
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end

    # ============================
    # PROVIDER VALIDATIONS
    # ============================
    context 'provider', :provider_context do
      [
        # provider partition 0 - 40
        { provider: '', is_valid: false }, # invalid lower
        { provider: 'a', is_valid: true }, # +1 char
        { provider: 'apple', is_valid: true }, # equivalence partition
        { provider: 'a' * 39, is_valid: true }, # -1 char from valid upper
        { provider: 'a' * 40, is_valid: true }, # valid upper

        # Invalid provider partition > 40
        { provider: 'a' * 41, is_valid: false }, # +1 char
        { provider: 'a' * 100, is_valid: false }, # Equivalence partition

        # Edge cases: unexpected data type
        { provider: nil, is_valid: false },
        { provider: 1, is_valid: true },
        { provider: true, is_valid: true }
      ].each do |example|
        provider = example[:provider]
        size_or_datatype = provider.is_a?(String) ? "length #{provider.size}" : provider.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid provider with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(provider: provider, uid: 'xxid-1234')) # provider requires a uid
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end

    # ==========================
    # PASSWORD VALIDATIONS
    # ==========================
    context 'password', :password_context do
      [
        # Invalid password partition 0 - 6: lower boundary
        { password: '', is_valid: false },
        { password: 'p', is_valid: false }, # +1 char
        { password: 'psw', is_valid: false }, # equivalence partition
        { password: 'secpw', is_valid: false }, # -1 char from valid lower boundary

        # Valid password partition 6-50
        { password: 'secpsw', is_valid: true }, # valid lower
        { password: 'secpswd', is_valid: true }, # +1 char
        { password: 'superSecPsw!a31b_qwe0#', is_valid: true }, # equivalence partition
        { password: 'p' * 49, is_valid: true }, # -1 char from valid upper
        { password: 'p' * 50, is_valid: true }, # valid upper

        # Invalid password partition > 50
        { password: 'p' * 51, is_valid: false }, # +1 char
        { password: 'p' * 100, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { password: nil, is_valid: false },
        { password: 1, is_valid: false },
        { password: true, is_valid: false }
      ].each do |example|
        password = example[:password]
        size_or_datatype = password.is_a?(String) ? "length #{password.size}" : password.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid password with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(password: password))
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end

    # ==========================
    # IMAGE_SRC VALIDATIONS
    # ==========================
    context 'image_src', :image_src_context do
      [
        # Invalid image_src partition 0 - 14: lower boundary
        { image_src: '', is_valid: true }, # valid since nil is acceptable for image_src
        { image_src: 'h', is_valid: false }, # +1 char
        { image_src: 'http://s.d', is_valid: false }, # equivalence partition
        { image_src: 'http://img.dk', is_valid: false }, # -1 char from valid lower boundary

        # Valid image_src partition 14-400
        { image_src: 'http://img.dk/', is_valid: true }, # valid lower
        { image_src: 'http://img.dk/1', is_valid: true }, # +1 char
        { image_src: 'https://munchora.pro/uploads/recipes/3r93xhue938383.jpg', is_valid: true }, # equivalence partition
        { image_src: "http://img.dk/uploads/#{'x' * 377}", is_valid: true }, # -1 char from valid upper
        { image_src: "http://img.dk/uploads/#{'x' * 378}", is_valid: true }, # valid upper

        # Invalid image_src partition > 400
        { image_src: "http://img.dk/uploads/#{'x' * 379}", is_valid: false }, # +1 char
        { image_src: "http://img.dk/uploads/#{'x' * 778}", is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type, wrong http/https URL format
        { image_src: nil, is_valid: true },
        { image_src: 1, is_valid: false },
        { image_src: true, is_valid: false },
        { image_src: 'a.com', is_valid: false },
        { image_src: 'invalid_url', is_valid: false },
        { image_src: 'http://a.co', is_valid: false },
        { image_src: 'htp://site.com/uploads/x.jpg', is_valid: false }
      ].each do |example|
        image_src = example[:image_src]
        size_or_datatype = image_src.is_a?(String) ? "length #{image_src.size}" : image_src.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid image_src with #{size_or_datatype}" do
          user = User.new(valid_attributes.merge(image_src: image_src))
          example[:is_valid] ? (expect(user).to be_valid) : (expect(user).to_not be_valid)
        end
      end
    end
  end

  describe 'methods' do
    describe '#as_json' do
      it 'does not include password_digest' do
        user = User.create!(id: SecureRandom.uuid, email: 'secure@example.com', first_name: 'Test', last_name: 'Doe', password: 'secure123')
        json = user.as_json
        expect(json).not_to have_key('password_digest')
      end
    end
  end
end
