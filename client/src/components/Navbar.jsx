import { CalendarCheck, Home, IdCard, LogOut, QrCode, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getUser, logout } from "../api/api.js";

export default function Navbar() {
  const user = getUser();

  const links = [
    { to: "/", text: "Dashboard", icon: Home },
    { to: "/visitors", text: "Visitors", icon: Users },
    { to: "/appointments", text: "Appointments", icon: CalendarCheck },
    { to: "/passes", text: "Passes", icon: IdCard },
    { to: "/scanner", text: "Scanner", icon: QrCode }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"></div>
        <div>
          <h1>Pass Management System</h1>
          <p>{user?.role || "guest"}</p>
        </div>
      </div>

      <nav>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              <Icon size={18} />
              <span>{item.text}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
