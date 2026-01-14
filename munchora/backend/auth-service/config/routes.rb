Rails.application.routes.draw do
  get "users/index"
  get "users/show"
  get "users/create"
  get "users/update"
  get "users/destroy"
  get "users/search"
  get "users/upload_image"
  get "users/delete_image"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  scope Rails.application.config.relative_url_root.presence || '/' do
    # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
    # Can be used by load balancers and uptime monitors to verify that the app is live.
    get 'up' => 'rails/health#show', as: :rails_health_check

    namespace :api, format: false do
      namespace :v1 do
        # AUTH
        get '/auth/google', to: 'auth#google'
        get '/auth/google/callback', to: 'auth#google_callback'
        post '/auth/login', to: 'auth#login'
        delete '/auth/logout', to: 'auth#logout'
        get '/auth/me', to: 'auth#me'

        # USERS
        delete 'users/delete-image', to: 'users#delete_image'
        post 'users/upload-image', to: 'users#upload_image'
        get 'users/search', to: 'users#search'
        resources :users, only: [:index, :show, :create, :update, :destroy]
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
