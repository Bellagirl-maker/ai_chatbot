import { useEffect, useRef, useState } from "react";
import userImg from "./assets/user.png";
import botImg from "./assets/bot.png";
import API_URL from "./config/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [chatUsed, setChatUsed] = useState(0);
  const [chatLimit, setChatLimit] = useState(null);
  const [plan, setPlan] = useState("free");

  const bottomRef = useRef(null);

  /* Load chat history */
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`${API_URL}/chats`, {
          credentials: "include"
        });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }

    loadHistory();
  }, []);

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    if (isNaN(d)) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const text = input.trim();
    const tempId = `temp-${Date.now()}`;

    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        sender: "user",
        text,
        created_at: new Date().toISOString()
      }
    ]);

    setInput("");
    setSending(true);
    setTyping(true);
    setError(null);
    setShowUpgrade(false);

    try {
      const res = await fetch("http://localhost:3000/chats", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": window.csrfToken},
        body: JSON.stringify({
          message: text,
          company_id: 1
        })
      });

      if (res.status === 402) {
        setError("Chat limit reached. Please upgrade to continue.");
        setShowUpgrade(true);
        setTyping(false);
        setSending(false);
        return;
      }

      const payload = await res.json();

      setMessages(prev => {
        const updated = prev.map(m =>
          m.id === tempId && payload.user_message ? payload.user_message : m
        );

        if (payload.ai_message) {
          updated.push(payload.ai_message);
        }

        return updated;
      });

      setChatUsed(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "Error contacting AI",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const upgradePlan = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/upgrade", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (data.success) {
        alert("Your plan has been upgraded to Pro");
        setPlan("pro");
        setShowUpgrade(false);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      alert("Upgrade failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[80vh] flex flex-col border rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <img src={botImg} alt="Bot" className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-semibold">Support Assistant</div>
          <div className="text-xs text-gray-500">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="flex flex-col gap-2">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id ?? idx}
                className={`flex items-end ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <img src={botImg} className="w-8 h-8 rounded-full mr-3" />
                )}
                <div className="max-w-[72%]">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isUser
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-xs mt-1 text-gray-500">
                    {formatTime(msg.created_at)}
                  </div>
                </div>
                {isUser && (
                  <img src={userImg} className="w-8 h-8 rounded-full ml-3" />
                )}
              </div>
            );
          })}

          {typing && (
            <div className="flex gap-3">
              <img src={botImg} className="w-8 h-8 rounded-full" />
              <div className="px-3 py-2 rounded-2xl bg-gray-200">
                AI is typing
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-700 text-sm border-t">
          {error}
        </div>
      )}

      {/* Upgrade */}
      {showUpgrade && plan === "free" && (
        <div className="px-4 py-2 border-t bg-yellow-100 flex justify-between items-center">
          <span>Free plan limit reached</span>
          <button
            onClick={upgradePlan}
            className="px-3 py-1 bg-yellow-600 text-white rounded"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t bg-white">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-12 border rounded px-3 py-2"
            placeholder="Type your message"
          />
          <button
            onClick={sendMessage}
            disabled={sending}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
