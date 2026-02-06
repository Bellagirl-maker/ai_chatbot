require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module AiChatbotBackend
  class Application < Rails::Application
    config.load_defaults 8.0

    config.autoload_lib(ignore: %w[assets tasks])

    # Session & cookies (needed for auth)
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore
  end
end
