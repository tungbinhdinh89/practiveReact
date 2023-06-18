import { Routes, Route } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";

const PrivateRoute = (props) => {
  const { user } = useContext(UserContext);
  if (user && !user.auth) {
    return (
      <>
        <Header />
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>You don't have permisson to access this route</p>
        </Alert>
      </>
    );
  }
  return props.children;
};

export default PrivateRoute;
