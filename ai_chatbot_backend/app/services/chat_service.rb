require "net/http"
require "json"

class ChatService
  def initialize(message:, company:)
    @message = message
    @company = company
  end

  def call
    support_text = load_company_support_text

    uri = URI("https://api.groq.com/openai/v1/chat/completions")

    headers = {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer #{ENV["GROQ_API_KEY"]}"
    }

    body = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: <<~TEXT
            You are a customer support AI for a company.

            You must follow these rules:

            • ONLY answer using the company knowledge provided.
            • If the answer is NOT found in the company knowledge,
              reply: "Sorry, I don’t have information about that yet."
            • Do NOT invent policies or information.
            • Keep answers short, friendly, and professional.
            • If the user asks something unrelated (e.g., weather, math),
              reply: "I can only help with support questions."

            Company Knowledge:
            #{support_text}
          TEXT
        },
        { role: "user", content: @message }
      ]
    }

    response = Net::HTTP.post(uri, body.to_json, headers)
    json = JSON.parse(response.body)

    return "AI Error: #{json["error"]["message"]}" if json["error"]

    json.dig("choices", 0, "message", "content") || "Sorry, I don’t have information about that yet."

  rescue => e
    "AI Error: #{e.message}"
  end

  private

  def load_company_support_text
  return "No company-specific support data available." unless @company

  articles = @company.support_articles.order(created_at: :desc).limit(10)
  return "No support articles found for this company." if articles.empty?

  articles.map { |a| "#{a.question}: #{a.answer}" }.join("\n\n")
end

end
