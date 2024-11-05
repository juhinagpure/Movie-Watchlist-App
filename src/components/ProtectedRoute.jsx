import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
