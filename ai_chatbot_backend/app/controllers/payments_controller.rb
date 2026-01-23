class PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def initialize_transaction
    company = Company.first

    response = Faraday.post("https://api.paystack.co/transaction/initialize") do |req|
      req.headers["Authorization"] = "Bearer #{ENV['PAYSTACK_SECRET_KEY']}"
      req.headers["Content-Type"] = "application/json"
      req.body = {
        email: company.email || "admin@example.com",
        amount: 2000 * 100
      }.to_json
    end

    render json: JSON.parse(response.body)
  end

  def verify
    reference = params[:reference]

    response = Faraday.get("https://api.paystack.co/transaction/verify/#{reference}") do |req|
      req.headers["Authorization"] = "Bearer #{ENV['PAYSTACK_SECRET_KEY']}"
    end

    result = JSON.parse(response.body)

    if result["data"]["status"] == "success"
      company = Company.first
      company.update!(
        plan: "pro",
        monthly_chat_limit: 5000
      )
    end

    render json: result
  end
end
