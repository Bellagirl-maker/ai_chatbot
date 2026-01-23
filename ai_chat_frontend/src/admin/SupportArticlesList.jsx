import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function SupportArticlesList() {
  const [articles, setArticles] = useState([]);
  const [plan, setPlan] = useState(null);
  const [articleLimit, setArticleLimit] = useState(0);
  const [articlesUsed, setArticlesUsed] = useState(0);

  const limitReached = articleLimit !== null && articlesUsed >= articleLimit;

  useEffect(() => {
    fetch("http://localhost:3000/admin/support_articles", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setPlan(data.plan);
        setArticleLimit(data.article_limit);
        setArticlesUsed(data.articles_used);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Support Articles</h1>

      {/* Usage info */}
      <p>
        Articles used: {articlesUsed} / {articleLimit}
      </p>

      {/* Upgrade banner */}
      {limitReached && plan === "free" && (
        <div style={{ background: "#FEF3C7", padding: 12, marginBottom: 16 }}>
          <strong>Article limit reached.</strong>
          <br />
          Upgrade to Pro to add more support articles.
          <br />
          <button
            style={{ marginTop: 8 }}
            onClick={() => alert("Upgrade flow goes here")}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Add button */}
      {!limitReached && (
  <Link to="/admin/support-articles/new">
    ➕ Add New Article
  </Link>
)}
      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: 20, width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.question}</td>
              <td>{a.answer}</td>
              <td>
                <button
                  onClick={() => {
                    fetch(
                      `http://localhost:3000/admin/support_articles/${a.id}`,
                      {
                        method: "DELETE",
                        credentials: "include"
                      }
                    ).then(() => {
                      setArticles(prev =>
                        prev.filter(x => x.id !== a.id)
                      );
                      setArticlesUsed(prev => prev - 1);
                    });
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
