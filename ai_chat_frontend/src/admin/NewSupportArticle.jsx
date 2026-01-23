import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewSupportArticle() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3000/admin/support_articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        support_article: { question, answer }
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        navigate("/admin/support-articles");
      })
      .catch(err => alert(err.message));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Add New Article</h1>

      <form onSubmit={handleSubmit}>
        <label>Question:</label>
        <br />
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />

        <br /><br />

        <label>Answer:</label>
        <br />
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
