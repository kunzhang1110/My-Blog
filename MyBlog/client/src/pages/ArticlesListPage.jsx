import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import { SideBar } from "../components/SideBar";

import { ScrollUpArrow } from "../components/ScrollUpArrow";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { ArticleList } from "../components/ArticleList";

export const ArticlesListPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { category } = useParams();

  useEffect(() => {
    if (isAlertOpen) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 2000); //turn off alert in 2s
    }
  }, [isAlertOpen]);

  return (
    <>
      <Row>
        <Col
          xxl={{
            offset: 1,
            size: 2,
          }}
          xl={{
            size: 3,
          }}
        >
          <SideBar setIsAlertOpen={setIsAlertOpen} />
        </Col>
        <Col
          xxl={{
            size: 8,
          }}
          xl={{
            size: 9,
          }}
        >
          {category ? <AppBreadCrumb /> : null}
          <>
            <ArticleList category={category} />
          </>
        </Col>
        <Col
          xxl={{
            size: 1,
          }}
        >
          <ScrollUpArrow />
        </Col>
      </Row>
      <Alert color="info" isOpen={isAlertOpen} className="alert-top">
        Email Address Copied!
      </Alert>
    </>
  );
};
