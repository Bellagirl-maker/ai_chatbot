class ChatMessage < ApplicationRecord
  belongs_to :company, optional: true
end
