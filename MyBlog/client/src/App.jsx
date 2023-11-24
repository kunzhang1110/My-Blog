import React from "react";
import { Container } from "reactstrap";
import { Outlet } from "react-router";
import { NavMenu } from "./components/NavMenu";

export default function App() {
  return (
    <>
      <NavMenu />
      <Container fluid>
        <Outlet />
      </Container>
    </>
  );
}
