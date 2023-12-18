import React, { useEffect, useState } from "react";
import {
  Alert,
  Col,
  Card,
  Button,
  Row,
  CardBody,
  ButtonGroup,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { SideBar } from "../components/SideBar";
import { Spinner } from "../components/Spinner";
import { ScrollUpArrow } from "../components/ScrollUpArrow";
import { AppBreadCrumb } from "../components/AppBreadCrumb";
import { AppPagination } from "../components/AppPagination";
import { FaNewspaper, FaArchive, FaCommentDots } from "react-icons/fa";
import { useAppContext } from "../app/appContext";

export const ArticleList = ({
  articlesList,
  paginationData,
  category,
  updateArticlesList,
}) => {
  const [orderBy, setOrderby] = useState("dateAsc");

  const handleButtonClick = (orderString) => {
    updateArticlesList(paginationData.currentPage, orderString);
    setOrderby(orderString);
  };

  const ArticleListTopButton = ({ Icon, iconSize, orderByString, text }) => {
    return (
      <Button
        outline
        className={
          "article-list-header-buttons " +
          (orderBy === orderByString ? "focus" : "")
        }
        onClick={() => handleButtonClick(orderByString)}
      >
        <Icon size={iconSize} />
        <span>{text}</span>
      </Button>
    );
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <Card className="m-1">
          <CardBody>
            <ButtonGroup>
              <ArticleListTopButton
                Icon={FaArchive}
                iconSize={28}
                orderByString={"dateAsc"}
                text="Oldest"
              />
              <ArticleListTopButton
                Icon={FaNewspaper}
                iconSize={35}
                orderByString={"dateDesc"}
                text="Newest"
              />
              <ArticleListTopButton
                Icon={FaCommentDots}
                iconSize={30}
                orderByString={"mostCommented"}
                text="Most Commented"
              />
            </ButtonGroup>
          </CardBody>
        </Card>
      </div>

      <div style={{ marginTop: "10px" }}>
        {articlesList.map((article) => (
          <ArticleCard
            article={article}
            key={article.id}
            updatePageComponent={(p) => updateArticlesList(p)}
            paginationData={paginationData ?? null}
          />
        ))}
      </div>
      <AppPagination
        paginationData={paginationData ?? null}
        category={category}
        updateArticlesList={(p) => updateArticlesList(p)}
      />
    </>
  );
};

export const ArticlesListPage = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({});
  const { api } = useAppContext();
  const { category } = useParams();
  const navigate = useNavigate();

  const updateArticlesList = (category, pageNumber, orderBy = "dateAsc") => {
    api.articles
      .getArticles(category, pageNumber, orderBy)
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
    document.title = "Kun's Blog - " + (category ? category : "Home");
    setIsLoading(true);
    updateArticlesList(category, 1);
  }, [category]);

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
