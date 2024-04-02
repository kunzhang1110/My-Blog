import React, { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import Avatar from "react-avatar";
import { VscEllipsis } from "react-icons/vsc";
import moment from "moment";

import { Spinner } from "./Spinner";
import { useAppContext } from "../shared/appContext";
import { CommentCreateOrEdit } from "./CommentCreateOrEdit";
import { capitalize } from "../shared/utils";

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
  const { api, user } = useAppContext();

  const toggleDropDown = () => setIsDropdownOpen((prev) => !prev);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  const handleDeleteComment = () => {
    api.comments.deleteComment(comment.id).then(() => {
      setIsDeleting(true);
      setIsModalOpen(false);
      updateComments(articleId, 1, true);
      setIsDeleting(false);
    });
  };

  return (
    <>
      <Card style={{ borderColor: "#ffffff" }}>
        <CardBody className="px-4 py-1">
          <div
            className="d-inline-flex justify-content-between align-items-center"
            style={{ width: "100%" }}
          >
            <div className="d-inline-flex align-items-center">
              <Avatar
                size="22"
                name={comment.userName}
                textSizeRatio={1.6}
                round
              />
              <span className="m-2" style={{ fontWeight: "650" }}>
                {capitalize(comment.userName)}
              </span>
            </div>
            <Dropdown
              isOpen={isDropdownOpen}
              toggle={toggleDropDown}
              className="ml-auto"
              style={{ float: "right" }}
            >
              <DropdownToggle
                color="transparent"
                className="btn-article-card-top-right"
              >
                <VscEllipsis color="grey" />
              </DropdownToggle>
              <DropdownMenu style={{ minWidth: "6rem" }}>
                <DropdownItem
                  disabled={
                    !(user.userName === comment.userName || user.isAdmin)
                  }
                  onClick={toggleEditMode}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  disabled={
                    !(user.userName === comment.userName || user.isAdmin)
                  }
                  onClick={toggleModal}
                >
                  Delete
                </DropdownItem>
                <Modal
                  isOpen={isModalOpen}
                  toggle={toggleModal}
                  centered={true}
                >
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
          </div>
          {isEditMode ? (
            <CommentCreateOrEdit
              articleId={articleId}
              setIsLoading={setIsLoading}
              updateComments={updateComments}
              comment={comment}
              isEdit={true}
              setIsEdit={setIsEditMode}
            />
          ) : (
            <div style={{ marginLeft: "2rem" }}>
              <CardText
                className="text-muted"
                style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}
              >
                Updated on
                {moment(comment.date.substring(0, 10), "DD/MM/YYYY").format(
                  "MMM DD, YYYY"
                )}
              </CardText>
              <p>{comment.body}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};
