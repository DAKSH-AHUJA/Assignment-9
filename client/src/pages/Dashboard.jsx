import { useEffect, useState } from "react";
import { api, getToken } from "../api/api.js";
import StatCard from "../components/StatCard.jsx";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/dashboard").then(setData).catch(console.log);
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  const exportUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/dashboard/export/logs.csv?token=${getToken()}`;

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Quick look at visitors, passes and check logs.</p>
        </div>
        <a className="small-btn" href={exportUrl}>
          Export CSV
        </a>
      </div>

      <div className="stats-grid">
        <StatCard label="Users" value={data.users} />
        <StatCard label="Visitors" value={data.visitors} />
        <StatCard label="Appointments" value={data.appointments} />
        <StatCard label="Total Passes" value={data.passes} />
        <StatCard label="Active Passes" value={data.activePasses} />
        <StatCard label="Scan Logs" value={data.logs} />
      </div>

      <div className="panel">
        <h3>Recent Check Logs</h3>
        <table>
          <thead>
            <tr><th>Visitor</th><th>Action</th><th>Gate</th><th>Time</th></tr>
          </thead>
          <tbody>
            {data.recentLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.visitor?.name}</td>
                <td><span className="pill">{log.action}</span></td>
                <td>{log.location}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
