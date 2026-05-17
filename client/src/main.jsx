import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Appointments from "./pages/Appointments.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Passes from "./pages/Passes.jsx";
import Register from "./pages/Register.jsx";
import Scanner from "./pages/Scanner.jsx";
import Visitors from "./pages/Visitors.jsx";
import "./styles/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path="visitors" element={<Visitors />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="passes" element={<Passes />} />
              <Route path="scanner" element={<Scanner />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
