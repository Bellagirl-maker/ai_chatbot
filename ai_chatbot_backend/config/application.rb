require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module AiChatbotBackend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    config.autoload_lib(ignore: %w[assets tasks])

    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore

    # 🔴 ADD THESE LINES BELOW
    config.active_job.queue_adapter = :async

    config.solid_queue.enabled = false
    config.solid_cache.enabled = false
    config.solid_cable.enabled = false
    # 🔴 END ADD
  end
end
