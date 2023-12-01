import React, { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { FaUser } from "react-icons/fa";
import { VscEllipsis } from "react-icons/vsc";
import { useAuth } from "../app/auth";
import { Spinner } from "./Spinner";
import { api } from "../app/api";
import { CommentEdit } from "./CommentEdit";

export const Comment = ({
  comment,
  articleId,
  updateComments,
  setIsLoading,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();

  const toggleDropDown = () => setIsDropdownOpen((prev) => !prev);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  const handleDeleteComment = () => {
    api.comments
      .deleteComment(comment.id, user.authorizationHeader)
      .then(() => {
        setIsDeleting(true);
        setIsModalOpen(false);
        updateComments(articleId, 1, true);
        setIsDeleting(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <FaUser className=" me-2" />
          <span style={{ fontWeight: "bold" }}>{comment.userName}</span>
          <span style={{ float: "right" }}></span>
          <Dropdown
            isOpen={isDropdownOpen}
            toggle={toggleDropDown}
            style={{ float: "right" }}
          >
            <DropdownToggle
              color="transparent"
              className="btn-article-card-top-right"
            >
              <VscEllipsis color="grey" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                disabled={!(user.userName === comment.userName || user.isAdmin)}
                onClick={toggleEditMode}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                disabled={!(user.userName === comment.userName || user.isAdmin)}
                onClick={toggleModal}
              >
                Delete
              </DropdownItem>
              <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader>
                  Are your sure you want to delete this post?
                </ModalHeader>
                <ModalFooter>
                  <Button
                    className="btn-loading"
                    color="danger"
                    onClick={handleDeleteComment}
                  >
                    {isDeleting ? (
                      <Spinner
                        size="1.5rem"
                        className="justify-content-center"
                      />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                  <Button color="secondary" onClick={toggleModal}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>

        <CardBody style={{ marginLeft: "25px" }}>
          {isEditMode ? (
            <CommentEdit
              articleId={articleId}
              setIsLoading={setIsLoading}
              updateComments={updateComments}
              comment={comment}
              isEditMode={true}
              setIsEditMode={setIsEditMode}
            />
          ) : (
            <>
              <CardText>
                <small className="text-muted">
                  Updated on {comment.date.substring(0, 10)}
                </small>
              </CardText>
              <CardText style={{ whiteSpace: "pre-line" }}>
                {comment.body}
              </CardText>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};
