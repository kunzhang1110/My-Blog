import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { ArticleList } from "../components/ArticleList";
import { Spinner } from "../components/Spinner";
import { useAppContext } from "../app/appContext";
import { _captalize } from "../app/utils";

export const ProfilePage = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({});
  const { api, user } = useAppContext();
  const navigate = useNavigate();

  const updateArticlesList = useCallback(
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
    if (user.userName !== "") {
      updateArticlesList(1);
    }
  }, [user, updateArticlesList]);

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
                  {_captalize(user.userName)}
                </h1>
                <hr />

                <dl className="row w-75" style={{ fontSize: "1.2rem" }}>
                  <dt className="col-sm-1">Email</dt>
                  <dd className="col-sm-11">{user.email}</dd>
                  <dt className="col-sm-1">Roles</dt>
                  <dd className="col-sm-11">{user.roles.join(", ")}</dd>
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
                  updateArticlesList={updateArticlesList}
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
