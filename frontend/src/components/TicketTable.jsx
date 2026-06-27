import React, { useEffect, useState } from "react";

function StatusPill({ status }) {

  const s = status.toLowerCase();

  return (
    <span className={`status ${s}`}>
      <span className="dot-sm" />
      {status}
    </span>
  );
}

export default function TicketTable() {

  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const [selectedStatus, setSelectedStatus] =useState("Open");
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    let url =
      "http://127.0.0.1:8000/tickets/";

    if (user?.role === "Agent") {

      url =
        `http://127.0.0.1:8000/tickets/agent/${user.email}`;

    } else if (user?.role === "Customer") {

      url =
        `http://127.0.0.1:8000/tickets/customer/${user.email}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {

        console.log(data);

        setTickets(data);

      })
      .catch((err) => {
        console.error(err);
      });

  }, []);
  const sendReply = async () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  await fetch(
    "http://127.0.0.1:8000/replies/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ticket_id: selectedTicket,
        sender: user.role,
        message: replyText
      })
    }
  );

  alert("Reply sent successfully.");

  setReplyText("");
  setShowReply(false);
};
  const updateStatus = async () => {

  await fetch(

    `http://127.0.0.1:8000/tickets/status/${selectedTicket}`,

    {

      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        status: selectedStatus

      })

    }

  );

  alert("Status Updated");

  window.location.reload();

};
  return (
    <div
      className="card"
      style={{
        width: "100%",
        overflowX: "auto"
      }}
    >

      <div className="head">
        <h3>Recent Tickets</h3>
      </div>

      <table
        className="table"
        style={{
          width: "100%"
        }}
      >

        <thead>
          <tr>
            <th>ID</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {tickets.map((ticket) => (

            <tr key={ticket.id}>

              <td>
                #{ticket.id}
              </td>

              <td
                style={{
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
                title={ticket.issue}
              >
                {ticket.issue}
              </td>

              <td>
                <StatusPill
                  status={ticket.status}
                />
              </td>

              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "8px"
                  }}
                >

                  <button
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      marginRight: "8px"
                    }}
                    onClick={() => {
                      setSelectedTicket(ticket.id);
                      setShowReply(true);
                    }}
                  >
                  Reply
                  </button>

                  <button
                    style={{
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                    onClick={() => {

                      setSelectedTicket(ticket.id);

                      setSelectedStatus(ticket.status);

                      setShowStatus(true);

                  }}
                  >
                  Status
                  </button>

                </div>
              </td>

            </tr>

          ))}

        </tbody>

      </table>
            {showReply && (

<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}
>

<div
  style={{
    background: "#1f2937",
    padding: "30px",
    width: "450px",
    borderRadius: "12px"
  }}
>

<h2 style={{color:"white"}}>
Reply to Customer
</h2>

<textarea
  value={replyText}
  onChange={(e)=>setReplyText(e.target.value)}
  rows={6}
  style={{
    width:"100%",
    marginTop:"20px",
    background:"#111827",
    color:"white",
    padding:"12px",
    borderRadius:"8px"
  }}
/>

<div
style={{
display:"flex",
justifyContent:"flex-end",
marginTop:"20px",
gap:"10px"
}}
>

<button
onClick={()=>setShowReply(false)}
>
Cancel
</button>

<button
onClick={sendReply}
>
Send
</button>

</div>

</div>

</div>

)}
            {showStatus && (

<div
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,.6)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}
>

<div
style={{
background:"#1f2937",
padding:"30px",
borderRadius:"12px",
width:"350px"
}}
>

<h2 style={{color:"white"}}>
Change Status
</h2>

<select

value={selectedStatus}

onChange={(e)=>
setSelectedStatus(
e.target.value
)}

style={{
width:"100%",
padding:"12px",
marginTop:"20px"
}}

>

<option>Open</option>

<option>In Progress</option>

<option>Resolved</option>

</select>

<div
style={{
display:"flex",
justifyContent:"flex-end",
marginTop:"20px",
gap:"10px"
}}
>

<button
onClick={()=>
setShowStatus(false)
}
>
Cancel
</button>

<button
onClick={updateStatus}
>
Update
</button>

</div>

</div>

</div>

)}
    </div>
  );
}