class AddMonthlyChatCountToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :monthly_chat_count, :integer
  end
end
