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
  ModalHeader,
  ModalFooter,
  ButtonGroup,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { VscEllipsis } from "react-icons/vsc";
import { GoEye, GoComment } from "react-icons/go";
import { MdDateRange } from "react-icons/md";
import { useAuth } from "../app/auth.jsx";
import { Spinner } from "./Spinner";
import { Tag } from "./Tag";
import { AppReactMarkdown } from "./AppReactMarkdown.jsx";
import { api } from "../app/api.jsx";
import { CommentsList } from "./CommentsList.jsx";
import UseAnimations from "react-useanimations";
import Thumbup from "react-useanimations/lib/thumbUp";

//React Markdown common components
export const rmComponents = {};

export const ArticleCard = ({
  article,
  updatePageComponent,
  paginationData,
  articleUrlId,
}) => {
  const imageDirectory = `UserData/${article.id}`;
  const [collapsed, setCollapsed] = useState(true);
  const [body, setBody] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isInAriclePage = articleUrlId ?? false;

  useEffect(() => {
    setIsCommentOpen(isInAriclePage);
  }, []);

  const toggleArticleCard = (e) => {
    e.preventDefault();
    if (collapsed) {
      setIsLoading(true);
      api.articles
        .getArticle(article.id, user.authorizationHeader)
        .then((data) => {
          setBody(data.body);
          setCollapsed(false);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
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
    api.articles
      .deleteArticle(article.id, user.authorizationHeader)
      .then(() => {
        toggleModal();
        setIsDeleting(false);
        if (isInAriclePage) {
          updatePageComponent();
        } else {
          updatePageComponent(paginationData.currentPage);
        }
      });
  };

  const handleToggleLike = () => {
    api.articles
      .toggleLike(article.id, user.authorizationHeader)
      .then((res) => {
        if (res.status === 204 || res.status === 200) {
          if (isInAriclePage) {
            updatePageComponent();
          } else {
            updatePageComponent(paginationData.currentPage);
          }
        }
      });
  };

  return (
    <Card className="m-2">
      <CardBody className="m-3">
        <Row>
          <Col xs="11">
            <h1
              onClick={() => {
                if (!isInAriclePage) navigate(`/articles/${article.id}`);
              }}
              style={{ cursor: isInAriclePage ? null : "pointer" }}
            >
              {article.title}
            </h1>
            {/* </a> */}
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
                  <ModalHeader>
                    Are your sure you want to delete this post?
                  </ModalHeader>
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
        {/* stats and tags */}
        <div className="d-inline-flex align-items-center mt-2 mb-3 flex-wrap">
          <MdDateRange className="m-1" />
          <span className="me-2">{article.date.substring(0, 10)}</span>
          <GoEye className="m-1" />
          <span className="me-2">{article.views}</span>
          <div className="d-sm-inline-flex flex-wrap m-1">
            {article.tags.map((tag) => (
              <Tag className="m-1" tag={tag} key={tag.id} />
            ))}
          </div>
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
        <ButtonGroup className="my-3" style={{ alignItems: "center" }}>
          <Button
            color="transparent"
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            tag="div"
            style={{
              paddingLeft: "0px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <GoComment
              style={{ marginRight: "8px", height: "20px", width: "20px" }}
            />
            Comments
          </Button>
          <div
            style={{
              borderLeft: "1px solid grey",
              height: "18px",
            }}
          ></div>
          <UseAnimations
            animation={Thumbup}
            onClick={handleToggleLike}
            reverse={article.isLikedByUser}
            render={(eventProps, animationProps) => (
              <Button
                color="transparent"
                tag="div"
                {...eventProps}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <div
                  {...animationProps}
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    marginBottom: "5px",
                    height: "26px",
                  }}
                />
                <span style={{ marginRight: "2px" }}>Like</span>
                <span>
                  {article.numberOfLikes != 0
                    ? `(${article.numberOfLikes})`
                    : ""}
                </span>
              </Button>
            )}
          />
        </ButtonGroup>
        {isCommentOpen ? <CommentsList articleId={article.id} /> : <></>}
      </CardBody>
    </Card>
  );
};
