class AddChatUsageToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :monthly_chat_count, :integer, default: 0
    add_column :companies, :chat_limit, :integer, default: 100
    add_column :companies, :last_reset_at, :datetime
  end
end
