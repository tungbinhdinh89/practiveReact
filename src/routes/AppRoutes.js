import { Routes, Route } from "react-router-dom";
import UserTemplate from "../components";
import TableUsers from "../components/TableUsers";
import Home from "../components/Home";
import Login from "../components/Login";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserTemplate Component={Home} />} />
        <Route path="/login" element={<UserTemplate Component={Login} />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserTemplate Component={TableUsers} />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
