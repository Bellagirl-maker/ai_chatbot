class AddLastResetAtToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :last_reset_at, :datetime
  end
end
