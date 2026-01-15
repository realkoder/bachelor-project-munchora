Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  scope Rails.application.config.relative_url_root.presence || '/' do
    get "up" => "rails/health#show", as: :rails_health_check
    namespace :api do
      namespace :v1 do
        # LLM
        post 'llm/generate-recipe', to: 'llm#generate_recipe'
        post 'llm/generate-recipe-image/:id', to: 'llm#generate_recipe_image'
        put 'llm/update-recipe/:id', to: 'llm#update_recipe'

        # Test
        get 'test', to: 'test#test'
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
