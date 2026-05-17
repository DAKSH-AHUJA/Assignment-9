import { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", purpose: "", hostId: "", date: "" });
  const [message, setMessage] = useState("");

  function load() {
    api("/appointments").then(setAppointments).catch(console.log);
    api("/auth/users").then((list) => setUsers(list.filter((u) => u.role === "employee"))).catch(console.log);
  }

  useEffect(load, []);

  function changeInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await api("/appointments", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", email: "", phone: "", company: "", purpose: "", hostId: "", date: "" });
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api(`/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Appointments</h2>
          <p>Employees can invite visitors and approve requests.</p>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={submit}>
        <input required name="name" placeholder="Visitor name" value={form.name} onChange={changeInput} />
        <input required name="email" placeholder="Email" value={form.email} onChange={changeInput} />
        <input required name="phone" placeholder="Phone" value={form.phone} onChange={changeInput} />
        <input name="company" placeholder="Company" value={form.company} onChange={changeInput} />
        <input required name="purpose" placeholder="Purpose" value={form.purpose} onChange={changeInput} />
        <input required name="date" type="datetime-local" value={form.date} onChange={changeInput} />
        <select name="hostId" value={form.hostId} onChange={changeInput}>
          <option value="">Select host</option>
          {users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}
        </select>
        <button>Create Appointment</button>
      </form>

      {message && <p className="error">{message}</p>}

      <div className="panel">
        <table>
          <thead>
            <tr><th>Visitor</th><th>Host</th><th>Date</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item._id}>
                <td>{item.visitor?.name}</td>
                <td>{item.host?.name}</td>
                <td>{new Date(item.date).toLocaleString()}</td>
                <td><span className={`pill ${item.status}`}>{item.status}</span></td>
                <td className="row-actions">
                  <button onClick={() => updateStatus(item._id, "approved")}>Approve</button>
                  <button onClick={() => updateStatus(item._id, "rejected")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
