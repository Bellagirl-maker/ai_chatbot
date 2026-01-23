class SupportArticle < ApplicationRecord
  belongs_to :company
  validates :question, :answer, presence: true
end
