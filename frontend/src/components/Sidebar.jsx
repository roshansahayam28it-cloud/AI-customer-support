
import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  LogOut
} from "lucide-react";

const NavButton = ({
  active,
  label,
  onClick
}) => (
  <button
    onClick={onClick}
    className={active ? "active" : ""}
  >
    <span className="dot" />
    <span className="label">
      {label}
    </span>
  </button>
);

export default function Sidebar() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [user, setUser] =
    useState({
      name: "",
      email: "",
      role: ""
    });

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");

  };

  return (

    <aside
  className="sidebar"
  style={{
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    width: "220px",
    overflow: "hidden"
  }}
>

      {/* Logo */}

      <div className="brand">

        <div className="logo">
          AI
        </div>

        <div className="name">
          AI Supporter
        </div>

      </div>

      {/* Navigation */}

      <nav className="nav">

        <NavButton
          active={
            location.pathname === "/" ||
            location.pathname === "/dashboard"
          }
          label="Dashboard"
          onClick={() =>
            navigate("/dashboard")
          }
        />

        <NavButton
          active={
            location.pathname === "/chat"
          }
          label="AI Chat"
          onClick={() =>
            navigate("/chat")
          }
        />

        {user.role === "Customer" ? (

  <NavButton
    active={
      location.pathname === "/mytickets"
    }
    label="My Tickets"
    onClick={() =>
      navigate("/mytickets")
    }
  />

) : (

  <NavButton
    active={
      location.pathname === "/tickets"
    }
    label="Tickets"
    onClick={() =>
      navigate("/tickets")
    }
  />

)}

        {/* ADMIN ONLY */}

        {user.role === "Admin" && (
          <NavButton
            active={
              location.pathname === "/customers"
            }
            label="Customers"
            onClick={() =>
              navigate("/customers")
            }
          />
        )}

        {user.role === "Admin" && (
          <NavButton
            active={
              location.pathname === "/analytics"
            }
            label="Analytics"
            onClick={() =>
              navigate("/analytics")
            }
          />
        )}

        {user.role === "Admin" && (
          <NavButton
            active={
              location.pathname === "/settings"
            }
            label="Settings"
            onClick={() =>
              navigate("/settings")
            }
          />
        )}

      </nav>

      <div className="spacer" />

      {/* User Card */}

      <div className="user-mini">

        <img
          src="https://i.pravatar.cc/100?img=32"
          alt="User"
        />

        <div>

          <div
            style={{
              fontWeight: 700
            }}
          >
            {user.name}
          </div>

          <div className="meta">
            {user.role}
          </div>

        </div>

      </div>

      {/* Logout */}

      <button
        onClick={logout}
        style={{
          marginTop: "12px",
          width: "100%",
          background: "#ef4444",
          border: "none",
          color: "white",
          padding: "12px",
          borderRadius: "12px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px"
        }}
      >

        <LogOut size={18} />

        Logout

      </button>

    </aside>

  );

}
