class CreateSupportArticles < ActiveRecord::Migration[8.0]
  def change
    create_table :support_articles do |t|
      t.references :company, null: false, foreign_key: true
      t.string :question
      t.text :answer

      t.timestamps
    end
  end
end
