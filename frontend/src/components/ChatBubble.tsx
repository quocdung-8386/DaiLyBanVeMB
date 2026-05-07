"use client";

import React, { useState, useRef, useEffect } from 'react';

interface ChatBubbleProps {
  isVisible?: boolean;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  id: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isVisible = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Xin chào! Tôi là Skyward AI Assistant. Tôi có thể giúp bạn tìm kiếm chuyến bay, kiểm tra giá vé, và hỗ trợ đặt vé. Bạn cần giúp gì?', id: 1 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponses = [
        'Tôi có thể giúp bạn tìm chuyến bay phù hợp. Bạn muốn đi từ đâu đến đâu?',
        'Hiện tại có nhiều chuyến bay với giá ưu đãi. Bạn muốn tìm chuyến vào thời gian nào?',
        'Tôi có thể kiểm tra lịch bay và giá vé cho bạn. Vui lòng cho tôi biết ngày đi của bạn.',
        'Bạn có thể xem danh sách chuyến bay trong mục "Chuyến bay" hoặc tôi có thể gợi ý cho bạn ngay bây giờ.'
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        role: 'bot',
        content: randomResponse,
        id: Date.now() + 1
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chat-float-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Mở chat"
      >
        <span className="material-icons-round">chat</span>
        <span className="chat-badge">AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-bubble-container">
          <div className="chat-bubble-window">
            {/* Header */}
            <div className="chat-bubble-header">
              <div className="chat-header-left">
                <span className="material-icons-round chat-icon">smart_toy</span>
                <div className="chat-title">
                  <h4>Skyward AI</h4>
                  <span className="online-status">
                    <span className="online-dot"></span>
                    Đang hoạt động
                  </span>
                </div>
              </div>
              <button
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng chat"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            {/* Messages */}
            <div className="chat-bubble-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  <div className="chat-bubble-msg">
                    {msg.role === 'bot' && (
                      <span className="material-icons-round bot-avatar">smart_toy</span>
                    )}
                    <div className="message-content">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message bot typing">
                  <div className="chat-bubble-msg">
                    <span className="material-icons-round bot-avatar">smart_toy</span>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-bubble-input">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                aria-label="Gửi tin nhắn"
              >
                <span className="material-icons-round">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .chat-float-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0e74be, #1e40af);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(14, 116, 190, 0.4), 0 8px 30px rgba(0, 0, 0, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 9999;
        }

        .chat-float-btn:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 6px 25px rgba(14, 116, 190, 0.5), 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .chat-float-btn:active {
          transform: scale(0.95);
        }

        .chat-float-btn.hidden {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.8);
        }

        .chat-float-btn .material-icons-round {
          font-size: 28px;
          color: white;
        }

        .chat-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #10b981;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          border: 2px solid white;
        }

        .chat-bubble-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chat-bubble-window {
          width: 360px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-bubble-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #1e40af, #0e74be);
          color: white;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-title h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .online-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          opacity: 0.9;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
        }

        .chat-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .chat-close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .chat-bubble-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-message {
          display: flex;
        }

        .chat-message.user {
          justify-content: flex-end;
        }

        .chat-message.bot {
          justify-content: flex-start;
        }

        .chat-bubble-msg {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 85%;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .chat-message.user .chat-bubble-msg .message-content {
          background: #0e74be;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-message.bot .chat-bubble-msg .message-content {
          background: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        .bot-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #1e40af, #0e74be);
          color: white;
          border-radius: 50%;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }

        .chat-bubble-input {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #e2e8f0;
        }

        .chat-bubble-input input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .chat-bubble-input input:focus {
          border-color: #0e74be;
          box-shadow: 0 0 0 3px rgba(14, 116, 190, 0.1);
        }

        .chat-send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #0e74be;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .chat-send-btn:hover:not(:disabled) {
          background: #0b5a94;
          transform: scale(1.05);
        }

        .chat-send-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chat-bubble-container {
            bottom: 0;
            right: 0;
            left: 0;
            top: auto;
          }

          .chat-bubble-window {
            width: 100%;
            height: 100vh;
            max-height: 500px;
            border-radius: 16px 16px 0 0;
          }

          .chat-float-btn {
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatBubble;
