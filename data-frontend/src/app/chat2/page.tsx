"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const s = io("http://localhost:8000");
    setSocket(s);

    s.on("connect", () => {
      console.log("Connected to server");
    });

    s.on("welcome", (msg) => {
      setMessages((prev) => [...prev, { sender: "ai", text: msg }]);
    });

    s.on("server_message", (chunk) => {
      setIsLoading(false);
      setMessages((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].sender !== "ai") {
          return [...prev, { sender: "ai", text: chunk }];
        } else {
          const lastIndex = prev.length - 1;
          const updatedMessage = {
            ...prev[lastIndex],
            text: prev[lastIndex].text + chunk,
          };
          return [...prev.slice(0, lastIndex), updatedMessage];
        }
      });
    });

    s.on("response_end", () => {
      setIsLoading(false);
    });

    s.on("error", (error) => {
      console.error("Socket error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error occurred while processing your request." },
      ]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (userInput.trim() && socket) {
      setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
      socket.emit("message", userInput);
      setIsLoading(true);
      setUserInput("");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}className="text-black">
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "10px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: msg.sender === "ai" ? "#e6f3ff" : "#f0f0f0",
              textAlign: msg.sender === "ai" ? "left" : "right",
            }}
            className="text-black"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return inline ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre
                      style={{
                        background: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "4px",
                      }}
                    >
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                img({ node, ...props }) {
                  return <img style={{ maxWidth: "100%" }} {...props} />;
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div style={{ margin: "10px", padding: "10px", textAlign: "left" }}>
            AI is typing...
          </div>
        )}
        <div ref={chatRef} />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            borderRadius: "4px",
            background: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
