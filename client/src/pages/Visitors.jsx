import { useEffect, useState } from "react";
import { api, uploadUrl } from "../api/api.js";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", purpose: "", photo: null });
  const [message, setMessage] = useState("");

  async function load() {
    const data = await api(`/visitors?search=${search}`);
    setVisitors(data);
  }

  useEffect(() => {
    load().catch(console.log);
  }, []);

  function changeInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("company", form.company);
    data.append("purpose", form.purpose);
    if (form.photo) data.append("photo", form.photo);

    try {
      await api("/visitors", { method: "POST", body: data });
      setForm({ name: "", email: "", phone: "", company: "", purpose: "", photo: null });
      e.target.reset();
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(id) {
    try {
      await api(`/visitors/${id}`, { method: "DELETE" });
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Visitors</h2>
          <p>Add visitors and keep their details ready for pass creation.</p>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={submit}>
        <input required name="name" placeholder="Name" value={form.name} onChange={changeInput} />
        <input required name="email" placeholder="Email" value={form.email} onChange={changeInput} />
        <input required name="phone" placeholder="Phone" value={form.phone} onChange={changeInput} />
        <input name="company" placeholder="Company" value={form.company} onChange={changeInput} />
        <input required name="purpose" placeholder="Purpose" value={form.purpose} onChange={changeInput} />
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
        <button>Add Visitor</button>
      </form>

      <div className="panel">
        <div className="search-row">
          <input placeholder="Search visitors" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" onClick={load}>Search</button>
        </div>
        {message && <p className="error">{message}</p>}
        <div className="card-grid">
          {visitors.map((visitor) => (
            <article className="visitor-card" key={visitor._id}>
              <div className="avatar">
                {visitor.photo ? <img src={`${uploadUrl}${visitor.photo}`} alt={visitor.name} /> : visitor.name.charAt(0)}
              </div>
              <h3>{visitor.name}</h3>
              <p>{visitor.email}</p>
              <p>{visitor.phone}</p>
              <p>{visitor.company}</p>
              <p>{visitor.purpose}</p>
              <button type="button" onClick={() => remove(visitor._id)}>Delete</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
