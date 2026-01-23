import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register"
import AdminLayout from "./admin/AdminLayout";
import SupportArticlesList from "./admin/SupportArticlesList";
import NewSupportArticle from "./admin/NewSupportArticle";

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch("http://localhost:3000/me", {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public chatbot */}
        <Route path="/" element={<Chat />} />

        {/* Login OR Register*/}
        <Route path="/login" element={<Login onLogin={setAdmin} />} />
        <Route path="/register" element={<Register onRegister={setAdmin} />} />


        {/* Protected admin */}
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
