import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar nav */}
      <aside style={{ width: "220px", background: "#333", color: "#fff", padding: "20px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Admin Dashboard</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>Reservations</Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/admin/newsletter" style={{ color: "#fff", textDecoration: "none" }}>Newsletter</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}








