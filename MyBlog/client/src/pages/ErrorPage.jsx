import React from "react";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";

export default function ErrorPage({ message }) {
  const { state } = useLocation();

  return (
    <>
      <Row>
        <Col
          xl={{
            offset: 1,
            size: 10,
          }}
          lg={{
            size: 12,
          }}
        >
          <AppBreadCrumb />
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "90vh" }}
          >
            <h1>{state.message ?? message}</h1>
          </div>
        </Col>
      </Row>
    </>
  );
}
