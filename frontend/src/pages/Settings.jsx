import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Settings() {

  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {

    const storedUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (storedUser) {
      setUser(storedUser);
    }

  }, []);

  return (
    <div className="container">

    <Sidebar />

    <main className="main">

        <div
            className="page-content"
            style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "30px",
                color: "white"
            }}
        >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "30px"
          }}
        >
          ⚙️ Settings
        </h1>

        <div
          style={{
            background: "#0f172a",
            borderRadius: "20px",
            padding: "30px",
            border: "1px solid #1e293b"
          }}
        >

          <h2
            style={{
              marginBottom: "25px"
            }}
          >
            Profile
          </h2>

          <div
            style={{
              marginBottom: "20px"
            }}
          >
            <label>Name</label>

            <input
              type="text"
              value={user.name}
              readOnly
              style={inputStyle}
            />
          </div>

          <div
            style={{
              marginBottom: "30px"
            }}
          >
            <label>Email</label>

            <input
              type="email"
              value={user.email}
              readOnly
              style={inputStyle}
            />
          </div>

          <h2
            style={{
              marginBottom: "20px"
            }}
          >
            AI Configuration
          </h2>

          <div
            style={{
              marginBottom: "20px"
            }}
          >
            <label>Model</label>

            <input
              type="text"
              value="Gemini 2.5 Flash"
              readOnly
              style={inputStyle}
            />
          </div>

          <div
            style={{
              marginBottom: "30px"
            }}
          >
            <label>Status</label>

            <input
              type="text"
              value="Active"
              readOnly
              style={{
                ...inputStyle,
                color: "#22c55e",
                fontWeight: "bold"
              }}
            />
          </div>

          <button
            style={{
              background: "#ef4444",
              border: "none",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Change Password
          </button>

        </div>
             </div>

    </main>

</div>
        );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  background: "#1e293b",
  border: "none",
  borderRadius: "10px",
  color: "white",
  outline: "none"
};

export default Settings;