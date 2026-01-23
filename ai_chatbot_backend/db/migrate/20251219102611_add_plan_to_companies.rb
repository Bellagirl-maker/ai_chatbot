class AddPlanToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :plan, :string
  end
end
