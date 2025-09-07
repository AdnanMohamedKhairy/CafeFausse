// src/pages/Admin.js
import React, { useEffect, useState, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ADMIN_TOKEN = "secret123"; // match backend token

export default function Admin() {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({ date: "", customer: "", table: "" });
  const [sortBy, setSortBy] = useState("time");      // "time" or "table"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async (opts = {}) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("token", ADMIN_TOKEN);
    params.set("page", opts.page ?? page);
    params.set("per_page", opts.per_page ?? perPage);
    if (filters.date) params.set("date", filters.date);
    if (filters.customer) params.set("customer", filters.customer);
    if (filters.table) params.set("table", filters.table);
    params.set("sort_by", sortBy);
    params.set("sort_order", sortOrder);

    try {
      const res = await fetch(`${API_URL}/api/admin/reservations?${params.toString()}`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load reservations");
      setReservations(data.reservations || []);
      setTotal(Number.isFinite(data.total) ? Number(data.total) : parseInt(data.total || "0", 10));
      setPage(data.page || (opts.page ?? page));
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters, sortBy, sortOrder]);

  // fetch on mount and whenever page/perPage/filters/sort change
  useEffect(() => {
    fetchReservations({ page, per_page: perPage });
  }, [fetchReservations, page, perPage, filters, sortBy, sortOrder]);

  // When filters/sort change, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [filters.date, filters.customer, filters.table, sortBy, sortOrder, perPage]);

  // safe totalPages calculation (avoids NaN)
  const totalPages = total > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;

  // sortedReservations is simply what backend returned (backend already sorts),
  // but keep local sort fallback in case backend doesn't.
  const displayed = [...reservations];

  async function handleExportCSV() {
    try {
      // fetch all rows by requesting per_page=total (or a large number)
      const params = new URLSearchParams();
      params.set("token", ADMIN_TOKEN);
      params.set("page", 1);
      params.set("per_page", Math.max(total, 1000)); // request all; adjust as needed
      if (filters.date) params.set("date", filters.date);
      if (filters.customer) params.set("customer", filters.customer);
      if (filters.table) params.set("table", filters.table);
      params.set("sort_by", sortBy);
      params.set("sort_order", sortOrder);

      const res = await fetch(`${API_URL}/api/admin/reservations?${params.toString()}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch for export");

      const rows = data.reservations || [];
      const csvHeader = ["ID", "Time Slot", "Table", "Party Size", "Customer", "Email"];
      const csvRows = rows.map(r =>
        [
          r.id,
          r.time_slot,
          r.table_number,
          r.party_size,
          (r.customer && r.customer.name) || "",
          (r.customer && r.customer.email) || ""
        ].map(col => `"${String(col).replace(/"/g, '""')}"`).join(",")
      );
      const csvContent = [csvHeader.join(","), ...csvRows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reservations_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export CSV error:", err);
      alert("Export failed: " + String(err.message || err));
    }
  }

  // toggle sort order when clicking sort button
  function toggleSort(field) {
    if (sortBy === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — Reservations</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Date:
          <input type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
        </label>

        <label>
          Customer:
          <input type="text" placeholder="Name" value={filters.customer} onChange={e => setFilters(f => ({ ...f, customer: e.target.value }))} />
        </label>

        <label>
          Table:
          <input type="number" min="1" max="100" value={filters.table} onChange={e => setFilters(f => ({ ...f, table: e.target.value }))} style={{ width: 90 }} />
        </label>

        <label>
          Per page:
          <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </label>

        <div>
          <button type="button" onClick={() => toggleSort("time")}>Sort by Time {sortBy === "time" ? `(${sortOrder})` : ""}</button>
          <button type="button" onClick={() => toggleSort("table")}>Sort by Table {sortBy === "table" ? `(${sortOrder})` : ""}</button>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <button onClick={handleExportCSV}>Export CSV</button>
        </div>
      </div>

      {loading ? <div>Loading…</div> : null}
      {error ? <div style={{ color: "red" }}>{error}</div> : null}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f2f2f2" }}>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Time Slot</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Table</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Party</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Customer</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {displayed.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 12, textAlign: "center" }}>No reservations found.</td></tr>
          ) : (
            displayed.map(r => (
              <tr key={r.id}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.id}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{new Date(r.time_slot).toLocaleString()}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.table_number}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.party_size}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.customer?.name || "—"}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.customer?.email || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
        <div> Page {page} of {totalPages} </div>
        <button onClick={() => setPage(p => (p < totalPages ? p + 1 : p))} disabled={page >= totalPages}>Next</button>
        <div style={{ marginLeft: "auto" }}>Total: {total}</div>
      </div>
    </div>
  );
}
