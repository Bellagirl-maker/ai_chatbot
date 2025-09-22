# app/services/ai_service.rb
class AiService
  include HTTParty
  base_uri "https://api.openai.com/v1"

  def self.chat(prompt, history = [])
    messages = history.map { |m| { role: m.role, content: m.content } }
    messages << { role: "user", content: prompt }

    response = post("/chat/completions",
      headers: {
        "Authorization" => "Bearer #{ENV['OPENAI_API_KEY']}",
        "Content-Type" => "application/json"
      },
      body: {
        model: "gpt-3.5-turbo",
        messages: messages
      }.to_json
    )

    response.parsed_response["choices"][0]["message"]["content"].strip
  end
end
