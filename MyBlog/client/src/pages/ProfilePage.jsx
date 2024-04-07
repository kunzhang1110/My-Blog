import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { ArticleList } from "../components/ArticleList";
import { Spinner } from "../components/Spinner";
import { useAppContext } from "../shared/appContext";
import { capitalize } from "../shared/utils";
import Avatar from "react-avatar";

export const ProfilePage = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [orderBy, setOrderby] = useState("dateAsc");
  const [isLoading, setIsLoading] = useState(true);
  const { api, user } = useAppContext();
  const navigate = useNavigate();

  const getArticlesList = useCallback(
    (pageNumber, orderBy) => {
      api.articles
        .GetArticlesByUserCommentedOrLiked(user.userId, pageNumber, orderBy)
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
    [api, user, navigate]
  );

  useEffect(() => {
    document.title = "Profile";
    setIsLoading(true);
    if (user && user.userName !== "") {
      getArticlesList(1);
    }
  }, [user, getArticlesList]);

  return (
    <>
      {isLoading === true ? (
        <Spinner fullPage />
      ) : (
        <Row>
          <Col
            md={{
              offset: 1,
              size: 10,
            }}
          >
            <AppBreadCrumb />
            <Card className="m-2">
              <CardBody className="m-3">
                <h1 style={{ fontSize: "2.5rem" }}>
                  <div className="d-flex align-items-center">
                    <Avatar
                      size="48"
                      className="me-2"
                      name={user.userName}
                      textSizeRatio={1.5}
                      round
                    />
                    {capitalize(user.userName)}
                  </div>
                </h1>
                <hr />

                <dl className="row w-75" style={{ fontSize: "1.2rem" }}>
                  <dt className="col-xxl-1">Email</dt>
                  <dd className="col-xxl-11">{user.email}</dd>
                  <dt className="col-xxl-1">Roles</dt>
                  <dd className="col-xxl-11">{user.roles.join(", ")}</dd>
                </dl>
              </CardBody>
            </Card>
            <Card className="m-2">
              <CardBody className="m-3">
                <h2 style={{ fontSize: "2.5rem" }}>
                  Commented & Liked Articles
                </h2>
                <ArticleList
                  articlesList={articlesList}
                  paginationData={paginationData ?? null}
                  getArticlesList={getArticlesList}
                  orderBy={orderBy}
                  setOrderby={setOrderby}
                />
              </CardBody>
            </Card>
          </Col>
          <Col
            md={{
              size: 1,
            }}
          ></Col>
        </Row>
      )}
    </>
  );
};
