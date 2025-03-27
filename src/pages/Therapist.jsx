import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


const KafkaChatbot = () => {
    
  const [messages, setMessages] = useState([
    { text: "Welcome. Traveler, what's your name?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState(""); // Store the user's name
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Check if the user's name is not set, ask for it
    if (!userName && input.trim().toLowerCase() !== "exit") {
      setUserName(input.trim());
      setMessages((prev) => [
        ...prev,
        { text: `Nice to meet you, ${input.trim()}! Whats on your mind today ?`, sender: "bot" },
      ]);
      setInput("");
      return;
    }

    try {
      const response = await axios.post("https://kafka-backend-idwn.onrender.com/api/therapist/chat", {
        message: input,
      });

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div className="bg-background text-primary min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl lg:text-4xl font-goldman mb-6">Kafka's Shadow</h1>
      <h1 className="text-3xl lg:text-4xl font-goldman mb-6">Talk to Kafka as your Therapist for today!</h1>

      <div className="w-full max-w-3xl bg-secondary p-6 rounded-lg shadow-lg flex flex-col">
        <div className="overflow-y-auto h-96 px-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary text-black self-end"
                  : "bg-gray-700 text-white self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 p-3 rounded-lg bg-background text-white border border-gray-500 focus:outline-none text-lg"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-primary text-black px-6 py-3 rounded-lg hover:opacity-80 text-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default KafkaChatbot;
