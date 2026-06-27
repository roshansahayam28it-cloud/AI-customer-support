import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ReactMarkdown from "react-markdown";

function AIChat() {

  const [message, setMessage] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        sender: "ai",
        text:
          "Hello 👋 I'm your AI Support Assistant. How can I help you today?",
        time: new Date().toLocaleTimeString()
      }
    ]);

  const chatEndRef = useRef(null);

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

const sendMessage = async () => {

  if (!message.trim()) return;

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  console.log("USER =", user);

  const userMessage = {
    sender: "user",
    text: message,
    time: new Date().toLocaleTimeString()
  };

  setMessages((prev) => [
    ...prev,
    userMessage
  ]);

  setMessage("");

  setLoading(true);

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/chat/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage.text,
          role: user.role,
          email: user.email
        })
      }
    );

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: data.reply,
        time: new Date().toLocaleTimeString()
      }
    ]);

  } catch (error) {

    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "❌ Unable to connect to AI Assistant.",
        time: new Date().toLocaleTimeString()
      }
    ]);

  } finally {

    setLoading(false);

  }

};

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      sendMessage();
    }

  };

  const clearChat = () => {

    setMessages([
      {
        sender: "ai",
        text:
          "Hello 👋 I'm your AI Support Assistant. How can I help you today?",
        time:
          new Date().toLocaleTimeString()
      }
    ]);

  };

  return (

    <div className="container">

  <Sidebar />

    <main
  className="main"
  style={{
    width: "100%"
  }}
>

    <div
  style={{
    width: "100%",
    padding: "30px",
    height: "100%"
  }}
>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center"
          }}
        >

          <h1
            style={{
              fontSize: "42px",
              fontWeight: "bold"
            }}
          >
            AI Support Chat 🤖
          </h1>

          <button
            onClick={clearChat}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding:
                "10px 18px",
              borderRadius:
                "10px",
              cursor: "pointer"
            }}
          >
            Clear Chat
          </button>

        </div>

        <div
  style={{
    marginTop: "20px",
    width: "100%",
    height: "calc(100vh - 170px)",
    background: "#0f172a",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxSizing: "border-box"
  }}
>

         <div
  style={{
    flex: 1,
    overflowY: "auto",
    paddingRight: "10px"
  }}
>

            {messages.map(
              (
                msg,
                index
              ) => (

                <div
                  key={index}
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      msg.sender ===
                      "user"
                        ? "flex-end"
                        : "flex-start",

                    marginBottom:
                      "15px"
                  }}
                >

                  <div
                    style={{
                      maxWidth:
                        "80%",

                      padding:
                        "14px",

                      borderRadius:
                        "16px",

                      background:
                        msg.sender ===
                        "user"
                          ? "#4f46e5"
                          : "#1e293b",

                      lineHeight:
                        "1.7"
                    }}
                  >

                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>

                    <div
                      style={{
                        fontSize:
                          "12px",

                        color:
                          "#94a3b8",

                        marginTop:
                          "8px"
                      }}
                    >
                      {msg.time}
                    </div>

                  </div>

                </div>

              )
            )}

            {loading && (

              <div
                style={{
                  color:
                    "#94a3b8",
                  marginBottom:
                    "15px"
                }}
              >
                🤖 AI is typing...
              </div>

            )}

            <div
              ref={chatEndRef}
            />

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding:
                  "15px",
                borderRadius:
                  "12px",
                border: "none",
                outline: "none",
                background:
                  "#1e293b",
                color: "white"
              }}
            />

            <button
              onClick={
                sendMessage
              }
              disabled={
                loading
              }
              style={{
                background:
                  "#4f46e5",
                color: "white",
                border: "none",
                borderRadius:
                  "12px",
                padding:
                  "15px 25px",
                cursor:
                  "pointer",
                opacity:
                  loading
                    ? 0.6
                    : 1
              }}
            >
              {loading
                ? "Sending..."
                : "Send"}
            </button>

          </div>

        </div>

         </div>

  </main>

</div>

  );
}

export default AIChat;