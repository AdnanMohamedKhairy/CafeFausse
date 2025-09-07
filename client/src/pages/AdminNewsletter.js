import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ADMIN_TOKEN = "secret123";

export default function AdminNewsletter() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/newsletter?token=${ADMIN_TOKEN}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to load subscribers");
        setSubs(data.subscribers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  if (loading) return <div>Loading subscribers…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — Newsletter Subscribers</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f2f2f2" }}>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {subs.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                No subscribers found.
              </td>
            </tr>
          ) : (
            subs.map(s => (
              <tr key={s.id}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{s.id}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{s.name}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{s.email}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{s.phone || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
