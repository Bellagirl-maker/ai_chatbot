class AddCompanyIdToChatMessages < ActiveRecord::Migration[8.0]
  def change
    add_reference :chat_messages, :company, null: true, foreign_key: true
  end
end
