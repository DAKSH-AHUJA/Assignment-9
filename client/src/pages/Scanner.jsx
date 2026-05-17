import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";
import { api } from "../api/api.js";

export default function Scanner() {
  const [action, setAction] = useState("check-in");
  const [location, setLocation] = useState("Main Gate");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [qrFile, setQrFile] = useState(null);

  async function scan(e) {
    e.preventDefault();
    setMessage("");
    setResult(null);

    try {
      const reader = new Html5Qrcode("qr-reader");
      // Daksh: this reads the QR image and gives us the hidden QR text.
      const qrText = await reader.scanFile(qrFile, false);
      await reader.clear();

      const data = await api("/checklogs/scan", {
        method: "POST",
        body: JSON.stringify({ qrText, action, location })
      });
      setResult(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Scanner</h2>
          <p>Verify pass QR codes and record visitor movement.</p>
        </div>
      </div>

      <div className="scanner-layout">
        <form className="panel" onSubmit={scan}>
          <label className="upload-box">
            Upload QR Image
            <input required type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files[0])} />
          </label>
          <div id="qr-reader"></div>
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <div className="segmented">
            <button type="button" className={action === "check-in" ? "active" : ""} onClick={() => setAction("check-in")}>Check In</button>
            <button type="button" className={action === "check-out" ? "active" : ""} onClick={() => setAction("check-out")}>Check Out</button>
          </div>
          <button>Submit Scan</button>
          {message && <p className="error">{message}</p>}
        </form>

        <div className="panel">
          <h3>Last Scan</h3>
          {result ? (
            <table>
              <tbody>
                <tr><th>Visitor</th><td>{result.visitor}</td></tr>
                <tr><th>Action</th><td>{result.action}</td></tr>
                <tr><th>Location</th><td>{result.location}</td></tr>
                <tr><th>Time</th><td>{new Date(result.createdAt).toLocaleString()}</td></tr>
              </tbody>
            </table>
          ) : (
            <p>No scan recorded yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
