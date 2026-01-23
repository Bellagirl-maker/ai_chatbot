class CreateChatMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :chat_messages do |t|
      t.string :sender
      t.text :text

      t.timestamps
    end
  end
end
