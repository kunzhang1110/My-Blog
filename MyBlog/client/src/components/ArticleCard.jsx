import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalFooter,
  ButtonGroup,
  ModalBody,
} from "reactstrap";
import Avatar from "react-avatar";
import { Link, useNavigate } from "react-router-dom";
import { VscEllipsis } from "react-icons/vsc";
import { GoEye, GoComment } from "react-icons/go";
import { MdDateRange } from "react-icons/md";
import UseAnimations from "react-useanimations";
import Thumbup from "react-useanimations/lib/thumbUp";

import { useAppContext } from "../shared/appContext.jsx";
import { capitalize } from "../shared/utils";
import { Spinner } from "./Spinner";
import { Tag } from "./Tag";
import { AppReactMarkdown } from "./AppReactMarkdown.jsx";
import { CommentsList } from "./CommentsList.jsx";
import { BLOG_AUTHOR } from "../shared/constants.js";

//React Markdown common components
export const rmComponents = {};

export const ArticleCard = ({
  article,
  updatePageComponent,
  paginationData,
  articleUrlId,
  isSinglePage,
}) => {
  const imageDirectory = `UserData/${article.id}`;
  const [collapsed, setCollapsed] = useState(isSinglePage ? false : true);
  const [body, setBody] = useState(isSinglePage ? article.body : "");
  const [numberOfLikes, setNumberOfLikes] = useState(article.numberOfLikes);
  const [numberOfComments, setNumberOfComments] = useState(
    article.numberOfComments
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user, api } = useAppContext();
  const isInAriclePage = articleUrlId ?? false;

  useEffect(() => {
    setIsCommentOpen(isInAriclePage);
  }, [isInAriclePage]);

  const toggleArticleCard = (e) => {
    e.preventDefault();
    if (collapsed) {
      setIsLoading(true);
      api.articles
        .getArticle(article.id)
        .then((data) => {
          setBody(data.body);
          setCollapsed(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else {
      setCollapsed(true);
    }
  };

  const toggleDropDown = () => setIsDropdownOpen((prev) => !prev);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const deleteArticle = () => {
    setIsDeleting(true);
    api.articles.deleteArticle(article.id).then(() => {
      toggleModal();
      setIsDeleting(false);
      if (isInAriclePage) {
        updatePageComponent();
      } else {
        updatePageComponent(paginationData.currentPage);
      }
    });
  };

  const toggleLike = () => {
    api.articles.toggleLike(article.id).then((res) => {
      if (res.status === 200) {
        setNumberOfLikes((prev) => prev + 1);
      } else if (res.status === 204) {
        setNumberOfLikes((prev) => prev - 1);
      }
    });
  };

  return (
    <Card className="m-1">
      <CardBody className="mx-3 my-1">
        <Row>
          <Col xs="11">
            <h1
              onClick={() => {
                if (!isInAriclePage) navigate(`/articles/${article.id}`);
              }}
              style={{
                cursor: isInAriclePage ? null : "pointer",
                fontSize: "2rem",
              }}
            >
              {article.title}
            </h1>
          </Col>
          {/* top right dropdown menu */}
          <Col xs="1" style={{ textAlign: "right" }}>
            <Dropdown isOpen={isDropdownOpen} toggle={toggleDropDown}>
              <DropdownToggle
                color="transparent"
                className="btn-article-card-top-right"
              >
                <VscEllipsis color="grey" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  disabled={!user.isAdmin}
                  tag={Link}
                  to={`/edit/${article.id}`}
                >
                  Edit
                </DropdownItem>
                <DropdownItem disabled={!user.isAdmin} onClick={toggleModal}>
                  Delete
                </DropdownItem>
                <Modal
                  isOpen={isModalOpen}
                  toggle={toggleModal}
                  centered={true}
                >
                  <ModalBody
                    className="d-flex m-2"
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <span className="ms-2" style={{ fontSize: "1.4rem" }}>
                      Are your sure you want to delete this post?
                    </span>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="btn-loading"
                      color="danger"
                      onClick={deleteArticle}
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
                <DropdownItem divider />
                {isInAriclePage ? (
                  <DropdownItem
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(window.location.href);
                    }}
                  >
                    Copy Link
                  </DropdownItem>
                ) : (
                  <DropdownItem tag={Link} to={`/articles/${article.id}`}>
                    Article Page
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        <div className="ms-1 d-flex align-items-center"></div>
        {/* user name, stats and tags */}
        <div className="d-flex align-items-center flex-wrap">
          <Avatar size="24" name={BLOG_AUTHOR} textSizeRatio={1.8} round />
          <span
            className="m-2"
            style={{ fontWeight: "600", fontSize: "1.05rem" }}
          >
            {capitalize(BLOG_AUTHOR)}
          </span>
          <MdDateRange className="m-1" />
          <span className="me-2">{article.date.substring(0, 10)}</span>
          <GoEye className="m-1" />
          <span className="me-2">{article.views}</span>
          {article.tags.map((tag) => (
            <Tag className="m-1" tag={tag} key={tag.id} />
          ))}
        </div>

        <AppReactMarkdown
          children={collapsed ? article.body : body}
          imgFunc={({ node, src, ...props }) => {
            return (
              <span className="d-block text-center">
                <img
                  className="mw-100"
                  src={`${imageDirectory}/${src}`}
                  alt={src}
                  {...props}
                />
              </span>
            );
          }}
          deps={[collapsed, article, body]}
        />
        {isInAriclePage ? (
          <></>
        ) : (
          <Row>
            <Link to="#" onClick={(e) => toggleArticleCard(e)}>
              {isLoading ? (
                <Spinner size="2rem" className="mt-2" />
              ) : collapsed ? (
                "More..."
              ) : (
                "Less"
              )}
            </Link>
          </Row>
        )}
        <ButtonGroup className="mt-2" style={{ alignItems: "center" }}>
          <Button
            color="transparent"
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            className={
              "article-card-comment-collapse-btn " +
              (isCommentOpen ? "focus" : "")
            }
          >
            <GoComment
              style={{ marginRight: "8px", height: "23px", width: "20px" }}
            />
            <span>Comments ({numberOfComments ? numberOfComments : 0})</span>
          </Button>
          <div
            style={{
              borderLeft: "1px solid grey",
              height: "18px",
            }}
          ></div>
          <UseAnimations
            animation={Thumbup}
            onClick={user.userName !== "" ? toggleLike : null}
            reverse={article.isLikedByUser}
            render={(eventProps, animationProps) => (
              <Button
                color="transparent"
                tag="div"
                disabled={user.userName === ""}
                {...eventProps}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  opacity: 0.8,
                }}
              >
                <div
                  {...animationProps}
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    marginBottom: "5px",
                  }}
                />
                <span style={{ marginRight: "2px" }}>Like</span>
                <span>{numberOfLikes !== 0 ? `(${numberOfLikes})` : ""}</span>
              </Button>
            )}
          />
        </ButtonGroup>
        {isCommentOpen ? (
          <CommentsList
            article={article}
            numberOfComments={numberOfComments}
            setNumberOfComments={setNumberOfComments}
          />
        ) : (
          <></>
        )}
      </CardBody>
    </Card>
  );
};
