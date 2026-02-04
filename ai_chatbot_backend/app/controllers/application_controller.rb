class ApplicationController < ActionController::Base
  include ActionController::Cookies

  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }

  def current_admin_user
    @current_admin_user ||= AdminUser.find_by(id: session[:admin_user_id])
  end

  def authenticate_admin_user!
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_admin_user
  end

  def csrf_token
    render json: { csrfToken: form_authenticity_token }
  end
end
