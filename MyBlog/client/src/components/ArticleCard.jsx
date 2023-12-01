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
import { Link, useNavigate, useParams } from "react-router-dom";
import { VscEllipsis } from "react-icons/vsc";
import { GoEye, GoComment, GoThumbsup } from "react-icons/go";
import { MdDateRange } from "react-icons/md";
import { useAuth } from "../app/auth.jsx";
import { Spinner } from "./Spinner";
import { Tag } from "./Tag";
import { AppReactMarkdown } from "./AppReactMarkdown.jsx";
import { api } from "../app/api.jsx";
import { CommentsList } from "./CommentsList.jsx";

//React Markdown common components
export const rmComponents = {};

export const ArticleCard = ({ article }) => {
  const imageDirectory = `UserData/${article.id}`;
  const [collapsed, setCollapsed] = useState(true);
  const [body, setBody] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { pageNumber, id } = useParams();
  const { user } = useAuth();

  const isInAriclePage = id ?? false;

  useEffect(() => {
    setIsCommentOpen(isInAriclePage);
  }, []);

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
    api.articles.deleteArticle(article.id, user.header).then(() => {
      toggleModal();
      setIsDeleting(false);
      if (pageNumber !== null) navigate(`/articles/page/${pageNumber}`);
      navigate(0); //refresh page
    });
  };

  return (
    <Card className="m-2">
      <CardBody className="m-3">
        <Row>
          <Col xs="11">
            {/* <a href={`/articles/${article.id}`} className="a-article-card-title"> */}
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
                {id ? (
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
        {id ? (
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
        <ButtonGroup style={{ marginTop: "15px" }}>
          <Button
            color="transparent"
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            tag="span"
            style={{ paddingLeft: "0px" }}
          >
            <GoComment
              style={{ marginRight: "8px", height: "20px", width: "20px" }}
            />
            Comments
          </Button>
          <div
            style={{
              borderLeft: "1px solid grey",
              height: "20px",
              marginTop: "10px",
              marginRight: "10px",
            }}
          ></div>
          <Button color="transparent" tag="span">
            <GoThumbsup
              style={{
                marginRight: "8px",
                height: "20px",
                width: "20px",
                marginBottom: "5px",
              }}
            />{" "}
            Like
          </Button>
        </ButtonGroup>
        {isCommentOpen ? <CommentsList articleId={article.id} /> : <></>}
      </CardBody>
    </Card>
  );
};
