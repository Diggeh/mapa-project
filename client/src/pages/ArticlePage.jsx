import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import "./ArticlePage.css";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, showToast } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your MAPA Research Assistant 🤖. Ask me anything about this article and I'll help you understand it in simple terms.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchArticleAndStatus = async () => {
      try {
        setLoading(true);
        const articleData = await apiFetch(`/api/articles/${id}`);
        setArticle(articleData);

        if (token) {
          try {
            const userData = await apiFetch("/api/users/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const bookmarked = userData.bookmarks.some((b) => b._id === id);
            setIsBookmarked(bookmarked);
          } catch (profileErr) {
            console.error("Failed to fetch profile:", profileErr);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndStatus();
  }, [id, token]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  const toggleBookmark = async () => {
    if (!token) {
      showToast("Please login or register to bookmark articles.", "error");
      return;
    }
    try {
      const data = await apiFetch(`/api/users/bookmarks/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsBookmarked(data.isBookmarked);
      showToast(data.message, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const sendMessage = async () => {
    const question = inputValue.trim();
    if (!question || isBotTyping) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsBotTyping(true);

    try {
      const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
      };
      const paperText = article
        ? `Title: ${article.title}\n\n${stripHtml(article.content)}`
        : "No article content available.";

      const data = await apiFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ userQuestion: question, paperText }),
      });

      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="article-page-container">
        <NavBar />
        <div className="article-content-wrapper">
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page-container">
        <NavBar />
        <div className="article-content-wrapper">
          <h2>Error</h2>
          <p>{error || "Article could not be loaded."}</p>
          <button
            onClick={() => navigate("/")}
            className="tag-pill"
            style={{ marginTop: "1rem", cursor: "pointer" }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page-container">
      <NavBar />

      <main className="article-content-wrapper">
        <button
          className="bookmark-icon-large"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? "★" : "☆"}
        </button>

        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="author-name">Author: {article.authors.join(", ")}</span>
            <span className="publish-date">
              {article.publishedDate
                ? new Date(article.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                : "Date Published"}
            </span>
            <span className="source-link">Source: <a href={article.sourceLink}>{article.sourceLink}</a></span>
          </div>
          <div className="article-tags">
            {article.category &&
              article.category.map((tag, index) => (
                <span key={index} className="tag-pill">
                  {tag}
                </span>
              ))}
            {article.region && <span className="tag-pill">{article.region}</span>}
          </div>
        </header>

        {(() => {
          const isHtml = /<[a-z][\s\S]*>/i.test(article.content);
          if (isHtml) {
            // Fix: Quill/PDF paste inserts &nbsp; for every space, making text unbreakable
            const cleaned = article.content.replace(/&nbsp;/gi, ' ');
            return <section className="article-body" dangerouslySetInnerHTML={{ __html: cleaned }} />;
          } else {
            return (
              <section className="article-body">
                {article.content.split("\n").map(
                  (paragraph, idx) => paragraph.trim() && <p key={idx}>{paragraph}</p>
                )}
              </section>
            );
          }
        })()}
      </main>

      {/* AI Chatbot */}
      {chatOpen && (
        <div className="chatbot-panel" role="dialog" aria-label="AI Research Assistant">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <p className="chatbot-name">MAPA Assistant</p>
                <p className="chatbot-status">AI · Powered by Gemini</p>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.role}`}>
                {msg.role === "bot" && <div className="bot-icon">🤖</div>}
                <div className={`chat-bubble ${msg.role}`}>{msg.text}</div>
              </div>
            ))}
            {isBotTyping && (
              <div className="chat-bubble-wrapper bot">
                <div className="bot-icon">🤖</div>
                <div className="chat-bubble bot typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <textarea
              className="chatbot-input"
              placeholder="Ask about this article…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="chatbot-send-btn"
              onClick={sendMessage}
              disabled={isBotTyping || !inputValue.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Chat Button */}
      <button
        className={`floating-chat-btn ${chatOpen ? "active" : ""}`}
        onClick={() => setChatOpen((prev) => !prev)}
        aria-label="Open AI chat"
      >
        {chatOpen ? (
          <span className="chat-btn-icon">✕</span>
        ) : (
          <>
            <span className="chat-btn-icon">✦</span>
            <span className="chat-btn-label">AI Chat</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ArticlePage;
