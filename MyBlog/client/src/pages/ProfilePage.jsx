import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { useAuth } from "../app/auth";
import { _captalize } from "../app/utils";
import { Spinner } from "../components/Spinner";
import { ArticleList } from "./ArticlesListPage";
import { api } from "../app/api";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [articlesList, setArticlesList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const navigate = useNavigate();

  const updateArticlesList = (pageNumber) => {
    api.articles
      .getArticlesByUserCommented(user.userId, pageNumber)
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
                <h1 className="display-2">{_captalize(user.userName)}</h1>
                <hr />
                <dl className="row" style={{ fontSize: "1.5rem" }}>
                  <dt className="col-sm-2 ">Roles:</dt>
                  <dd className="col-sm-10 ">{user.roles.join(", ")}</dd>
                  <dt className="col-sm-2 ">Email:</dt>
                  <dd className="col-sm-10 ">{user.email}</dd>
                </dl>
              </CardBody>
            </Card>
            <Card className="m-2">
              <CardBody className="m-3">
                <h1 className="display-3">Commented Articles</h1>
                <ArticleList
                  articlesList={articlesList}
                  paginationData={paginationData ?? null}
                  updateArticlesList={(p) => updateArticlesList(p)}
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
