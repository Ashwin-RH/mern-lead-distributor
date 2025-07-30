import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
