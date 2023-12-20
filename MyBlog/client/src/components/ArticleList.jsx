import React, { useState, useCallback, useEffect } from "react";
import { Card, Button, CardBody, ButtonGroup } from "reactstrap";
import { ArticleCard } from "./ArticleCard";
import { AppPagination } from "./AppPagination";
import { FaNewspaper, FaArchive, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../app/appContext";
import { Spinner } from "./Spinner";

export const ArticleList = ({ category }) => {
  const [orderBy, setOrderby] = useState("dateAsc");
  const [articlesList, setArticlesList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const { api, user } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateArticlesList = useCallback(
    (category, pageNumber, orderBy = "dateAsc") => {
      setIsLoading(true);
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

  const handleTopButtonClick = (orderString) => {
    updateArticlesList(category, paginationData.currentPage, orderString);
    setOrderby(orderString);
  };

  const ArticleListTopButton = ({ Icon, iconSize, orderByString, text }) => {
    return (
      <Button
        outline
        className={
          "article-list-top-btns " + (orderBy === orderByString ? "focus" : "")
        }
        onClick={() => handleTopButtonClick(orderByString)}
      >
        <Icon size={iconSize} />
        <span>{text}</span>
      </Button>
    );
  };

  useEffect(() => {
    if (user != null) {
      document.title = "Kun's Blog - " + (category ? category : "Home");
      setIsLoading(true);
      updateArticlesList(category, 1);
    }
  }, [category, user, updateArticlesList]);

  return (
    <>
      {isLoading ? (
        <Spinner fullPage />
      ) : (
        <>
          <div style={{ marginTop: "20px" }}>
            <Card className="m-1">
              <CardBody>
                <ButtonGroup>
                  <ArticleListTopButton
                    Icon={FaArchive}
                    iconSize={25}
                    orderByString={"dateAsc"}
                    text="Oldest"
                  />
                  <ArticleListTopButton
                    Icon={FaNewspaper}
                    iconSize={30}
                    orderByString={"dateDesc"}
                    text="Newest"
                  />
                  <ArticleListTopButton
                    Icon={FaCommentDots}
                    iconSize={26}
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
                updatePageComponent={(_pageNumber) =>
                  updateArticlesList(category, _pageNumber, orderBy)
                }
                paginationData={paginationData ?? null}
              />
            ))}
          </div>
          <AppPagination
            paginationData={paginationData ?? null}
            category={category}
            updateArticlesList={(_pageNumber) =>
              updateArticlesList(category, _pageNumber, orderBy)
            }
          />
        </>
      )}
    </>
  );
};
