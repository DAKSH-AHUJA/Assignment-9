import { useEffect, useState } from "react";
import { api, uploadUrl } from "../api/api.js";

export default function Passes() {
  const [passes, setPasses] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({ visitorId: "", validTo: "" });
  const [message, setMessage] = useState("");

  function load() {
    api("/passes").then(setPasses).catch(console.log);
    api("/visitors").then(setVisitors).catch(console.log);
  }

  useEffect(load, []);

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api("/passes", { method: "POST", body: JSON.stringify(form) });
      setForm({ visitorId: "", validTo: "" });
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Passes</h2>
          <p>Issue visitor passes and download badge PDFs.</p>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={submit}>
        <select required value={form.visitorId} onChange={(e) => setForm({ ...form, visitorId: e.target.value })}>
          <option value="">Select visitor</option>
          {visitors.map((visitor) => <option key={visitor._id} value={visitor._id}>{visitor.name}</option>)}
        </select>
        <input required type="datetime-local" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
        <button>Issue Pass</button>
      </form>

      {message && <p className="error">{message}</p>}

      <div className="pass-grid">
        {passes.map((pass) => (
          <article className="pass-card" key={pass._id}>
            <h3>{pass.visitor?.name}</h3>
            <p>{pass.visitor?.email}</p>
            <span className={`pill ${pass.status}`}>{pass.status}</span>
            <p>Valid to: {new Date(pass.validTo).toLocaleString()}</p>
            {pass.qrImage && <img className="qr-image" src={pass.qrImage} alt="Pass QR code" />}
            {pass.pdfPath && (
              <a className="small-btn" href={`${uploadUrl}${pass.pdfPath}`} target="_blank" rel="noreferrer">
                Download PDF
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
