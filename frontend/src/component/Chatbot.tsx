import API from "../api";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added or loading changes
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: 'You must be logged in to use the chat.',
          },
        ]);
        setLoading(false);
        return;
      }

      const res = await API.post("chat/", { message });

      const botMessage: Message = {
        role: "assistant",
        text: res.data.assistant.message,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-blue-600 text-white text-3xl cursor-pointer z-[9999] flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle chat"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[90px] right-5 w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-white border border-gray-300 rounded-lg flex flex-col overflow-hidden z-[9999] shadow-2xl">
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white font-bold text-center">
            AI Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] w-fit ${
                  msg.role === "user"
                    ? "self-end bg-blue-500 text-white"
                    : "self-start bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-white text-gray-800 p-3 rounded-lg border border-gray-200">
                AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex p-3 border-t border-gray-200 bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  sendMessage();
                }
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot; 