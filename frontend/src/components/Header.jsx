import React, {
  useState,
  useEffect
} from "react";

import { useNavigate }
from "react-router-dom";

export default function Header() {

  const [search, setSearch] =
    useState("");

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  const [notifications,
    setNotifications] =
    useState([]);

  const navigate =
    useNavigate();

  useEffect(() => {

    fetch(
      "http://127.0.0.1:8000/notifications/"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);

  const handleSearch = (e) => {

    if (e.key !== "Enter")
      return;

    const value =
      search.toLowerCase();

    if (
      value.includes(
        "customer"
      )
    ) {
      navigate(
        "/customers"
      );
    }

    else if (
      value.includes(
        "ticket"
      )
    ) {
      navigate(
        "/tickets"
      );
    }

    else if (
      value.includes(
        "analytics"
      )
    ) {
      navigate(
        "/analytics"
      );
    }

    else if (
      value.includes(
        "settings"
      )
    ) {
      navigate(
        "/settings"
      );
    }

    else if (
      value.includes(
        "chat"
      )
    ) {
      navigate(
        "/chat"
      );
    }

    else {
      alert(
        "No matching page found"
      );
    }

  };

  return (
    <header
      className="header"
      style={{
        position:
          "relative"
      }}
    >

      <div
        className="page-title"
      >
        <div>

          <h1>
            Support Platform
          </h1>

          <div
            className="subtitle"
          >
            Manage customers,
            tickets,
            and AI assistance.
          </div>

        </div>
      </div>

      <div
        className="search"
      >

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 21l-4.3-4.3"
            stroke="#9aa3c7"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="#9aa3c7"
            strokeWidth="2"
          />
        </svg>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          onKeyDown={
            handleSearch
          }
        />

        <span
          className="kbd"
        >
          ⌘ K
        </span>

      </div>

      <div
        className="actions"
      >

        <button
          className="icon-btn"
          onClick={() =>
            setShowNotifications(
              !showNotifications
            )
          }
        >

          <span
            className="badge"
          >
            {
              notifications.length
            }
          </span>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2h18l-2-2Z"
              stroke="#c7d0ff"
              strokeWidth="1.6"
            />
          </svg>

        </button>

        <button
          className="icon-btn"
        >

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 3v18M3 12h18"
              stroke="#c7d0ff"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

        </button>

      </div>

      {showNotifications && (

        <div
          style={{
            position:
              "absolute",
            top: "70px",
            right: "80px",
            width: "320px",
            background:
              "#0f172a",
            border:
              "1px solid #1e293b",
            borderRadius:
              "12px",
            padding: "15px",
            zIndex: 999
          }}
        >

          <h4
            style={{
              marginBottom:
                "12px"
            }}
          >
            Notifications
          </h4>

          {
            notifications.length === 0
            ? (
              <p>
                No notifications
              </p>
            )
            : (
              notifications.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    style={{
                      padding:
                        "10px 0",
                      borderBottom:
                        "1px solid #1e293b"
                    }}
                  >
                    {
                      item.message
                    }
                  </div>
                )
              )
            )
          }

        </div>

      )}

    </header>
  );
}