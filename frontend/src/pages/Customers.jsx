import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active"
  });

  const fetchCustomers = () => {
    fetch("http://127.0.0.1:8000/customers/")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const addCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/customers/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "Active"
      });

      fetchCustomers();

    } catch (error) {
      console.error(error);
      alert("Unable to create customer");
    }
  };

  const editCustomer = (customer) => {
    setEditId(customer.id);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    });
  };

  const updateCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/customers/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setEditId(null);

      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "Active"
      });

      fetchCustomers();

    } catch (error) {
      console.error(error);
      alert("Unable to update customer");
    }
  };

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/customers/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      fetchCustomers();

    } catch (error) {
      console.error(error);
      alert("Unable to delete customer");
    }
  };

  const filteredCustomers =
    customers.filter((customer) =>
      customer.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

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

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <h1 style={{ fontSize: "42px", fontWeight: "700" }}>
            👥 Customers
          </h1>

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "300px",
              background: "#1e293b",
              border: "none",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              outline: "none"
            }}
          />
        </div>

        <div style={{
          marginBottom: "20px",
          color: "#94a3b8",
          fontSize: "16px"
        }}>
          Total Customers: <span style={{ color: "#4f46e5", fontWeight: "700" }}>
            {customers.length}
          </span>
        </div>

        <div style={{
          background: "#0f172a",
          padding: "25px",
          borderRadius: "20px",
          marginBottom: "30px",
          border: "1px solid #1e293b"
        }}>

          <h2 style={{ marginBottom: "20px" }}>
            {editId ? "Update Customer" : "Add Customer"}
          </h2>

          <form
            onSubmit={editId ? updateCustomer : addCustomer}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "15px"
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Enter a valid email address"
              style={inputStyle}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              title="Phone number must be exactly 10 digits"
              style={inputStyle}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <button
              type="submit"
              style={{
                gridColumn: "span 2",
                background: "#4f46e5",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px"
              }}
            >
              {editId ? "Update Customer" : "Add Customer"}
            </button>
          </form>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: "20px"
        }}>
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #1e293b"
              }}
            >
              <h3 style={{ marginBottom: "15px", fontSize: "22px" }}>
                👤 {customer.name}
              </h3>

              <p><strong>ID:</strong> {customer.id}</p>
              <p>📧 {customer.email}</p>
              <p>📱 {customer.phone}</p>

              <p style={{
                color: customer.status === "Active" ? "#22c55e" : "#ef4444",
                fontWeight: "600",
                marginTop: "12px"
              }}>
                Status: {customer.status}
              </p>

              <div style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px"
              }}>
                <button
                  onClick={() => editCustomer(customer)}
                  style={{
                    flex: 1,
                    background: "#3b82f6",
                    border: "none",
                    color: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCustomer(customer.id)}
                  style={{
                    flex: 1,
                    background: "#ef4444",
                    border: "none",
                    color: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

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

export default Customers;
