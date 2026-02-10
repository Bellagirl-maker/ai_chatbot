Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://ai-chatbot-frontend-7s0l.onrender.com"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
