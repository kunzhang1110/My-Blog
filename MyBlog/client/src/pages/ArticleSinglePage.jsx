import React from "react";
import { useParams, useLoaderData } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { ArticleCard } from "../components/ArticleCard";
import { Spinner } from "../components/Spinner";
import { ScrollUpArrow } from "../components/ScrollUpArrow";
import { AppBreadCrumb } from "../components/AppBreadCrumb";

export const ArticleSinglePage = () => {
  const { articleUrlId } = useParams();
  const article = useLoaderData();

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
          {article !== "" ? (
            <ArticleCard
              article={article}
              articleUrlId={articleUrlId}
              isSinglePage
            />
          ) : (
            <Spinner fullPage />
          )}
        </Col>
        <Col
          lg={{
            size: 1,
          }}
        >
          <div
            style={{
              position: "fixed",
              bottom: 10,
            }}
          >
            <ScrollUpArrow />
          </div>
        </Col>
      </Row>
    </>
  );
};
