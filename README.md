# SD Bachelor Project - Munchora

Rails command for generating services

```bash
rails new auth-service --api --database=mysql --skip-test --skip-system-test -T --skip-git
```

## ActiveRecord

Rails command to create ActiveRecord model with migration

```bash
bin/rails generate model User first_name:string last_name:string email:string provider:string uid:string password_digest:string image_src:string bio:string last_signed_in_at:datetime
```

Example for an empty migration to add indexes:

```
rails generate migration AddIndexesToUsers
```

Creating the controller for users

```bash
rails generate controller Users index show create update destroy search upload_image delete_image
```

And add this to `config/routes.rb`

```ruby
resources :users, only: %i[index show create update destroy] do
  collection do
    get :search
    post :upload_image
    delete :delete_image
  end
end
```

---

<br>

# AUTH - JWT

Using **Public / Private key (RS256)** for the JWT - private key is only known by _auth-service_ but public by all relevant servcies.

```bash
# Generate private key
openssl genrsa -out jwt_private.pem 2048

# Generate public key
openssl rsa -in jwt_private.pem -pubout -out jwt_public.pem

cd munchora/backend/auth-service
# Depends on IDE / terminal only run one of below
EDITOR="nano" rails credentials:edit
EDITOR="idea --wait" rails credentials:edit
```

**Add the private and public key**

```yml

```

---

<br>

# Testing

## Configuring RSpec

Add these gems to `Gemfile`

```ruby
group :development, :test do
  # Test coverage tracking tool
  gem 'simplecov', require: false

  # Rspec for TDD
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'webmock'
  gem 'shoulda-matchers', '~> 5.0'
end
```

#### Shoulda Matchers with RSpec

Using gem _Shoulda Matchers_ for one liners that test Rails functionality - read more in
this [medium article](https://medium.com/@ajikjikq/shoulda-matchers-with-rspec-3e287774ec17)

Add this gem test group to gem file

```ruby
group :test do
  gem 'shoulda-matchers', '~> 5.0'
end
```

Add this to `spec/rails_helper.rb`

```ruby
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
```

Now we can do stuff like this

```ruby
describe "associations" do
  it { should have_many(:grocery_lists).with_foreign_key(:owner_id).dependent(:destroy) }
  it { should have_many(:grocery_list_shares).dependent(:destroy) }
  it { should have_many(:recipes).dependent(:destroy) }
  it { should have_many(:llm_usages) }
  it { should have_many(:shared_grocery_lists).through(:grocery_list_shares).source(:grocery_list) }
end
```

---

Enable RSpec for Ruby on Rails project:

```bash
bin/rails generate rspec:install
```

To track correct coverage by simple-cov then change the eager load within `config/environments/test.rb`:

```ruby
# HUGE ISSUES WITH SIMPLECOV differences between local and CI https://reinteractive.com/articles/tutorial-series-for-experienced-rails-developers/CI-simplecov-and-coverage-discrepancies
config.eager_load = false
```

---

<br>

## Static Testing

# Rubocop

Linting and style enforcement. Rules are defined in ./server/.rubocop.yml.

```bash
# analyze project
bundle exec rubocop

# Run analyzer and make rubocop automatically fix linting issues
bundle exec rubocop -a
```