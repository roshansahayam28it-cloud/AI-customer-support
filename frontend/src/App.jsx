
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import "./App.css";

import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AIChat from "./pages/AIChat.jsx";
import Tickets from "./pages/Tickets.jsx";
import Customers from "./pages/Customers.jsx";
import Settings from "./pages/Settings.jsx";
import Analytics from "./pages/Analytics.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route
          path="/register"
          element={<Register />}
        />
       <Route
  path="/mytickets"
  element={
    <ProtectedRoute>
      <MyTickets />
    </ProtectedRoute>
  }
/>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Protected Routes */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ONLY */}

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Customers />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Settings />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

