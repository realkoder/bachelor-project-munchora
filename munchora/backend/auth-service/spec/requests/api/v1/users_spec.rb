require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :request do
  let!(:users) { create_list(:user, 30) } # Create multiple users using the factory

  # acting with authenticated test-user
  let!(:auth_user) { User.create!(first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', password: 'secure123') }
  let(:headers) do
    token = Auth::JsonWebToken.encode(user_id: auth_user.id)
    { 'Authorization' => "Bearer #{token}", 'Content-Type' => 'application/json' }
  end

  # ======================================
  # GET: INDEX
  # ======================================
  context '#index' do
    context 'authentication' do
      it 'returns 401 if no token is provided (decision: unauthenticated)' do
        get '/api/v1/users'
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns 200 with valid token (decision: authenticated)' do
        get '/api/v1/users', headers: headers
        expect(response).to have_http_status(:ok)
      end
    end

    context 'without search query' do
      it 'returns all users paginated' do
        get '/api/v1/users', headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['data'].size).to eq(10)
        expect(json['pagination']).to include('current_page', 'total_pages', 'total_count')
      end

      it 'returns users in correct json #fullname and without password_digest' do
        get '/api/v1/users', headers: headers

        json = JSON.parse(response.body)
        json['data'].each do |user_json|
          expect(user_json['fullname']).to eq("#{user_json['first_name']} #{user_json['last_name']}")
          expect(user_json).not_to include('password_digest')
          expect(user_json).not_to include('email')
        end
      end
    end

    context 'with search query' do
      [
        { search: '', expect: { status: :ok, users_size: 10 } }, # lower boundary
        { search: 's', expect: { status: :ok, users_size: 10 } }, # lower +1
        { search: '      ', expect: { status: :ok, users_size: 10 } }, # edge case - string with whitespaces
        { search: 'Jane Smith', expect: { status: :ok, users_size: 1 } }, # eq partition
        { search: 'jane@example.com', expect: { status: :ok, users_size: 1 } }, # existing email
        { search: 'NOTHING', expect: { status: :ok, users_size: 0 } }, # edge case
        { search: 'a' * 119, expect: { status: :ok, users_size: 0 } }, # valid upper -1
        { search: 'a' * 120, expect: { status: :ok, users_size: 0 } }, # valid upper boundary
        { search: 'a' * 121, expect: { status: :bad_request, users_size: 0 } } # valid upper +1
      ].each do |example|
        it "returns #{example[:expect][:users_size]} users when searching with: #{example[:search]} and status: #{example[:expect][:status]}" do
          get '/api/v1/users', params: { search: example[:search] }, headers: headers
          expect(response).to have_http_status(example[:expect][:status])
          json = JSON.parse(response.body)

          if example[:expect][:status] == :bad_request
            (expect(json['error']).to eq('Search query too long (max 120 characters)'))
          else
            (expect(json['data'].size).to eq(example[:expect][:users_size]))
          end
        end
      end
    end

    context ' pagination ' do
      [
        # "invalid" page number LARGE NEGATIVE - 1
        { pagination: { page: -100, per_page: 10 }, expect: { users_size: 10, status: :ok } }, # equivalence partition
        { pagination: { page: 0, per_page: 10 }, expect: { users_size: 10, status: :ok } }, # -1 char from valid lower boundary
        # "valid" page number 1 - LARGE NUMBER
        { pagination: { page: 1, per_page: 10 }, expect: { users_size: 10, status: :ok } }, # valid lower
        { pagination: { page: 2, per_page: 10 }, expect: { users_size: 10, status: :ok } },
        { pagination: { page: 999999, per_page: 10 }, expect: { users_size: 0, status: :ok } }, # equivalence partition

        # edge case testing if per_page is changed
        { pagination: { page: 4, per_page: 2 }, expect: { users_size: 2, status: :ok } }
      ].each do |example|
        it "handles pagination with page number: #{example[:pagination][:page]} and returns #{example[:expect][:users_size]} users" do
          get '/api/v1/users', params: { page: example[:pagination][:page], per_page: example[:pagination][:per_page] }, headers: headers
          expect(response).to have_http_status(example[:expect][:status])
          json = JSON.parse(response.body)

          example[:expect][:users_size] <= 0 ? (expect(json['data']).to be_empty) : (expect(json['data'].size).to eq(example[:expect][:users_size]))
          expected_page_num = example[:pagination][:page] <= 0 ? 1 : example[:pagination][:page]
          expect(json['pagination']['current_page']).to eq(expected_page_num)
        end
      end
    end
  end

  # ======================================
  # GET: SHOW
  # ======================================
  context '#show' do
    context 'authentication' do
      it 'returns 401 if no token is provided (decision: unauthenticated)' do
        get '/api/v1/users/1212'
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns 200 with valid token (decision: authenticated) and the users data' do
        get "/api/v1/users/#{auth_user.id}", headers: headers
        expect(response).to have_http_status(:ok)
        user_json = JSON.parse(response.body)
        expect(user_json['fullname']).to eq("Jane Smith")
        expect(user_json).not_to include('password_digest')
        expect(user_json).not_to include('email')
      end
    end

    it 'returns the authenticated/signed-in user even if id-path-variable is incorrect' do
      get '/api/v1/users/1212', headers: headers
      user_json = JSON.parse(response.body)
      expect(user_json['fullname']).to eq("Jane Smith")
      expect(user_json).not_to include('password_digest')
      expect(user_json).not_to include('email')
    end
  end

  # ======================================
  # POST: CREATE
  # ======================================
  context '#create' do
    let(:valid_attributes) do
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'secure123',
        password_confirmation: 'secure123'
      }
    end

    it 'creates a new user with valid attributes and without sensitive data' do
      expect { post '/api/v1/users', params: { user: valid_attributes }.to_json, headers: { 'Content-Type' => 'application/json' } }.to change(User, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['first_name']).to eq('John')
      expect(json['last_name']).to eq('Doe')
      expect(json['fullname']).to eq('John Doe')
      expect(json).not_to include('email', 'password_digest', 'password', 'password_confirmation')
    end

    it 'creates a new user only one time if tried multiple' do
      expect { post '/api/v1/users', params: { user: valid_attributes }.to_json, headers: { 'Content-Type' => 'application/json' } }.to change(User, :count).by(1)
      expect { post '/api/v1/users', params: { user: valid_attributes }.to_json, headers: { 'Content-Type' => 'application/json' } }.to change(User, :count).by(0)

      expect(response).to have_http_status(:unprocessable_content)
    end

    [
      { extended: { first_name: 'José', last_name: 'Muñoz-O\'Connor', email: 'jose@example.com' }, expect: { status: :created } }, # edge case with special chars
      { extended: { email: 'JOHN.DOE@EXAMPLE.COM', first_name: 'John2', last_name: 'Doe2' }, expect: { status: :created } }, # edge case with case insensitive email
      { extended: { email: 'invalid-email', first_name: 'John2', last_name: 'Doe2' }, expect: { status: :unprocessable_content } }, # edge case negative test for invaid email
      { extended: { email: '', first_name: '', last_name: '' }, expect: { status: :unprocessable_content } }, # unprocessable_content for nil values when required
      { extended: { email: "john@doe.com", first_name: "Robert'; DROP TABLE users; --", last_name: "Robert'; DROP TABLE users; --" }, expect: { status: :created } } # edge case sql injection
    ].each do |example|
      it "creates user with first_name: #{example[:extended][:first_name]}, last_name: #{example[:extended][:last_name]}, email: #{example[:extended][:email]}" do
        user_attributes = valid_attributes.merge(example[:extended])
        post '/api/v1/users', params: { user: user_attributes }.to_json, headers: { 'Content-Type' => 'application/json' }

        expect(response).to have_http_status(example[:expect][:status])

        if example[:expect][:status] == :created
          json = JSON.parse(response.body)
          expect(json['first_name']).to eq(user_attributes[:first_name])
          expect(json['last_name']).to eq(user_attributes[:last_name])
        end
      end
    end

    [
      { description: 'empty request body', params: nil },
      { description: 'malformed JSON', params: '{ malformed json' }
    ].each do |example|
      it "returns bad_request when given #{example[:description]}" do
        post '/api/v1/users', params: example[:params], headers: { 'Content-Type' => 'application/json' }

        expect(response).to have_http_status(:bad_request)
      end
    end
  end

  # ======================================
  # PUT/PATCH: UPDATE
  # ======================================
  context '#update' do
    let(:sut_user) { create(:user, first_name: 'John', last_name: 'Doe', email: 'john@example.com') }
    let(:sut_headers) do
      token = Auth::JsonWebToken.encode(user_id: sut_user.id)
      { 'Authorization' => "Bearer #{token}", 'Content-Type' => 'application/json' }
    end

    context 'positive tests' do
      [
        { description: 'allowed fields successfully', attrs: { first_name: 'Johnny', last_name: 'Doez' }, status: :ok, expect: { first_name: 'Johnny', last_name: 'Doez' } },
        { description: 'email to a new valid one', attrs: { email: 'new.email@example.com' }, status: :ok, expect: nil }, # email will not be updated bu should just pass
        { description: 'bio to a new bio description', attrs: { bio: 'i like cooking with ai' }, status: :ok, expect: { bio: 'i like cooking with ai' } }
      ].each do |example|
        it "updates #{example[:description]}" do
          patch "/api/v1/users/#{sut_user.id}", params: { user: example[:attrs] }.to_json, headers: sut_headers

          expect(response).to have_http_status(example[:status])
          if example[:expect] != nil
            json = JSON.parse(response.body)
            example[:expect].each do |key, val|
              expect(json[key.to_s]).to eq(val)
            end
          end
        end
      end
    end

    context 'negative tests' do
      it 'returns 422 when required fields are blank' do
        updated_attributes = { first_name: '', last_name: '' }

        patch "/api/v1/users/#{sut_user.id}", params: { user: updated_attributes }.to_json, headers: sut_headers

        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'returns 401 when no authentication token is provided' do
        patch "/api/v1/users/#{sut_user.id}", params: { user: { first_name: 'New' } }.to_json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  # ======================================
  # DELETE: DESTROY
  # ======================================
  context '#destroy' do
    context 'positive tests' do
      it '' do
      end
    end
    context 'negative tests' do
      it '' do
      end
    end
  end

  # ======================================
  # POST: UPLOAD_IMAGE
  # ======================================
  context '#update' do
    context 'positive tests' do
      it '' do
      end
    end
    context 'negative tests' do
      it '' do
      end
    end
  end

  # ======================================
  # DELETE: DELETE_IMAGE
  # ======================================
  context '#destroy' do
    context 'positive tests' do
      it '' do
      end
    end
    context 'negative tests' do
      it '' do
      end
    end
  end
end
