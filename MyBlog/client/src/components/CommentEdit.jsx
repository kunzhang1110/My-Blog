import React, { useEffect, useState } from "react";

import { Button, ButtonGroup } from "reactstrap";
import {
  InputWithValidation,
  DEFAULT_INPUT,
  validateInput,
} from "./InputWithValidation";

import { useAppContext } from "../app/appContext";

export const CommentEdit = ({
  articleId,
  updateComments,
  setIsLoading,
  setIsEditMode,
  comment = DEFAULT_INPUT,
  isEditMode = false,
}) => {
  const [newComment, setNewComment] = useState(DEFAULT_INPUT);
  const { api, user } = useAppContext();

  useEffect(() => {
    setNewComment({
      text: comment.body,
      invalidText: "",
      isInvalid: false,
    });
  }, []);

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

      if (isEditMode) {
        api.comments
          .updateComment(newCommentDto)
          .then((resp) => {
            return resp.json();
          })
          .then(() => {
            updateComments(articleId, 1, true);
            setIsEditMode(false);
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
    setIsEditMode(false);
  };

  return (
    <div className="my-2 ms-4">
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
            Edit
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
