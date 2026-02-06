Rails.application.routes.draw do
  namespace :admin do
    post "upgrade", to: "billing#upgrade"
    resources :support_articles
    resources :chat_messages
    resources :companies
  end

  resource :session, only: [:create, :destroy]
  get "/me", to: "sessions#me"

  resources :chats, only: [:index, :create]
  
post "/registrations", to: "registrations#create"
post "/payments/initialize", to: "payments#initialize_transaction"
get "/payments/verify", to: "payments#verify"
post "/paystack/webhook", to: "admin/paystack_webhooks#create"
get "/csrf", to: "application#csrf_token"
get "/", to: proc { [200, { "Content-Type" => "application/json" }, [{ status: "ok" }.to_json]] }




end
