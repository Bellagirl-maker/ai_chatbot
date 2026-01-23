class ChatsController < ApplicationController
  before_action :authenticate_admin_user!
  before_action :set_company

  def index
    messages = ChatMessage
      .where(company: @company)
      .order(created_at: :asc)

    render json: messages
  end

  def create
    # Reset monthly usage if needed
    @company.reset_chat_usage_if_needed!

    # Enforce chat limit
    unless @company.can_chat?
      render json: { error: "Chat limit reached. Please upgrade your plan." }, status: :payment_required
      return
    end

    # Increment chat count
    @company.increment!(:monthly_chat_count)

    # Save user message
    user_msg = ChatMessage.create!(
      sender: "user",
      text: params[:message],
      company: @company
    )

    # Get AI response
    ai_reply = ChatService.new(
      message: params[:message],
      company: @company
    ).call

    # Save AI message
    ai_msg = ChatMessage.create!(
      sender: "ai",
      text: ai_reply,
      company: @company
    )

    render json: {
      user_message: user_msg,
      ai_message: ai_msg
    }
  end

  private

  def set_company
    @company = current_admin_user.company

    unless @company
      render json: { error: "Company not found" }, status: :not_found
    end
  end
end
