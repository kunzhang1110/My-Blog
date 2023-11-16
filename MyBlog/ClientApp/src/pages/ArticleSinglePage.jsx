import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { ArticleCard } from "../components/ArticleCard";
import { Spinner } from "../components/Spinner";
import { ScrollUpArrow } from "../components/ScrollUpArrow";

export const ArticleSinglePage = () => {
  const [article, setArticle] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
      });
  }, [id]);

  return (
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
        {article !== "" ? (
          <ArticleCard article={article} id={id} />
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
  );
};
