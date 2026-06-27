import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Tickets() {
  const [agents, setAgents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
const [role, setRole] = useState("Agent");

  const [formData, setFormData] = useState({
    customer_id: "",
    issue: "",
    priority: "Low",
    status: "Open"
  });

const fetchTickets = async () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  let url =
    "http://127.0.0.1:8000/tickets/";

  if (user?.role === "Customer") {

    url =
      `http://127.0.0.1:8000/tickets/customer/${user.email}`;

  }

  else if (user?.role === "Agent") {

    url =
      `http://127.0.0.1:8000/tickets/agent/${user.email}`;

  }

  const res = await fetch(url);

  const data = await res.json();

  setTickets(data);
};

  useEffect(() => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (user?.role) {
    setRole(user.role);
  }

  fetchTickets();
fetch(
  "http://127.0.0.1:8000/users/agents"
)
  .then(res => res.json())
  .then(data => setAgents(data));
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addTicket = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/tickets/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) throw new Error();

      fetchTickets();

      setFormData({
        customer_id: "",
        issue: "",
        priority: "Low",
        status: "Open"
      });

    } catch {
      alert("Unable to create ticket");
    }
  };

  const editTicket = (ticket) => {
    setEditId(ticket.id);

    setFormData({
      customer_id: ticket.customer_id,
      issue: ticket.issue,
      priority: ticket.priority,
      status: ticket.status
    });
  };

  const updateTicket = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tickets/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) throw new Error();

      setEditId(null);

      setFormData({
        customer_id: "",
        issue: "",
        priority: "Low",
        status: "Open"
      });

      fetchTickets();

    } catch {
      alert("Unable to update ticket");
    }
  };

  const deleteTicket = async (id) => {

    if (!window.confirm("Delete ticket?"))
      return;

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/tickets/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok)
        throw new Error();

      fetchTickets();

    } catch {

      alert("Unable to delete ticket");

    }

  };
const assignAgent = async (
  ticketId,
  agentEmail
) => {

  try {

    await fetch(
      `http://127.0.0.1:8000/tickets/assign/${ticketId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          agent: agentEmail
        })
      }
    );

    fetchTickets();

  } catch (err) {

    console.error(err);

  }

};
  const getStatusColor = (status) => {
    if (status === "Open") return "#ef4444";
    if (status === "Pending") return "#f59e0b";
    return "#22c55e";
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return "#ef4444";
    if (priority === "Medium") return "#f59e0b";
    return "#22c55e";
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.issue
        .toLowerCase()
        .includes(search.toLowerCase())
  );
console.log("ROLE =", role);
  return (
    <div className="container">

  <Sidebar />

  <main className="main">

    <div className="page-content">

        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "20px"
          }}
        >
          🎫 Tickets
        </h1>

        <h3 style={{ marginBottom: "15px" }}>
          Total Tickets: {tickets.length}
        </h3>

        <input
          type="text"
          placeholder="Search Ticket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "20px",
            background: "#1e293b",
            color: "white"
          }}
        />

{role === "Admin" && (

  <div
    style={{
      background: "#0f172a",
      padding: "25px",
      borderRadius: "20px",
      marginBottom: "25px",
      border: "1px solid #1e293b"
    }}
  >

    <h2 style={{ marginBottom: "20px" }}>
      {editId ? "Update Ticket" : "Add Ticket"}
    </h2>

    <form
      onSubmit={editId ? updateTicket : addTicket}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: "15px"
      }}
    >

            <input
              type="number"
              name="customer_id"
              placeholder="Customer ID"
              value={formData.customer_id}
              onChange={handleChange}
              style={inputStyle}
              required
            />

            <input
              type="text"
              name="issue"
              placeholder="Issue"
              value={formData.issue}
              onChange={handleChange}
              style={inputStyle}
              required
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Open</option>
              <option>Pending</option>
              <option>Resolved</option>
            </select>

<button
  type="submit"
  style={buttonStyle}
>
  {editId ? "Update Ticket" : "Add Ticket"}
</button>

    </form>

  </div>

)}

        </div>

        <div
          style={{
            background: "#0f172a",
            borderRadius: "20px",
            padding: "25px",
            border: "1px solid #1e293b",
            overflow: "hidden"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>ID</th>
                <th style={headerStyle}>Customer ID</th>
                <th style={headerStyle}>Issue</th>
                <th style={headerStyle}>Priority</th>
                <th style={headerStyle}>Status</th>
                {role === "Admin" && (
  <th style={headerStyle}>Actions</th>
)}
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  style={{
                    borderBottom: "1px solid #1e293b"
                  }}
                >
                  <td style={cellStyle}>#{ticket.id}</td>

                  <td style={cellStyle}>
                    {ticket.customer_id}
                  </td>

                  <td style={cellStyle}>
                    {ticket.issue}
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        background: getPriorityColor(ticket.priority),
                        padding: "6px 12px",
                        borderRadius: "999px"
                      }}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        background: getStatusColor(ticket.status),
                        padding: "6px 12px",
                        borderRadius: "999px"
                      }}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  {role === "Admin" && (

 <td style={cellStyle}>

  <select
    onChange={(e) =>
      assignAgent(
        ticket.id,
        e.target.value
      )
    }
    style={{
      padding: "8px",
      borderRadius: "8px",
      marginRight: "10px"
    }}
  >
    <option>
      Assign Agent
    </option>

    {agents.map(agent => (

      <option
        key={agent.id}
        value={agent.email}
      >
        {agent.name}
      </option>

    ))}
  </select>

  <button
    type="button"
    onClick={() => editTicket(ticket)}
    style={editBtn}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => deleteTicket(ticket.id)}
    style={deleteBtn}
  >
    Delete
  </button>

</td>

)}
                </tr>
              ))}
            </tbody>

          </table>

            </div>

  </main>

</div>
  );

}

const inputStyle = {
  background: "#1e293b",
  border: "none",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  outline: "none"
};

const buttonStyle = {
  gridColumn: "span 2",
  background: "#4f46e5",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer"
};

const editBtn = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  marginRight: "10px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const headerStyle = {
  textAlign: "left",
  padding: "18px",
  color: "#94a3b8",
  fontSize: "14px",
  textTransform: "uppercase",
  borderBottom: "1px solid #1e293b"
};

const cellStyle = {
  padding: "20px 18px",
  fontSize: "16px"
};

export default Tickets;
