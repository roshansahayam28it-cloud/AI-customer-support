import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function MyTickets() {

  const [tickets, setTickets] = useState([]);
  const [replies, setReplies] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    fetch(
      `http://127.0.0.1:8000/tickets/customer/${user.email}`
    )
      .then((res) => res.json())
      .then((data) => setTickets(data));

  }, []);

  const getStatusColor = (status) => {

    if (status === "Open") return "#ef4444";

    if (status === "Pending") return "#f59e0b";

    return "#22c55e";

  };

  const loadReplies = async (ticketId) => {

    const res = await fetch(
      `http://127.0.0.1:8000/replies/${ticketId}`
    );

    const data = await res.json();

    setReplies(data);
    setSelectedTicket(ticketId);
    setShowReplies(true);

  };

  return (

    <div className="container">

      <Sidebar />

      <main
        className="main"
        style={{
          paddingTop: "90px"
        }}
      >

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "30px"
          }}
        >

          <h1
            style={{
              fontSize: "42px",
              marginTop: 0,
              marginBottom: "35px"
            }}
          >
            🎫 My Tickets
          </h1>

          {tickets.map((ticket) => (

            <div
              key={ticket.id}
              style={{
                background: "#131b2f",
                border: "1px solid #27354a",
                borderRadius: "18px",
                padding: "24px",
                marginBottom: "22px",
                boxShadow: "0 10px 25px rgba(0,0,0,.25)"
              }}
            >

              <h3 style={{ marginTop: 0 }}>
                Ticket #{ticket.id}
              </h3>

              <p>
                <strong>Issue:</strong> {ticket.issue}
              </p>

              <p>
                <strong>Priority:</strong> {ticket.priority}
              </p>

              <span
                style={{
                  display: "inline-block",
                  background: getStatusColor(ticket.status),
                  color: "white",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontWeight: "bold"
                }}
              >
                {ticket.status}
              </span>

              <div style={{ marginTop: "18px" }}>

                <button
                  onClick={() => loadReplies(ticket.id)}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  View Conversation
                </button>

              </div>

            </div>

          ))}

        </div>

        {showReplies && (

          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.75)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999
            }}
          >

            <div
              style={{
                width: "750px",
                maxWidth: "95%",
                height: "650px",
                background: "#0f172a",
                borderRadius: "18px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >

              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #334155",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >

                <div>

                  <h2 style={{ margin: 0 }}>
                    Conversation
                  </h2>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#94a3b8"
                    }}
                  >
                    Ticket #{selectedTicket}
                  </p>

                </div>

                <button
                  onClick={() => setShowReplies(false)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>

              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "25px",
                  background: "#020617"
                }}
              >

                {replies.length === 0 ? (

                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "150px",
                      color: "#64748b"
                    }}
                  >
                    <h3>No conversation yet</h3>

                    <p>
                      The agent hasn't replied yet.
                    </p>

                  </div>

                ) : (

                  replies.map((reply) => (

                    <div
                      key={reply.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          reply.sender === "Agent"
                            ? "flex-start"
                            : "flex-end",
                        marginBottom: "18px"
                      }}
                    >

                      <div
                        style={{
                          background:
                            reply.sender === "Agent"
                              ? "#2563eb"
                              : "#334155",
                          padding: "14px 18px",
                          borderRadius: "18px",
                          maxWidth: "70%",
                          color: "white"
                        }}
                      >

                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "6px"
                          }}
                        >
                          {reply.sender}
                        </div>

                        <div>
                          {reply.message}
                        </div>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );

}

export default MyTickets;