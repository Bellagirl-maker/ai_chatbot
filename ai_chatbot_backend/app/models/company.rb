class Company < ApplicationRecord
  has_many :admins, class_name: "AdminUser"
  has_many :chat_messages
  has_many :support_articles

  PLANS = {
    "free" => {
      articles: 10,
      messages: 100
    },
    "pro" => {
      articles: 100,
      messages: 5000
    }
  }

  validates :plan, presence: true, inclusion: { in: PLANS.keys }

  # ----- Article limits -----
  def article_limit
    PLANS[plan][:articles]
  end

  def articles_used
    support_articles.count
  end

  def can_add_article?
    return true if article_limit.nil?
    support_articles.count < article_limit
  end

  # ----- Chat limits -----
  def monthly_chat_limit
    PLANS[plan][:messages]
  end

  def can_chat?
    monthly_chat_count < monthly_chat_limit
  end

  def reset_chat_usage_if_needed!
    return unless last_reset_at.nil? || last_reset_at < Time.current.beginning_of_month

    update!(
      monthly_chat_count: 0,
      last_reset_at: Time.current
    )
  end
end
