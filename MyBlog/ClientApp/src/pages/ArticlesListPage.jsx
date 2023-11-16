import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { SideBar } from "../components/SideBar";
import { Spinner } from "../components/Spinner";
import { ScrollUpArrow } from "../components/ScrollUpArrow";

export const ArticlesListPage = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { category } = useParams();

  useEffect(() => {
    document.title = "Kun's Blog - " + (category ? category : "Home");
    fetch(`/api/articles`) //fetch short articles
      .then((res) => res.json())
      .then((data) => {
        if (category) {
          //filter articles by tag when url is articles/category
          data = data.filter((a) => {
            return a.tags.find((t) => t.name === category);
          });
        }
        setArticlesList(data);
        setIsLoading(false);
      });
  }, [category]);

  useEffect(() => {
    if (isAlertOpen) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 2000); //turn off alert in 2s
    }
  }, [isAlertOpen]);

  return (
    <>
      {isLoading == true ? (
        <Spinner fullPage />
      ) : (
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
              <div>
                {articlesList.map((article) => (
                  <ArticleCard article={article} key={article.id} />
                ))}
              </div>
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
      )}
    </>
  );
};
