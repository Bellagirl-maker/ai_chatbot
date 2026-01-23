class Admin::BillingController < ApplicationController
  before_action :authenticate_admin!

  def create
    company = current_admin.company

    reference = "upgrade_#{company.id}_#{Time.current.to_i}"

    render json: {
      reference: reference,
      email: current_admin.email,
      amount: 5000,
      public_key: ENV["PAYSTACK_PUBLIC_KEY"]
    }
  end

  # MVP upgrade (no payment yet)
  def upgrade
    company = current_admin.company

    company.update!(plan: "pro")

    render json: {
      success: true,
      plan: company.plan
    }
  end
end
