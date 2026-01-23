class Admin::PaystackWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    return unless params[:event] == "charge.success"

    reference = params[:data][:reference]
    company_id = reference.split("_")[1]

    company = Company.find(company_id)
    company.update!(plan: "pro")

    head :ok
  end
end
