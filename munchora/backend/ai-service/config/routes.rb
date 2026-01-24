require "sidekiq/web" # require the web UI

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  scope Rails.application.config.relative_url_root.presence || '/' do
    get 'up' => 'rails/health#show', as: :rails_health_check
    namespace :api do
      namespace :v1 do
        # LLM PROMPT
        post "prompt", to: 'llm#prompt'

        # Test
        get 'test', to: 'test#test'

        # SIDEKIQ
        mount Sidekiq::Web => "/sidekiq" # access it at http://localhost:3000/sidekiq
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
