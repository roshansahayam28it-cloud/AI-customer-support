import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import StatCard from "../components/StatCard.jsx";
import TicketTable from "../components/TicketTable.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";

export default function Dashboard() {

  const [analytics, setAnalytics] = useState({
    total_customers: 0,
    total_tickets: 0,
    open_tickets: 0,
    resolved_tickets: 0,
    ai_conversations: 0
  });

  const [role, setRole] = useState("Customer");

  const [myTickets, setMyTickets] = useState([]);
  const [agentStats, setAgentStats] = useState({
  total: 0,
  open: 0,
  resolved: 0
});
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    open: 0,
    resolved: 0
  });

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user?.role) {
      setRole(user.role);
    }
    if (user?.role === "Agent") {

  fetch(
    `http://127.0.0.1:8000/tickets/agent/${user.email}`
  )
    .then((res) => res.json())
    .then((data) => {

      setAgentStats({
        total: data.length,
        open: data.filter(
          t => t.status === "Open"
        ).length,
        resolved: data.filter(
          t => t.status === "Resolved"
        ).length
      });

    });

}
    if (user?.role === "Customer") {

  fetch(
    `http://127.0.0.1:8000/tickets/customer/${user.email}`
  )
    .then((res) => res.json())
    .then((data) => {

      setMyTickets(data);

      setCustomerStats({
        total: data.length,
        open: data.filter(
          t => t.status === "Open"
        ).length,
        resolved: data.filter(
          t => t.status === "Resolved"
        ).length
      });

    });
}

    fetch(
      "http://127.0.0.1:8000/analytics/"
    )
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);

  return (
    <div className="container">

      <Sidebar />
      <Header />

      <main className="main">

        <div
          className="page-title"
          style={{ marginBottom: 12 }}
        >
          <div>

            <h1>
                {role === "Admin"
                ? "Admin Dashboard"
                : role === "Agent"
                ? "Agent Dashboard"
                : "Customer Dashboard"}
            </h1>

            <div className="subtitle">
              Today's snapshot of your support operations.
            </div>

          </div>
        </div>

        {/* ADMIN DASHBOARD */}

        {role === "Admin" && (

          <>
            <section
              className="grid"
              style={{ marginBottom: 16 }}
            >

              <div className="col-3">
                <StatCard
                  title="Customers"
                  value={analytics.total_customers}
                  trend="+5%"
                  trendDir="up"
                />
              </div>

              <div className="col-3">
                <StatCard
                  title="Total Tickets"
                  value={analytics.total_tickets}
                  trend="+3%"
                  trendDir="up"
                />
              </div>

              <div className="col-3">
                <StatCard
                  title="Open Tickets"
                  value={analytics.open_tickets}
                  trend="+2%"
                  trendDir="up"
                />
              </div>

              <div className="col-3">
                <StatCard
                  title="Resolved Tickets"
                  value={analytics.resolved_tickets}
                  trend="+1%"
                  trendDir="up"
                />
              </div>

            </section>

            <section className="grid">

              <div className="col-7">
                <TicketTable />
              </div>

              <div className="col-5">
                <ActivityFeed />
              </div>

            </section>
          </>

        )}

        {/* AGENT DASHBOARD */}
        {role === "Agent" && (

          <>
            <section
              className="grid"
              style={{ marginBottom: 16 }}
            >

              <div className="col-4">
                <StatCard
                    title="Assigned Tickets"
                    value={agentStats.total}
                    trend="+3%"
                    trendDir="up"

                />
              </div>

              <div className="col-4">
                <StatCard
                  title="Open Tickets"
                  value={agentStats.open}
                  trend="+2%"
                  trendDir="up"
                />
              </div>

              <div className="col-4">
                <StatCard
                  title="Resolved Tickets"
                  value={agentStats.resolved}
                  trend="+1%"
                  trendDir="up"
                />
              </div>

            </section>

            <section className="grid">

              <div className="col-7">
                <TicketTable />
              </div>

              <div className="col-5">
                <div className="card">

                  <div className="head">
                    <h3>Agent Features</h3>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      color: "#cbd5e1"
                    }}
                  >
                  <p>✅ View Assigned Tickets</p>
                  <p>✅ Reply to Customers</p>
                  <p>✅ Internal Notes</p>
                  <p>✅ Change Ticket Status</p>
                  <p>✅ Access AI Chat</p>
                  <p>❌ Customer Management</p>
                  <p>❌ Analytics Access</p>
                  </div>

                </div>
              </div>

            </section>
          </>

        )}

        {/* CUSTOMER DASHBOARD */}

        {role === "Customer" && (

          <>
            <section
              className="grid"
              style={{ marginBottom: 16 }}
            >

              <div className="col-4">
                <StatCard
                  title="My Tickets"
                  value={customerStats.total}
                  trend=""
                />
              </div>

              <div className="col-4">
                <StatCard
                  title="Open Tickets"
                  value={customerStats.open}
                  trend=""
                />
              </div>

              <div className="col-4">
                <StatCard
                  title="Resolved Tickets"
                  value={customerStats.resolved}
                  trend=""
                />
              </div>

            </section>

            <section className="grid">

              <div className="col-7">

                <div className="card">

                  <div className="head">
                    <h3>My Recent Tickets</h3>
                  </div>

                  <div style={{ padding: "20px" }}>

                    {myTickets.length === 0 ? (

                      <p style={{ color: "#94a3b8" }}>
                        No tickets available.
                      </p>

                    ) : (

                      myTickets.slice(0, 5).map(ticket => (

                        <div
                          key={ticket.id}
                          style={{
                            borderBottom: "1px solid #334155",
                            padding: "12px 0"
                          }}
                        >
                          <strong>
                            #{ticket.id}
                          </strong>

                          <p>
                            {ticket.issue}
                          </p>

                          <span
                            style={{
                              color:
                                ticket.status === "Open"
                                  ? "#22c55e"
                                  : "#60a5fa"
                            }}
                          >
                            {ticket.status}
                          </span>

                        </div>

                      ))

                    )}

                  </div>

                </div>

              </div>

              <div className="col-5">

                <div className="card">

                  <div className="head">
                    <h3>Customer Panel</h3>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      color: "#cbd5e1"
                    }}
                  >
                    <p>✅ Access AI Chat</p>
                    <p>✅ Create Tickets</p>
                    <p>✅ View Ticket Status</p>
                    <p>✅ Track Resolutions</p>
                    <p>❌ Customer Management</p>
                    <p>❌ Analytics Access</p>
                  </div>

                </div>

              </div>

            </section>

          </>

        )}

      </main>

    </div>
  );
}