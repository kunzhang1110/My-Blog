import React, { useEffect, useState } from "react";

import { Button, ButtonGroup } from "reactstrap";
import {
  InputWithValidation,
  DEFAULT_INPUT,
  validateInput,
} from "./InputWithValidation";
import { useAuth } from "../app/auth";
import { api } from "../app/api";

export const CommentEdit = ({
  articleId,
  updateComments,
  setIsLoading,
  setIsEditMode,
  comment = DEFAULT_INPUT,
  isEditMode = false,
}) => {
  const [newComment, setNewComment] = useState(DEFAULT_INPUT);
  const { user } = useAuth();

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
          .updateComment(newCommentDto, user.authorizationHeader)
          .then((resp) => {
            return resp.json();
          })
          .then(() => {
            updateComments(articleId, 1, true);
            setIsEditMode(false);
          });
      } else {
        api.comments
          .createComment(newCommentDto, user.authorizationHeader)
          .then((resp) => {
            return resp.json();
          })
          .then(() => {
            updateComments(articleId, 1, true);
          });
      }
    }
  };

  const handleCancelComment = () => {
    setNewComment(DEFAULT_INPUT);
  };
  return (
    <div>
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
          <Button outline onClick={handlePostComment}>
            Post
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
