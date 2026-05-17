import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization: "Main Office",
    department: ""
  });
  const [message, setMessage] = useState("");

  function changeInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...form, role: "visitor" })
      });
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
        <h1>Create Visitor Account</h1>
        <p>Register to request and manage visitor passes.</p>
        <input name="name" placeholder="Name" value={form.name} onChange={changeInput} />
        <input name="email" placeholder="Email" value={form.email} onChange={changeInput} />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={changeInput} />
        <input name="organization" placeholder="Organization" value={form.organization} onChange={changeInput} />
        <input name="department" placeholder="Department" value={form.department} onChange={changeInput} />
        <button>Create Account</button>
        {message && <p className="error">{message}</p>}
        <Link to="/login">Already have an account?</Link>
      </form>
    </div>
  );
}
