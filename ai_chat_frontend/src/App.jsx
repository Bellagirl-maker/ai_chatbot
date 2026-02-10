import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";
import AdminLayout from "./admin/AdminLayout";
import SupportArticlesList from "./admin/SupportArticlesList";
import NewSupportArticle from "./admin/NewSupportArticle";
import API_URL from "./config/api";

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Check if logged in
  useEffect(() => {
    fetch(`${API_URL}/me`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(data => {
        setAdmin(data.admin);
      })
      .catch(() => {
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2️⃣ FETCH CSRF TOKEN (ADD THIS)
  useEffect(() => {
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        window.csrfToken = data.csrfToken;
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />

        <Route path="/login" element={<Login onLogin={setAdmin} />} />
        <Route path="/register" element={<Register onRegister={setAdmin} />} />

        <Route
          path="/admin"
          element={admin ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<SupportArticlesList />} />
          <Route path="support-articles" element={<SupportArticlesList />} />
          <Route path="support-articles/new" element={<NewSupportArticle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
