import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { ArticleCard } from "../components/ArticleCard";
import { Spinner } from "../components/Spinner";
import { ScrollUpArrow } from "../components/ScrollUpArrow";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { useAppContext } from "../shared/appContext";

export const ArticleSinglePage = () => {
  const [article, setArticle] = useState("");
  const { api } = useAppContext();
  const { articleUrlId } = useParams();

  const getArticle = useCallback(() => {
    api.articles.getArticle(articleUrlId).then((data) => setArticle(data));
  }, [api.articles, articleUrlId]);

  useEffect(() => {
    getArticle();
  }, [getArticle]);

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
              updatePageComponent={getArticle}
              articleUrlId={articleUrlId}
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
