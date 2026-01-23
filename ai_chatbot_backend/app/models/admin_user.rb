class AdminUser < ApplicationRecord
  belongs_to :company
  has_secure_password

  validates :email, presence: true, uniqueness: true
end
