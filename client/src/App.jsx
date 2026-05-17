import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-area">
        <Outlet />
      </main>
    </div>
  );
}
