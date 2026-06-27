import React, { useEffect, useState } from "react";

export default function ActivityFeed() {

  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/customers/")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.slice(-3));
      });

    fetch("http://127.0.0.1:8000/tickets/")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.slice(-3));
      });

  }, []);

  return (
    <div className="card">

      <div className="head">
        <h3>Recent Activity</h3>
      </div>

      <div className="activity">

        {customers.map((customer) => (

          <div
            className="item"
            key={`customer-${customer.id}`}
          >

            <span className="bullet" />

            <div>

              <div className="text">
                Customer "{customer.name}" added
              </div>

              <div className="time">
                Customer ID: {customer.id}
              </div>

            </div>

          </div>

        ))}

        {tickets.map((ticket) => (

          <div
            className="item"
            key={`ticket-${ticket.id}`}
          >

            <span className="bullet" />

            <div>

              <div className="text">
                Ticket #{ticket.id} created
              </div>

              <div className="time">
                Status: {ticket.status}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}