import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ element: Component }) => {
  const { user } = useContext(AuthContext);
  return user ? Component : <Navigate to={"/"} />;
};

export default PrivateRoute;
