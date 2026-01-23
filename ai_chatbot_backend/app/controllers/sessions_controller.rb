class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  def create
    admin_user = AdminUser.find_by(email: params[:email])

    if admin_user&.authenticate(params[:password])
      session[:admin_user_id] = admin_user.id
      render json: { admin_user: admin_user, company: admin_user.company }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    session.delete(:admin_user_id)
    head :no_content
  end

  def me
    Rails.logger.debug "SESSION ID: #{session[:admin_user_id]}"

    if current_admin_user
      render json: { admin_user: current_admin_user, company: current_admin_user.company }
    else
      render json: { error: "Not logged in" }, status: :unauthorized
    end
  end
end
