Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  scope Rails.application.config.relative_url_root.presence || '/' do
    # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
    # Can be used by load balancers and uptime monitors to verify that the app is live.
    get 'up' => 'rails/health#show', as: :rails_health_check

    namespace :api do
      namespace :v1 do
        # RECIPES
        resources :recipes, only: [:index, :show, :update, :destroy] do
          member do
            # image
            post 'upload-image', to: 'recipes#upload_image'
            delete 'delete-image', to: 'recipes#delete_image'

            # comments
            post 'comments', to: 'recipes#add_comment'
            delete 'comments/:comment_id', to: 'recipes#delete_comment'

            # likes
            post 'likes', to: 'recipes#add_like'
            delete 'likes', to: 'recipes#delete_like'
          end
        end

        # RECIPE_PROMPT
        post 'prompt-recipe', to: 'prompt_recipe#generate'
        put 'prompt-recipe', to: 'prompt_recipe#update'
        get 'prompt-recipe/status', to: 'prompt_recipe#status'
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
