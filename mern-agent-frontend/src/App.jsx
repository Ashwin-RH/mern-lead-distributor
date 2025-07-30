import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddAgent from "./pages/AddAgent";
import UploadLeads from "./pages/UploadLeads";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import AdminRoute from "./routes/AdminRoute";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  console.log("👤 Logged-in user state:", user);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const hideNavbarRoutes = ["/login"];
  const shouldShowNavbar = user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route
  path="/login"
  element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />}
/>

  
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute user={user}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/add-agent"
    element={
      <ProtectedRoute user={user} adminOnly={true}>
        <AddAgent />
      </ProtectedRoute>
    }
  />
  <Route
    path="/upload-leads"
    element={
      <ProtectedRoute user={user} adminOnly={true}>
        <UploadLeads />
      </ProtectedRoute>
    }
  />
  <Route
    path="/leads"
    element={
      <ProtectedRoute user={user}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
