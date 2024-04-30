import React, { useState } from "react";
import { urlServer } from "../variables";

const Chatbot = (message) => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isChatGPTTyping, setIsChatGPTTyping] = useState(false);

  const handleSend = async (userMessage) => {
    // Add the user's message to the chat interface
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: userMessage, sender: "user" },
    ]);

    setIsChatGPTTyping(true); // Set typing indicator to true while waiting for response

    // Call the backend API to process the user's message
    try {
      const response = await fetch(`${urlServer}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message to the server");
      }

      const data = await response.json();

      // Add the response from the server to the chat interface
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, sender: "ChatGPT" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, handle errors here (e.g., display an error message to the user)
    } finally {
      setIsChatGPTTyping(false); // Reset typing indicator after receiving response
    }
  };

  return (
    <div className="App">
      <div style={{ position: "relative", height: "100%", width: "auto" }}>
        <div
          className="message-list"
          style={{ overflowY: "auto", height: "300px" }}
        >
          {messages.map((message, i) => (
            <div
              key={i}
              className={`message ${
                message.sender === "user" ? "user" : "chatgpt"
              }`}
            >
              {message.message}
            </div>
          ))}
          {isChatGPTTyping && (
            <div className="typing-indicator">ChatGPT is typing...</div>
          )}
        </div>
        <div>
          <button onClick={() => handleSend(message.message)}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
