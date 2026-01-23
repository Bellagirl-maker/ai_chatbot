class Admin::ChatMessagesController < ApplicationController
  before_action :set_message, only: [:show, :update, :destroy]

  def index
    render json: ChatMessage.all.order(created_at: :desc)
  end

  def show
    render json: @message
  end

  def update
    if @message.update(message_params)
      render json: @message
    else
      render json: { errors: @message.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @message.destroy
    head :no_content
  end

  private

  def set_message
    @message = ChatMessage.find(params[:id])
  end

  def message_params
    params.require(:chat_message).permit(:role, :content)
  end
end
