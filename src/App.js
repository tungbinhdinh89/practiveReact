import "./App.scss";
import TableUsers from "./components/TableUsers";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserTemplate from "./components";
import Login from "./components/Login";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";

function App() {
  const { user, loginContext } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(
        localStorage.getItem("email"),
        localStorage.getItem("token")
      );
    }
  }, []);
  return (
    <>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<UserTemplate Component={Home} />} />
          <Route
            path="/users"
            element={<UserTemplate Component={TableUsers} />}
          />
          <Route path="/login" element={<UserTemplate Component={Login} />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
