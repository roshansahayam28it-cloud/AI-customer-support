import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Analytics() {

  const [analytics, setAnalytics] = useState({
    total_customers: 0,
    total_tickets: 0,
    open_tickets: 0,
    resolved_tickets: 0,
    ai_conversations: 0
  });

  const fetchAnalytics = () => {

    fetch("http://127.0.0.1:8000/analytics/")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
      })
      .catch((err) => {
        console.error(err);
      });

  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const stats = [
    {
      title: "Total Customers",
      value: analytics.total_customers,
      color: "#3b82f6"
    },
    {
      title: "Total Tickets",
      value: analytics.total_tickets,
      color: "#f59e0b"
    },
    {
      title: "Open Tickets",
      value: analytics.open_tickets,
      color: "#ef4444"
    },
    {
      title: "Resolved Tickets",
      value: analytics.resolved_tickets,
      color: "#22c55e"
    },
    {
      title: "AI Conversations",
      value: analytics.ai_conversations,
      color: "#8b5cf6"
    }
  ];

  return (
   <div className="container">

    <Sidebar />

    <main className="main">

        <div
            className="page-content"
            style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "30px",
                color: "white"
            }}
        >

        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "30px"
          }}
        >
          📊 Analytics Dashboard
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px"
          }}
        >

          {stats.map((item, index) => (

            <div
              key={index}
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "20px",
                padding: "25px",
                transition: "0.3s"
              }}
            >

              <h3
                style={{
                  color: "#94a3b8",
                  marginBottom: "10px"
                }}
              >
                {item.title}
              </h3>

              <h2
                style={{
                  fontSize: "42px",
                  color: item.color
                }}
              >
                {item.value}
              </h2>

            </div>

          ))}

        </div>

        <div
          style={{
            marginTop: "30px",
            background: "#0f172a",
            borderRadius: "20px",
            padding: "30px",
            border: "1px solid #1e293b"
          }}
        >

          <h2
            style={{
              marginBottom: "20px"
            }}
          >
            📈 Platform Summary
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: "1.8",
              fontSize: "16px"
            }}
          >
            The AI Customer Support Platform currently has{" "}
            <strong>
              {analytics.total_customers}
            </strong>{" "}
            customers,{" "}
            <strong>
              {analytics.total_tickets}
            </strong>{" "}
            total tickets,{" "}
            <strong>
              {analytics.open_tickets}
            </strong>{" "}
            open tickets,{" "}
            <strong>
              {analytics.resolved_tickets}
            </strong>{" "}
            resolved tickets, and{" "}
            <strong>
              {analytics.ai_conversations}
            </strong>{" "}
            AI conversations.
          </p>

        </div>

      </div>
      </main>
    </div>
  );
}

export default Analytics;