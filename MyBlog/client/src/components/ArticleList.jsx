import React, { useState } from "react";
import { Card, Button, CardBody, ButtonGroup } from "reactstrap";
import { ArticleCard } from "./ArticleCard";
import { AppPagination } from "./AppPagination";
import { FaNewspaper, FaArchive, FaCommentDots } from "react-icons/fa";

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
          "article-list-top-buttons " +
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
