import React from "react";
import { Card, Button, CardBody, ButtonGroup } from "reactstrap";
import { ArticleCard } from "./ArticleCard";
import { AppPagination } from "./AppPagination";
import { FaNewspaper, FaArchive, FaCommentDots } from "react-icons/fa";

export const ArticleList = ({
  articlesList,
  paginationData,
  getArticlesList,
  orderBy,
  setOrderby,
  category,
}) => {
  const handleTopButtonClick = (orderString) => {
    getArticlesList(paginationData.currentPage, orderString, category);
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

  return (
    <>
      <>
        <div style={{ marginTop: "20px" }}>
          <Card className="m-1">
            <CardBody>
              <ButtonGroup>
                <ArticleListTopButton
                  Icon={FaArchive}
                  iconSize={23}
                  orderByString={"dateAsc"}
                  text="Oldest"
                />
                <ArticleListTopButton
                  Icon={FaNewspaper}
                  iconSize={27}
                  orderByString={"dateDesc"}
                  text="Newest"
                />
                <ArticleListTopButton
                  Icon={FaCommentDots}
                  iconSize={23}
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
                getArticlesList(_pageNumber, orderBy, category)
              }
              paginationData={paginationData ?? null}
            />
          ))}
        </div>
        <AppPagination
          paginationData={paginationData ?? null}
          category={category}
          updateArticlesList={(_pageNumber) =>
            getArticlesList(_pageNumber, orderBy, category)
          }
        />
      </>
    </>
  );
};
