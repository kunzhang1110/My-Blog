import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../shared/appContext";
import { Card, CardBody } from "reactstrap";
import { Spinner } from "./Spinner";
import { Comment } from "./Comment";
import { CommentCreateOrEdit } from "./CommentCreateOrEdit";

export const CommentsList = ({ article, setNumberOfComments }) => {
  const [comments, setComments] = useState([]);
  const [paginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { api, user } = useAppContext();

  const getComments = useCallback(
    (articleId, isReloading = false) => {
      setIsLoading(true);
      api.comments
        .getCommentsByArticleId(articleId)
        .then((resp) => {
          let paginationHeaderData = JSON.parse(resp.headers.get("Pagination"));
          setPaginationData(paginationHeaderData);
          setNumberOfComments(paginationHeaderData?.totalCount);
          return resp.json();
        })
        .then((data) => {
          if (isReloading) {
            setComments(data);
          } else {
            setComments((prevComments) => [...prevComments, ...data]);
          }
          setIsLoading(false);
        });
    },
    [api.comments, setNumberOfComments]
  );

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getComments(article.id, true);
    }

    return () => {
      isMounted = false; // Set mounted state to false when unmounting
    };
  }, [article.id, getComments]);

  const handleLoadMore = () => {
    getComments(article.id, paginationData.currentPage + 1);
  };

  return (
    <div className="m-2">
      {user.isAdmin ? (
        <CommentCreateOrEdit
          articleId={article.id}
          setIsLoading={setIsLoading}
          updateComments={getComments}
        />
      ) : (
        <></>
      )}
      <div
        className="mt-3 py-1"
        style={{ border: "1px solid #eeeeee", borderRadius: "8px" }}
      >
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <Comment
                comment={comment}
                key={comment.id}
                articleId={article.id}
                getComments={getComments}
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
