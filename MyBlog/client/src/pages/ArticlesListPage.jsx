import React, { useEffect, useState, useCallback } from "react";
import { Alert, Col, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { SideBar } from "../components/SideBar";
import { Spinner } from "../components/Spinner";
import { ScrollUpArrow } from "../components/ScrollUpArrow";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { api } from "../app/api";
import { AppPagination } from "../components/AppPagination";

export const ArticlesListPage = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { category } = useParams();

  const updateData = useCallback(
    async (pageNumber = 1) => {
      setIsLoading(true);
      let response = await api.articles.getArticles(category, pageNumber);
      setArticlesList(await response.json());
      setPaginationData(JSON.parse(response.headers.get("Pagination")));
      setIsLoading(false);
    },
    [category]
  );

  useEffect(() => {
    document.title = "Kun's Blog - " + (category ? category : "Home");
    updateData().catch((err) => {
      console.log(err);
    });
  }, [category, updateData]);

  useEffect(() => {
    if (isAlertOpen) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 2000); //turn off alert in 2s
    }
  }, [isAlertOpen, paginationData]);

  return (
    <>
      {isLoading === true ? (
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
              {category ? <AppBreadCrumb /> : null}

              <div style={{ marginTop: "20px" }}>
                {articlesList.map((article) => (
                  <ArticleCard article={article} key={article.id} />
                ))}
              </div>
              <AppPagination
                handlePageChange={updateData}
                paginationData={paginationData ?? null}
              />
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
