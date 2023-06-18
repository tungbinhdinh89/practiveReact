import React from "react";
import Alert from "react-bootstrap/Alert";

function NotFound() {
  return (
    <Alert variant="warning" className="mt-3">
      <Alert.Heading>Hey, nice to see you</Alert.Heading>
      <p>The page you type have not found.</p>
      <hr />
      <p className="mb-0">
        Whenever you need to, be sure to use margin utilities to keep things
        nice and tidy.
      </p>
    </Alert>
  );
}

export default NotFound;
