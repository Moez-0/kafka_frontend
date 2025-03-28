import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const KafkaChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome. Traveler, what's your name?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    if (!userName && input.trim().toLowerCase() !== "exit") {
      setUserName(input.trim());
      setMessages((prev) => [
        ...prev,
        { text: `Nice to meet you, ${input.trim()}! What's on your mind today?`, sender: "bot" },
      ]);
      setInput("");
      return;
    }

    try {
      const response = await axios.post("https://kafka-backend-idwn.onrender.com/api/therapist/chat", {
        message: input,
        userId: user?.userId || "anonymous",
      });

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div className="bg-background text-primary min-h-screen flex flex-col items-center p-4">
      <h1 className="text-xl md:text-3xl lg:text-4xl font-goldman mb-4 text-center">
        Kafka's Shadow
      </h1>
      <h2 className="text-sm md:text-lg lg:text-2xl font-goldman mb-4 text-center">
        Talk to Kafka as your Therapist for today!
      </h2>

      {/* Chat Container */}
      <div className="w-full max-w-2xl bg-secondary p-3 md:p-6 rounded-lg shadow-lg flex flex-col">
        <div className="overflow-y-auto h-[65vh] px-2 md:px-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 md:p-3 rounded-lg max-w-[80%] text-sm md:text-base ${
                msg.sender === "user"
                  ? "bg-gradient-to-r bg-pink-300 text-white self-end shadow-lg"
                  : "bg-gray-700 text-white self-start shadow-md border border-gray-600"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex items-center mt-3 space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 p-2 md:p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-lg"
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-black px-3 md:px-6 py-2 md:py-3 rounded-lg hover:bg-opacity-80 transition-all text-sm md:text-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default KafkaChatbot;
