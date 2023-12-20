import React, { useEffect, useState } from "react";
import { useAppContext } from "../app/appContext";
import { Button, Card, CardBody } from "reactstrap";
import { Spinner } from "./Spinner";
import { Comment } from "./Comment";
import { CommentEdit } from "./CommentEdit";

export const CommentsList = ({ article, setNumberOfComments }) => {
  const [comments, setComments] = useState([]);
  const [paginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { api, user } = useAppContext();

  const updateComments = (articleId, pageNumber, isReloading = false) => {
    {
      setIsLoading(true);
      api.comments
        .getCommentsByArticleId(articleId, pageNumber)
        .then((resp) => {
          let paginationHeaderData = JSON.parse(resp.headers.get("Pagination"));
          setPaginationData(paginationHeaderData);
          setNumberOfComments(paginationHeaderData.totalCount);
          return resp.json();
        })
        .then((data) => {
          if (isReloading) {
            setComments(data);
          } else {
            setComments([...comments, ...data]);
          }

          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    updateComments(article.id);
  }, []);

  const handleLoadMore = () => {
    updateComments(article.id, paginationData.currentPage + 1);
  };

  return (
    <div className="m-2">
      {user.isAdmin ? (
        <CommentEdit
          articleId={article.id}
          setIsLoading={setIsLoading}
          updateComments={updateComments}
        />
      ) : (
        <></>
      )}
      <div>
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <Comment
                comment={comment}
                key={comment.id}
                articleId={article.id}
                updateComments={updateComments}
                setIsLoading={setIsLoading}
              />
            ))}
            {isLoading ? (
              <div
                style={{ height: "50px", width: "100%" }}
                className="d-flex justify-content-center"
              >
                <Spinner />
              </div>
            ) : (
              <></>
            )}
            {paginationData.currentPage < paginationData.totalPages ? (
              <div
                className="text-center mt-2"
                onClick={handleLoadMore}
                style={{
                  cursor: "pointer",
                  color: "#0d6efd",
                  width: "100%",
                }}
              >
                See More Comments
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <Card>
            <CardBody>No Comment Yet.</CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
