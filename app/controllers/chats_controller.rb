class ChatsController < ApplicationController
  def index
    @messages = Message.all
  end

  def create
    user_message = Message.create(role: "user", content: params[:content])
    ai_reply = AiService.chat(user_message.content, Message.all)
    Message.create(role: "assistant", content: ai_reply)
    redirect_to root_path
  end
end
