import React, { useCallback, useEffect, useState } from "react";
import { Alert, Col, Row } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { Spinner } from "../components/Spinner";
import { ScrollUpArrow } from "../components/ScrollUpArrow";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { useAppContext } from "../app/appContext";
import { ArticleList } from "../components/ArticleList";

export const ArticlesListPage = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({});
  const { api, user } = useAppContext();
  const { category } = useParams();
  const navigate = useNavigate();

  const updateArticlesList = useCallback(
    (category, pageNumber, orderBy = "dateAsc") => {
      api.articles
        .getArticles(category, pageNumber, orderBy)
        .then((resp) => {
          if (resp.status === "400") {
            navigate("/error", {
              state: { message: "Page number exceeds max pages" },
            });
            return;
          }
          setPaginationData(JSON.parse(resp.headers.get("Pagination")));
          return resp.json();
        })
        .then((data) => {
          setArticlesList(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [navigate, api]
  );

  useEffect(() => {
    if (user != null) {
      document.title = "Kun's Blog - " + (category ? category : "Home");
      setIsLoading(true);
      updateArticlesList(category, 1);
    }
  }, [category, user, updateArticlesList]);

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
              <>
                <ArticleList
                  articlesList={articlesList}
                  paginationData={paginationData ?? null}
                  updateArticlesList={(p, o) =>
                    updateArticlesList(category, p, o)
                  }
                />
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
      )}
    </>
  );
};
