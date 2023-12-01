import React, { useEffect, useState } from "react";
import { api } from "../app/api";
import { Button, Card, CardBody } from "reactstrap";
import { useAuth } from "../app/auth";
import { Spinner } from "./Spinner";
import { Comment } from "./Comment";
import { CommentEdit } from "./CommentEdit";

export const CommentsList = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [paginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const updateComments = (articleId, pageNumber, isReloading = false) => {
    {
      setIsLoading(true);
      api.comments
        .getCommentsByArticleId(articleId, pageNumber)
        .then((resp) => {
          setPaginationData(JSON.parse(resp.headers.get("Pagination")));
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
    updateComments(articleId);
  }, []);

  const handleLoadMore = () => {
    updateComments(articleId, paginationData.currentPage + 1);
  };

  return (
    <>
      {user.isAdmin ? (
        <CommentEdit
          articleId={articleId}
          setIsLoading={setIsLoading}
          updateComments={updateComments}
        />
      ) : (
        <></>
      )}
      <div className="mt-2">
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <Comment
                comment={comment}
                key={comment.id}
                articleId={articleId}
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
              <Button outline className="mt-2" onClick={handleLoadMore}>
                Load More
              </Button>
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
    </>
  );
};
