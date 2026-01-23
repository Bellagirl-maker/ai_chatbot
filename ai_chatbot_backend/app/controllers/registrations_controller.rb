class RegistrationsController < ApplicationController
  def create
    company = Company.create!(
      name: params[:company_name],
      plan: "free",
      monthly_chat_count: 0,
      last_reset_at: Time.current
    )

    admin = company.admins.create!(
      email: params[:email],
      password: params[:password]
    )

    session[:admin_user_id] = admin.id


    render json: {
      admin: admin,
      company: company
    }
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
