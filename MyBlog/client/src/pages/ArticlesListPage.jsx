import React, { useEffect, useState, useCallback } from "react";
import { Alert, Col, Row } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { useAppContext } from "../shared/appContext";
import { ScrollUpArrow } from "../components/ScrollUpArrow";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { ArticleList } from "../components/ArticleList";
import { Spinner } from "../components/Spinner";

export const ArticlesListPage = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [orderBy, setOrderby] = useState("dateAsc");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { category } = useParams();
  const { api, user } = useAppContext();
  const navigate = useNavigate();

  const getArticlesList = useCallback(
    (pageNumber, orderBy = "dateAsc", category) => {
      setIsLoading(true);
      api.articles
        .getArticles(pageNumber, orderBy, category)
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

  const handleScroll = () => {
    const position = window.scrollY;

    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAlertOpen) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 2000); //turn off alert in 2s
    }
  }, [isAlertOpen]);

  useEffect(() => {
    if (user != null) {
      document.title = "Kun's Blog - " + (category ? category : "Home");
      setIsLoading(true);
      getArticlesList(1, "dateAsc", category);
    }
  }, [category, user, getArticlesList]);

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
          {isLoading ? (
            <Spinner fullPage />
          ) : (
            <>
              <ArticleList
                articlesList={articlesList}
                paginationData={paginationData ?? null}
                getArticlesList={getArticlesList}
                orderBy={orderBy}
                setOrderby={setOrderby}
                category={category}
              />
            </>
          )}
        </Col>

        <Col
          xxl={{
            size: 1,
          }}
        >
          {scrollPosition > window.innerHeight ? <ScrollUpArrow /> : <></>}
        </Col>
      </Row>
      <Alert color="info" isOpen={isAlertOpen} className="alert-top">
        Email Address Copied!
      </Alert>
    </>
  );
};
