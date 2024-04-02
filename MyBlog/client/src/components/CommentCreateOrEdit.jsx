import React, { useEffect, useState } from "react";

import { Button, ButtonGroup } from "reactstrap";
import {
  InputWithValidation,
  DEFAULT_INPUT,
  validateInput,
} from "./InputWithValidation";

import { useAppContext } from "../shared/appContext";

export const CommentCreateOrEdit = ({
  articleId,
  updateComments,
  setIsLoading,
  setIsEdit,
  comment = DEFAULT_INPUT,
  isEdit = false,
}) => {
  const [newComment, setNewComment] = useState(DEFAULT_INPUT);
  const { api, user } = useAppContext();

  useEffect(() => {
    setNewComment({
      text: comment.body,
      invalidText: "",
      isInvalid: false,
    });
  }, [comment.body]);

  const handlePostComment = () => {
    if (
      validateInput(
        newComment,
        setNewComment,
        null,
        "Comments cannot be blank."
      )
    ) {
      const newCommentDto = {
        id: comment?.id,
        userId: user.userId,
        articleId: articleId,
        userName: user.userName,
        body: newComment.text,
      };

      setIsLoading(true);

      if (isEdit) {
        api.comments
          .updateComment(newCommentDto)
          .then((resp) => {
            return resp.json();
          })
          .then(() => {
            updateComments(articleId, 1, true);
            setIsEdit(false);
            setNewComment(DEFAULT_INPUT);
          });
      } else {
        api.comments
          .createComment(newCommentDto)
          .then((resp) => {
            return resp.json();
          })
          .then(() => {
            updateComments(articleId, 1, true);
            setNewComment(DEFAULT_INPUT);
          });
      }
    }
  };

  const handleCancelComment = () => {
    setNewComment(DEFAULT_INPUT);
    setIsEdit(false);
  };

  return (
    <div className={isEdit ? "my-2 m-4" : "my-2"}>
      <InputWithValidation
        input={newComment}
        inputType={"textarea"}
        setInput={setNewComment}
        hasHiddenLabel
        style={{ height: "5rem" }}
        placeholderText={"Write your thoughts ..."}
      />
      <div className="text-end">
        <ButtonGroup>
          <Button outline onClick={handleCancelComment}>
            Cancel
          </Button>
          <Button
            outline
            className="ms-2"
            color="primary"
            onClick={handlePostComment}
          >
            Post
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
