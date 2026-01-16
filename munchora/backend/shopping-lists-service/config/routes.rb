Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  scope Rails.application.config.relative_url_root.presence || '/' do
    # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
    # Can be used by load balancers and uptime monitors to verify that the app is live.
    get "up" => "rails/health#show", as: :rails_health_check

    namespace :api do
      namespace :v1 do
        # SHOPPING_LISTS
        resources :shopping_lists, only: [:index, :create, :update, :destroy] do
          member do
            post 'add-item', action: :add_item
            delete 'remove-item/:item_id', action: :remove_item
            patch 'update-item/:item_id', action: :update_item
            post 'share', action: :share
            delete 'unshare', action: :unshare
          end
        end
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
