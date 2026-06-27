import React from "react";

export default function StatCard({ title, value, trend, trendDir = "up" }) {
  return (
    <div className="card">
      <div className="head">
        <h3>{title}</h3>
        <span className={`trend ${trendDir}`}>{trend}</span>
      </div>
      <div className="value">{value}</div>
    </div>
  );
}
