import React from "react";
import Header from "./Header";
import Container from "react-bootstrap/Container";

function UserTemplate({ Component }) {
  return (
    <>
      <Header />
      <Container>
        <Component />
      </Container>
    </>
  );
}

export default UserTemplate;
