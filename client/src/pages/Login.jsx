import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@demo.com", password: "123456" });
  const [message, setMessage] = useState("");

  function changeInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h1>Visitor Pass Login</h1>
        <p>Demo: admin@demo.com / 123456</p>
        <input name="email" placeholder="Email" value={form.email} onChange={changeInput} />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={changeInput} />
        <button>Login</button>
        {message && <p className="error">{message}</p>}
        <Link to="/register">Create visitor account</Link>
      </form>
    </div>
  );
}
