import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { _captalize } from "../app/utils";
import { Spinner } from "../components/Spinner";
import { ArticleList } from "./ArticlesListPage";
import { useAppContext } from "../app/appContext";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [articlesList, setArticlesList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const navigate = useNavigate();
  const { api, user } = useAppContext();

  const updateArticlesList = (pageNumber, orderBy) => {
    api.articles
      .GetArticlesByUserCommentedOrLiked(user.userId, pageNumber, orderBy)
      .then((resp) => {
        if (resp.status == "400") {
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
  };

  useEffect(() => {
    document.title = "Profile";

    setIsLoading(true);
    if (user.userName !== "") {
      updateArticlesList(1);
    }
  }, [user]);

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
                <h1 className="display-3">{_captalize(user.userName)}</h1>
                <hr />
                <Row>
                  <Col sm={2}>
                    <div style={{ fontSize: "1.2rem" }}>Roles</div>
                    <span>{user.roles.join(", ")}</span>
                  </Col>
                  <Col sm={2}>
                    <div style={{ fontSize: "1.2rem" }}>Email</div>
                    <div>{user.email}</div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card className="m-2">
              <CardBody className="m-3">
                <h1 className="display-4">Commented and Liked Articles</h1>
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
